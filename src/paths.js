// Manifest URLs are relative to this app, which can be mounted at / or /vmap/.
export function appUrl(path, base = (import.meta.env && import.meta.env.BASE_URL) || '/') {
  return `${base.replace(/\/?$/, '/')}${path.replace(/^\/+/, '')}`;
}
