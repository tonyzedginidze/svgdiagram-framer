const SERVICE_URL = 'https://svgdiagram.ai/rest/v1/framer';
const INSTALLATION_KEY = 'svgdiagram-framer-installation-id';

export function installationId(storage = localStorage) {
  let id = storage.getItem(INSTALLATION_KEY);
  if (!id) { id = crypto.randomUUID(); storage.setItem(INSTALLATION_KEY, id); }
  return id;
}

export async function service(path, body = {}, request = fetch) {
  let response;
  try {
    response = await request(`${SERVICE_URL}/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ installationId: installationId(), ...body }) });
  } catch { throw new Error('SVG Diagram is unreachable. Check your connection and retry the same request.'); }
  let result;
  try { result = await response.json(); } catch { result = {}; }
  if (!response.ok) {
    const detail = typeof result?.error === 'string' && response.status < 500 ? result.error : null;
    const error = new Error(detail || (response.status >= 500 ? 'The diagram could not be generated and was not counted. Try again or rephrase your prompt.' : 'The request was rejected. Update the plugin and try again.'));
    error.code = result?.code;
    throw error;
  }
  return result;
}
