import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import { checkRateLimit } from '@vercel/firewall';

const headers=new Headers({host:'preview.example.vercel.app','x-real-ip':'203.0.113.10'});
beforeEach(()=>{vi.stubEnv('NODE_ENV','production');vi.stubEnv('VERCEL_AUTOMATION_BYPASS_SECRET','');vi.stubEnv('RATE_LIMIT_SECRET','');vi.stubGlobal('crypto',webcrypto);});
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
describe('real Vercel SDK protocol (transport mocked; no live rule assertion)',()=>{
 it.each([[204,{rateLimited:false}],[429,{rateLimited:true}],[403,{rateLimited:true,error:'blocked'}],[404,{rateLimited:false,error:'not-found'}]])('maps HTTP %s safely',async(status,expected)=>{
  const fetch=vi.fn().mockResolvedValue(new Response(null,{status}));vi.stubGlobal('fetch',fetch);
  expect(await checkRateLimit('portfolio-contact',{headers,timeout:3000})).toEqual(expected);
  const [url,options]=fetch.mock.calls[0];expect(url).toBe('https://preview.example.vercel.app/.well-known/vercel/rate-limit-api/portfolio-contact');
  expect(options.headers.get('x-vercel-rate-limit-api')).toBe('portfolio-contact');expect(options.headers.get('x-vercel-rate-limit-key')).toMatch(/^203\.0\.113\.10-/);
 });
 it('does not permit missing client keys',async()=>{const fetch=vi.fn();vi.stubGlobal('fetch',fetch);await expect(checkRateLimit('portfolio-contact',{headers:new Headers({host:'preview.example.vercel.app'})})).rejects.toThrow('rate limit key');expect(fetch).not.toHaveBeenCalled();});
 it('propagates transport failures for the service fail-closed path',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('unavailable')));await expect(checkRateLimit('portfolio-contact',{headers,timeout:3000})).rejects.toThrow('unavailable');});
});
