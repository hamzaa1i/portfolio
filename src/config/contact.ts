// Switch only after hello@ inbound delivery has been independently verified.
export const publicContactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL === 'hello@hamzaalikhurram.com'
  ? 'hello@hamzaalikhurram.com' : 'hamzaali.dev@proton.me';
