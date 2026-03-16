import { useState, type FormEvent } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) { setState('success'); form.reset(); }
      else {
        const json = await res.json();
        setErrorMsg(json?.errors?.[0]?.message || 'Something went wrong.');
        setState('error');
      }
    } catch { setErrorMsg('Network error.'); setState('error'); }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(200, 162, 78, 0.08)', border: '1px solid rgba(200, 162, 78, 0.15)', borderRadius: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A24E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-heading text-lg font-semibold mb-2" style={{ color: '#FAFAFA' }}>Message sent.</h3>
        <p className="text-sm" style={{ color: '#A1A1AA' }}>I'll get back to you within 24-48 hours.</p>
        <button onClick={() => setState('idle')} className="mt-4 text-sm font-mono font-medium" style={{ color: '#C8A24E' }}>
          send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="form-label">name</label>
          <input type="text" id="name" name="name" className="form-input" placeholder="Your name" required disabled={state === 'submitting'} />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">email</label>
          <input type="email" id="email" name="email" className="form-input" placeholder="you@example.com" required disabled={state === 'submitting'} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="inquiry" className="form-label">inquiry type</label>
          <select id="inquiry" name="inquiry" className="form-select" disabled={state === 'submitting'}>
            <option value="freelance">Freelance Project</option>
            <option value="website">Website Development</option>
            <option value="erp">ERP Implementation</option>
            <option value="branding">Brand Identity</option>
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
        <textarea id="message" name="message" className="form-textarea" placeholder="Tell me about your project, timeline, and goals..." required disabled={state === 'submitting'} />
      </div>

      {state === 'error' && <p className="text-sm font-mono" style={{ color: '#EF4444' }}>{errorMsg}</p>}

      <button type="submit" disabled={state === 'submitting'} className="btn-primary w-full justify-center mt-1" style={{ opacity: state === 'submitting' ? 0.6 : 1 }}>
        {state === 'submitting' ? (
          <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg><span>sending...</span></>
        ) : (
          <><span>send message</span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
        )}
      </button>
      <p className="text-center text-xs font-mono mt-2" style={{ color: '#3F3F46' }}>usually replies within 24-48 hours</p>
    </form>
  );
}