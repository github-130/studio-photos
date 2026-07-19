export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body || {};

  if (!process.env.PHOTOGRAPHER_PASSWORD) {
    return res.status(500).json({ ok: false, error: 'PHOTOGRAPHER_PASSWORD manquant côté serveur.' });
  }

  if (password === process.env.PHOTOGRAPHER_PASSWORD) {
    res.setHeader(
      'Set-Cookie',
      `photographer_auth=1; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`
    );
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Mot de passe incorrect.' });
}
