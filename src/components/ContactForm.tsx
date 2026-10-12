import { useEffect, useRef, useState, type FormEvent } from 'react';
import { contactSchema } from '../lib/contact-schema';

type FormState = 'idle' | 'submitting' | 'success' | 'error';
interface Props { turnstileSiteKey?: string; }
interface TurnstileApi {
  render: (container: HTMLElement, options: {
    sitekey: string; action: string; size: 'flexible';
    callback: (token: string) => void;
    'error-callback': () => void; 'expired-callback': () => void;
    'timeout-callback': () => void;
  }) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}
declare global { interface Window { turnstile?: TurnstileApi; } }

export default function ContactForm({ turnstileSiteKey = '' }: Props) {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [token, setToken] = useState('');
  const [securityError, setSecurityError] = useState(false);
  const [widgetAttempt, setWidgetAttempt] = useState(0);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string>();
  const successRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const sendAnotherRef = useRef(false);
  const submittingRef = useRef(false);
  const submissionRef = useRef<{ fingerprint: string; id: string }>();
  const abortRef = useRef<AbortController>();
  const successful = state === 'success';

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    if (successful) successRef.current?.focus();
    else if (sendAnotherRef.current) { nameRef.current?.focus(); sendAnotherRef.current = false; }
  }, [successful]);

  useEffect(() => {
    if (successful) return;
    setToken('');
    setSecurityError(false);
    if (!turnstileSiteKey) { setSecurityError(true); return; }
    let active = true;
    const fail = () => { if (active) { setToken(''); setSecurityError(true); } };
    let timer: number;
    const render = () => {
      if (!active || !turnstileContainerRef.current || !window.turnstile) return;
      try {
        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: turnstileSiteKey, action: 'portfolio-contact', size: 'flexible',
          callback: value => { if (active) { clearTimeout(timer); setToken(value); setSecurityError(false); } },
          'error-callback': fail,
          'expired-callback': fail,
          'timeout-callback': fail,
        });
      } catch { fail(); }
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile-script]');
    if (!window.turnstile && script?.dataset.failed === 'true') { script.remove(); script = null; }
    if (!script && !window.turnstile) {
      script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.dataset.turnstileScript = 'true';
      document.head.appendChild(script);
    }
    const scriptError = () => { if (script) script.dataset.failed = 'true'; fail(); };
    if (window.turnstile) render();
    else { script?.addEventListener('load', render); script?.addEventListener('error', scriptError); }
    // A blocked or stalled script can be replaced on the visitor's next retry.
    timer = window.setTimeout(() => { if (!window.turnstile && script) script.dataset.failed = 'true'; fail(); }, 20_000);
    return () => {
      active = false;
      clearTimeout(timer);
      script?.removeEventListener('load', render);
      script?.removeEventListener('error', scriptError);
      if (turnstileWidgetIdRef.current !== undefined) window.turnstile?.remove(turnstileWidgetIdRef.current);
      turnstileWidgetIdRef.current = undefined;
    };
  }, [turnstileSiteKey, successful, widgetAttempt]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!token) { setSecurityError(true); return; }
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());
    delete fields['cf-turnstile-response'];
    const fingerprint = JSON.stringify(fields);
    if (submissionRef.current?.fingerprint !== fingerprint) {
      submissionRef.current = { fingerprint, id: crypto.randomUUID() };
    }
    const parsed = contactSchema.safeParse({ ...fields, turnstileToken: token, submissionId: submissionRef.current.id });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || 'Please check the form.');
      setState('error');
      const field = form.elements.namedItem(String(parsed.error.issues[0]?.path[0]));
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    submittingRef.current = true;
    setState('submitting');
    setErrorMsg('');
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 30_000);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', body: JSON.stringify(parsed.data), signal: controller.signal,
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (!res.ok || result.ok !== true) throw new Error(result.message || 'Delivery could not be confirmed. Please retry or email directly.');
      setState('success');
      form.reset();
    } catch (error) {
      setErrorMsg(error instanceof Error && error.name !== 'AbortError' && error.name !== 'TypeError'
        ? error.message : 'Delivery could not be confirmed. Please retry this message or email directly.');
      setState('error');
      setToken('');
      setWidgetAttempt(attempt => attempt + 1);
    } finally { clearTimeout(timeout); submittingRef.current = false; }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(200, 162, 78, 0.08)', border: '1px solid rgba(200, 162, 78, 0.15)', borderRadius: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A24E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 ref={successRef} tabIndex={-1} className="font-heading text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Message sent.</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>I'll get back to you within 24-48 hours.</p>
        <button
          onClick={() => {
            submissionRef.current = undefined;
            sendAnotherRef.current = true;
            setState('idle');
          }}
          className="mt-4 text-sm font-mono font-medium"
          style={{ color: '#C8A24E' }}
        >
          send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" aria-busy={state === 'submitting'}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="companyWebsite">Company website</label>
        <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="form-label">name</label>
          <input ref={nameRef} autoComplete="name" minLength={2} maxLength={80} type="text" id="name" name="name" className="form-input" placeholder="Your name" required disabled={state === 'submitting'} />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">email</label>
          <input autoComplete="email" maxLength={160} type="email" id="email" name="email" className="form-input" placeholder="you@example.com" required disabled={state === 'submitting'} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="inquiry" className="form-label">inquiry type</label>
          <select id="inquiry" name="inquiry" className="form-select" disabled={state === 'submitting'}>
            <option value="freelance">Freelance Project</option>
            <option value="website">Website Development</option>
            <option value="erp">ERP Implementation</option>
            <option value="ecommerce">E-commerce Development</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="budget" className="form-label">budget (optional)</label>
          <select id="budget" name="budget" className="form-select" disabled={state === 'submitting'}>
            <option value="">Select range</option>
            <option value="lt1k">Under $1,000</option>
            <option value="1k-3k">$1,000 – $3,000</option>
            <option value="3k-8k">$3,000 – $8,000</option>
            <option value="8k+">$8,000+</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">message</label>
        <textarea minLength={20} maxLength={4000} id="message" name="message" className="form-textarea" placeholder="Tell me about your project, timeline, and goals..." required disabled={state === 'submitting'} />
      </div>

      {turnstileSiteKey && <div ref={turnstileContainerRef} className="cf-turnstile"></div>}

      <p role="status" className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
        {state === 'submitting' ? 'Sending your message…' : securityError ? 'Security check unavailable. Retry or email directly.' : !token ? 'Waiting for the security check…' : ''}
      </p>
      {securityError && turnstileSiteKey && <button type="button" className="text-sm font-mono" onClick={() => setWidgetAttempt(attempt => attempt + 1)}>retry security check →</button>}
      {state === 'error' && <p role="alert" className="text-sm font-mono" style={{ color: '#EF4444' }}>{errorMsg}</p>}

      <button type="submit" disabled={state === 'submitting' || !token} className="btn-primary w-full justify-center mt-1" style={{ opacity: state === 'submitting' ? 0.6 : 1 }}>
        {state === 'submitting' ? (
          <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg><span>sending...</span></>
        ) : (
          <><span>send message</span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
        )}
      </button>
      <p className="text-center text-xs font-mono mt-2" style={{ color: 'var(--text-secondary)' }}>
        usually replies within 24-48 hours · <a href="mailto:hamzaali.dev@proton.me" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>email directly</a> · <a href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>privacy</a>
      </p>
    </form>
  );
}
