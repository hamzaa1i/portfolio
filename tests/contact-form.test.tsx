// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContactForm from '../src/components/ContactForm';
let options: Parameters<NonNullable<Window['turnstile']>['render']>[1];
function fill() {
  fireEvent.change(screen.getByLabelText('name'), {target:{value:'Test Visitor'}});
  fireEvent.change(screen.getByLabelText('email'), {target:{value:'visitor@example.com'}});
  fireEvent.change(screen.getByLabelText('message'), {target:{value:'A sufficiently detailed test inquiry.'}});
}
function ready(token='token') { act(()=>options.callback(token)); }
beforeEach(()=>{
  window.turnstile={render:vi.fn((_container,opts)=>{options=opts;return 'widget';}),remove:vi.fn(),reset:vi.fn()};
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({ok:true})}));
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();delete window.turnstile;document.querySelectorAll('[data-turnstile-script]').forEach(e=>e.remove());});
describe('contact form interactions',()=>{
  it('requires security readiness and provides fallback when configuration is absent',()=>{render(<ContactForm/>);expect((screen.getByRole('button',{name:'send message'}) as HTMLButtonElement).disabled).toBe(true);expect(screen.getByRole('link',{name:'email directly'}).getAttribute('href')).toBe('mailto:hamzaali.dev@proton.me');expect(screen.getByRole('status').textContent).toContain('unavailable');});
  it('validates fields before sending',()=>{render(<ContactForm turnstileSiteKey="site"/>);ready();fill();fireEvent.change(screen.getByLabelText('message'),{target:{value:'short'}});fireEvent.submit(document.querySelector('form')!);expect(fetch).not.toHaveBeenCalled();expect(screen.getByRole('alert').textContent).toContain('more project detail');expect(document.activeElement).toBe(screen.getByLabelText('message'));});
  it('submits once, focuses success and remounts security for send another',async()=>{
    let finish!:(value:unknown)=>void;vi.mocked(fetch).mockImplementation(()=>new Promise(resolve=>{finish=resolve;}));
    render(<ContactForm turnstileSiteKey="site"/>);expect(options.action).toBe('portfolio-contact');ready();fill();
    const form=document.querySelector('form')!;fireEvent.submit(form);fireEvent.submit(form);expect(fetch).toHaveBeenCalledTimes(1);expect(screen.getByRole('status').textContent).toContain('Sending');
    await act(async()=>finish({ok:true,json:async()=>({ok:true})}));
    expect(document.activeElement).toBe(screen.getByRole('heading',{name:'Message sent.'}));
    fireEvent.click(screen.getByRole('button',{name:'send another →'}));expect(document.activeElement).toBe(screen.getByLabelText('name'));expect(window.turnstile!.render).toHaveBeenCalledTimes(2);expect((screen.getByRole('button',{name:'send message'}) as HTMLButtonElement).disabled).toBe(true);
  });
  it('preserves content and the submission ID when retrying a failed send',async()=>{
    vi.mocked(fetch).mockResolvedValueOnce({ok:false,json:async()=>({message:'Please retry.'})} as Response).mockResolvedValueOnce({ok:true,json:async()=>({ok:true})} as Response);
    render(<ContactForm turnstileSiteKey="site"/>);ready();fill();fireEvent.submit(document.querySelector('form')!);await screen.findByRole('alert');expect((screen.getByLabelText('name') as HTMLInputElement).value).toBe('Test Visitor');ready('new-token');fireEvent.submit(document.querySelector('form')!);await screen.findByRole('heading',{name:'Message sent.'});
    const bodies=vi.mocked(fetch).mock.calls.map(([,init])=>JSON.parse(init!.body as string));expect(bodies[0].submissionId).toBe(bodies[1].submissionId);expect(bodies[1].turnstileToken).toBe('new-token');
  });
  it('recovers from expired tokens through a fresh widget',()=>{render(<ContactForm turnstileSiteKey="site"/>);ready();act(()=>options['expired-callback']());expect((screen.getByRole('button',{name:'send message'}) as HTMLButtonElement).disabled).toBe(true);fireEvent.click(screen.getByRole('button',{name:'retry security check →'}));expect(window.turnstile!.remove).toHaveBeenCalled();expect(window.turnstile!.render).toHaveBeenCalledTimes(2);ready();expect((screen.getByRole('button',{name:'send message'}) as HTMLButtonElement).disabled).toBe(false);});
  it('offers retry after a script loading failure',async()=>{delete window.turnstile;render(<ContactForm turnstileSiteKey="site"/>);fireEvent.error(document.querySelector('script[data-turnstile-script]')!);await waitFor(()=>expect(screen.getByRole('status').textContent).toContain('unavailable'));const old=document.querySelector('script[data-turnstile-script]');fireEvent.click(screen.getByRole('button',{name:'retry security check →'}));expect(document.querySelector('script[data-turnstile-script]')).not.toBe(old);});
});
