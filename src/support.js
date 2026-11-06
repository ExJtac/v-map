import wallet from './support-wallet.json';

export function initSupport() {
  const actions = document.querySelector('#support-payment-actions');
  const qr = document.querySelector('#support-qr');
  const details = document.querySelector('#support-invoice-details');
  const status = document.querySelector('#support-invoice-status');
  const feedback = document.querySelector('#support-copy-status');
  const input = document.querySelector('#support-invoice');
  const open = document.querySelector('#support-open-wallet');
  input.value = wallet.invoice;
  open.href = `lightning:${wallet.invoice}`;
  const expiry = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(new Date(wallet.expiresAt));

  function refresh() {
    const active = Date.now() < Date.parse(wallet.expiresAt);
    actions.hidden = qr.hidden = details.hidden = !active;
    status.textContent = active
      ? `Lightning payment request · expires ${expiry} Mountain time`
      : 'This payment request has expired. Please check back for a new support link.';
    return active;
  }
  open.addEventListener('click', event => {
    if (!refresh()) event.preventDefault();
  });
  document.querySelector('#support-copy-invoice').addEventListener('click', async () => {
    if (!refresh()) return;
    try {
      await navigator.clipboard.writeText(wallet.invoice);
      feedback.textContent = 'Payment request copied.';
    } catch {
      details.open = true;
      input.focus();
      input.select();
      feedback.textContent = 'Select and copy the payment request below.';
    }
  });
  document.addEventListener('visibilitychange', refresh);
  refresh();
}
