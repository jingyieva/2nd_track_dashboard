export default async function handler(req, res) {
  try {
    const body = req.body || {};
    console.log('[CSP-REPORT]', JSON.stringify(body));
  } catch (e) {
    console.error('[CSP-REPORT] parse error', e);
  }
  res.status(204).end(); // 回傳 No Content
}
