import wallet from './support-wallet.json';

export function initSupport() {
  const actions = document.querySelector('#support-payment-actions');
  const qr = document.querySelector('#support-qr');
  const details = document.querySelector('#support-invoice-details');
  const status = document.querySelector('#support-invoice-status');
  const feedback = document.querySelector('#support-copy-status');
  const input = document.querySelector('#support-invoice');
  const open = document.querySelector('#support-open-wallet');
  const headerQr = document.querySelector('#header-support-qr');
  const headerStatus = document.querySelector('#header-support-status');
  const expiry = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(new Date(wallet.expiresAt));
  const shortExpiry = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver', month: 'short', day: 'numeric',
  }).format(new Date(wallet.expiresAt));
  let expiryTimer;
  function refresh() {
    clearTimeout(expiryTimer);
    const remaining = Date.parse(wallet.expiresAt) - Date.now();
    const lightningActive = remaining > 0;
    const request = lightningActive ? wallet.paymentRequest : `bitcoin:${wallet.bitcoinAddress}`;
    input.value = request;
    open.href = request;
    actions.hidden = qr.hidden = details.hidden = false;
    if (headerQr) headerQr.hidden = false;
    if (headerStatus) headerStatus.textContent = lightningActive
      ? `Bitcoin + Lightning · Lightning expires ${shortExpiry}` : 'Bitcoin on-chain';
    status.textContent = lightningActive
      ? `Bitcoin address available · optional Lightning invoice expires ${expiry} Mountain time`
      : 'The Lightning option has expired. The Bitcoin address remains available; wallet links and copied requests now use on-chain Bitcoin.';
    if (lightningActive) expiryTimer = setTimeout(refresh, Math.min(remaining + 1, 2147483647));
    return request;
  }
  open.addEventListener('click', refresh);
  document.querySelector('#support-copy-invoice').addEventListener('click', async () => {
    const request = refresh();
    try {
      await navigator.clipboard.writeText(request);
      feedback.textContent = 'Bitcoin payment request copied.';
    } catch {
      details.open = true;
      input.focus(); input.select();
      feedback.textContent = 'Select and copy the Bitcoin payment request below.';
    }
  });
  document.addEventListener('visibilitychange', refresh);
  refresh();
}
