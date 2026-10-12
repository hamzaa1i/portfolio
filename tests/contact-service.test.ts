import { describe, it, expect, vi } from 'vitest';
import { handleContact, parseRecipients, parseSender, MAX_BODY_BYTES } from '../src/lib/contact-service';
const env = {
  CONTACT_TO_EMAIL: 'hamzaali.dev@proton.me,hamzaali.work.pk@gmail.com',
  CONTACT_FROM_EMAIL: 'Portfolio <contact@hamzaalikhurram.com>',
  RESEND_API_KEY: 'test-only-key', TURNSTILE_SECRET_KEY: 'test-only-secret', PUBLIC_TURNSTILE_SITE_KEY: 'test-only-site',
};
const payload = { name: 'Test Visitor', email: 'visitor@example.com', inquiry: 'website', budget: '1k-3k', message: 'A test inquiry with sufficient detail.', turnstileToken: 'fresh-token', submissionId: '7f7f5b8e-2ec1-4b41-9f25-4b986a63726e' };
function request(data: unknown = payload, options: {host?: string; headers?: Record<string,string>; raw?: string; method?: string} = {}) {
  const origin = `https://${options.host || 'hamzaalikhurram.com'}`;
  return new Request(`${origin}/api/contact`, { method: options.method || 'POST', headers: { origin, 'content-type': 'application/json', ...options.headers }, body: options.method === 'GET' ? undefined : options.raw ?? JSON.stringify(data) });
}
function dependencies(verification: unknown = { success: true, hostname: 'hamzaalikhurram.com', action: 'portfolio-contact' }) {
  return { rateLimit: vi.fn().mockResolvedValue({ rateLimited: false }), fetch: vi.fn().mockResolvedValueOnce(Response.json(verification)).mockResolvedValue(Response.json({ id: 'email-id' })) };
}
describe('recipient and sender configuration', () => {
  it.each([
    ['one@example.com', ['one@example.com']],
    ['one@example.com,two@example.com', ['one@example.com','two@example.com']],
    [' one@example.com , two@example.com ', ['one@example.com','two@example.com']],
    ['ONE@example.com,one@example.com', ['one@example.com']],
  ])('parses %s', (input, expected) => expect(parseRecipients(input as string)).toEqual(expected));
  it.each([undefined, '', 'bad', 'one@example.com,', 'one@example.com,bad', 'one@example.com\nBcc: other@example.com'])('rejects invalid recipient config %s', input => expect(() => parseRecipients(input)).toThrow());
  it('allows the verified sender', () => expect(parseSender(env.CONTACT_FROM_EMAIL)).toBe(env.CONTACT_FROM_EMAIL));
  it.each(['Portfolio <attacker@example.com>', '', 'contact@hamzaalikhurram.com\r\nBcc: a@b.com'])('rejects sender %s', value => expect(() => parseSender(value)).toThrow());
});
describe('contact endpoint', () => {
  it('delivers to both recipients with visitor Reply-To and safe response', async () => {
    const deps=dependencies(); const result=await handleContact(request(),env,deps);
    expect(result.status).toBe(200); expect(result.headers.get('cache-control')).toBe('no-store');
    const mail=JSON.parse(deps.fetch.mock.calls[1][1].body);
    expect(mail.to).toEqual(['hamzaali.dev@proton.me','hamzaali.work.pk@gmail.com']);
    expect(mail.reply_to).toBe(payload.email); expect(mail.from).toBe(env.CONTACT_FROM_EMAIL);
    expect(mail.subject).toBe('Portfolio inquiry: website — Test Visitor'); expect(mail.text).toContain(payload.message);
  });
  it.each(['RESEND_API_KEY','CONTACT_TO_EMAIL','CONTACT_FROM_EMAIL','TURNSTILE_SECRET_KEY','PUBLIC_TURNSTILE_SITE_KEY'])('fails closed without %s', async key => {
    const deps=dependencies(); expect((await handleContact(request(),{...env,[key]:''},deps,true)).status).toBe(503); expect(deps.fetch).not.toHaveBeenCalled();
  });
  it('does not silently discard a malformed second recipient', async () => expect((await handleContact(request(),{...env,CONTACT_TO_EMAIL:'one@example.com,bad'},dependencies())).status).toBe(503));
  it.each([
    [{success:false,'error-codes':['timeout-or-duplicate']},400],
    [{success:true,hostname:'attacker.example',action:'portfolio-contact'},400],
    [{success:true,hostname:'hamzaalikhurram.com',action:'other'},400],
    [{success:true},400],
  ])('rejects failed or mismatched Turnstile metadata',async (result,status)=> { const deps=dependencies(result); expect((await handleContact(request(),env,deps)).status).toBe(status); expect(deps.fetch).toHaveBeenCalledTimes(1); });
  it('requires a token',async()=>{ const deps=dependencies(); expect((await handleContact(request({...payload,turnstileToken:''}),env,deps)).status).toBe(400);expect(deps.fetch).not.toHaveBeenCalled(); });
  it('handles verification timeout',async()=>{ const deps=dependencies();deps.fetch.mockReset().mockRejectedValue(new DOMException('timeout','TimeoutError'));expect((await handleContact(request(),env,deps)).status).toBe(503); });
  it('handles verification outage',async()=>{ const deps=dependencies();deps.fetch.mockReset().mockResolvedValue(new Response('unavailable',{status:503}));expect((await handleContact(request(),env,deps)).status).toBe(503); });
  it('accepts a configured preview hostname',async()=>{ const host='portfolio-git-feature.example.vercel.app';const deps=dependencies({success:true,hostname:host,action:'portfolio-contact'});expect((await handleContact(request(payload,{host}),{...env,VERCEL_BRANCH_URL:host},deps)).status).toBe(200); });
  it('rejects unapproved hostnames',async()=>expect((await handleContact(request(payload,{host:'attacker.example'}),env,dependencies())).status).toBe(503));
  it.each([{rateLimited:false,error:'not-found'},{rateLimited:false,error:'timeout'}])('fails closed if durable rate limiting is unavailable',async result=>{const deps=dependencies();deps.rateLimit.mockResolvedValue(result);expect((await handleContact(request(),env,deps)).status).toBe(503);expect(deps.fetch).not.toHaveBeenCalled();});
  it('handles the rate limit and returns retry guidance',async()=>{const deps=dependencies();deps.rateLimit.mockResolvedValue({rateLimited:true});const result=await handleContact(request(),env,deps);expect(result.status).toBe(429);expect(result.headers.get('retry-after')).toBe('60');expect(deps.fetch).not.toHaveBeenCalled();});
  it('handles rate service exceptions',async()=>{const deps=dependencies();deps.rateLimit.mockRejectedValue(new Error('private'));expect((await handleContact(request(),env,deps)).status).toBe(503);});
  it('rejects other methods',async()=>expect((await handleContact(request(undefined,{method:'GET'}),env,dependencies())).status).toBe(405));
  it.each([{origin:'https://attacker.example'},{'sec-fetch-site':'cross-site'}])('rejects cross-origin requests',async headers=>expect((await handleContact(request(payload,{headers}),env,dependencies())).status).toBe(403));
  it('rejects unsupported content',async()=>expect((await handleContact(request(payload,{headers:{'content-type':'text/plain'}}),env,dependencies())).status).toBe(415));
  it('rejects invalid JSON',async()=>expect((await handleContact(request(payload,{raw:'{' }),env,dependencies())).status).toBe(400));
  it.each([{message:'short'},{email:'invalid'},{name:'Header\nInjection'},{message:'a'.repeat(4001)},{submissionId:'bad'}])('validates visitor fields',async patch=>expect((await handleContact(request({...payload,...patch}),env,dependencies())).status).toBe(422));
  it.each([{}, {'content-length':String(MAX_BODY_BYTES+1)}])('bounds the body even without a length header',async headers=>expect((await handleContact(request(payload,{raw:'x'.repeat(MAX_BODY_BYTES+1),headers}),env,dependencies())).status).toBe(413));
  it('silently handles the honeypot without sending',async()=>{const deps=dependencies();expect((await handleContact(request({...payload,companyWebsite:'spam'}),env,deps)).status).toBe(200);expect(deps.fetch).not.toHaveBeenCalled();});
  it('keeps retry idempotency stable across fresh Turnstile tokens',async()=>{
    const keys=[];
    for(const token of ['first','second']) {const deps=dependencies();await handleContact(request({...payload,turnstileToken:token}),env,deps);keys.push(deps.fetch.mock.calls[1][1].headers['Idempotency-Key']);}
    expect(keys[0]).toBe(keys[1]);expect(keys[0]).toMatch(/^portfolio-[a-f0-9]{64}$/);
  });
  it('hides delivery errors and retains safe retry guidance',async()=>{const deps=dependencies();deps.fetch.mockReset().mockResolvedValueOnce(Response.json({success:true,hostname:'hamzaalikhurram.com',action:'portfolio-contact'})).mockResolvedValueOnce(Response.json({message:'private credentials'},{status:500}));const result=await handleContact(request(),env,deps);expect(result.status).toBe(502);expect(await result.text()).not.toContain('private');});
});
