import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, randomCode } from '../lib/supabaseClient';

export async function getServerSideProps({ req }) {
  const authed = req.cookies?.photographer_auth === '1';
  return { props: { authed } };
}

export default function Photographe({ authed }) {
  if (!authed) return <LoginForm />;
  return <Dashboard />;
}

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Erreur de connexion.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 360, paddingTop: 120, textAlign: 'center' }}>
      <h1 className="fraunces" style={{ fontSize: 28, marginBottom: 20 }}>Espace photographe</h1>
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        style={{ width: '100%', marginBottom: 12 }}
      />
      <button className="btn" style={{ width: '100%' }} onClick={submit} disabled={loading}>
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
    </div>
  );
}

function Dashboard() {
  const [clients, setClients] = useState(null);
  const [selected, setSelected] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newName, setNewName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  const loadClients = useCallback(async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    setClients(data || []);
  }, []);

  useEffect(() => { loadClients(); }, [loadClients]);

  const addClient = async () => {
    const name = newName.trim();
    if (!name) return;
    const { data, error } = await supabase
      .from('clients')
      .insert({ name, code: randomCode() })
      .select()
      .single();
    if (!error) {
      setNewName('');
      await loadClients();
      setSelected(data);
    }
  };

  const removeClient = async (id) => {
    await supabase.from('clients').delete().eq('id', id);
    if (selected?.id === id) setSelected(null);
    await loadClients();
  };

  const loadPhotos = useCallback(async (clientId) => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true });
    setPhotos(data || []);
  }, []);

  useEffect(() => {
    if (selected) loadPhotos(selected.id);
    else setPhotos([]);
  }, [selected, loadPhotos]);

  const handleUpload = async (files) => {
    if (!selected || !files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const path = `${selected.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('photos').upload(path, file);
      if (!upErr) {
        await supabase.from('photos').insert({ client_id: selected.id, path });
      }
    }
    await loadPhotos(selected.id);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removePhoto = async (photo) => {
    await supabase.storage.from('photos').remove([photo.path]);
    await supabase.from('photos').delete().eq('id', photo.id);
    await loadPhotos(selected.id);
  };

  const publicUrl = (path) => supabase.storage.from('photos').getPublicUrl(path).data.publicUrl;

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.reload();
  };

  if (clients === null) return <div className="container">Chargement…</div>;

  return (
    <div className="container" style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="fraunces" style={{ fontSize: 26 }}>Espace photographe</h1>
        <button className="btn-ghost" onClick={logout}>Se déconnecter</button>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ width: 280 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Nom du client"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addClient()}
              style={{ flex: 1 }}
            />
            <button className="btn" onClick={addClient}>+</button>
          </div>
          {clients.length === 0 && <p className="muted" style={{ fontSize: 14 }}>Aucun client pour l'instant.</p>}
          {clients.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className="card"
              style={{
                marginBottom: 8,
                cursor: 'pointer',
                borderColor: selected?.id === c.id ? 'var(--accent)' : 'var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>#{c.code}</div>
              </div>
              <button
                className="btn-ghost"
                style={{ padding: '4px 8px', fontSize: 12 }}
                onClick={(e) => { e.stopPropagation(); removeClient(c.id); }}
              >
                Suppr.
              </button>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 280 }}>
          {!selected ? (
            <p className="muted">Sélectionne un client à gauche.</p>
          ) : (
            <>
              <h2 className="fraunces" style={{ fontSize: 22, marginBottom: 12 }}>{selected.name}</h2>
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div className="muted" style={{ fontSize: 12 }}>Lien à donner au client</div>
                  <div className="accent fraunces" style={{ fontSize: 15 }}>
                    {typeof window !== 'undefined' ? `${window.location.origin}/g/${selected.code}` : `/g/${selected.code}`}
                  </div>
                </div>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    navigator.clipboard?.writeText(`${window.location.origin}/g/${selected.code}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? 'Copié ✓' : 'Copier'}
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleUpload(e.target.files)}
              />
              <button className="btn" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ marginBottom: 16 }}>
                {uploading ? 'Envoi en cours…' : 'Ajouter des photos'}
              </button>

              {photos.length === 0 ? (
                <p className="muted">Pas encore de photo.</p>
              ) : (
                <div className="grid-photos">
                  {photos.map((p) => (
                    <div key={p.id} className="photo-thumb">
                      <img src={publicUrl(p.path)} alt="" />
                      <button
                        onClick={() => removePhoto(p)}
                        style={{
                          position: 'absolute', top: 6, right: 6, border: 'none',
                          background: '#17141ccc', color: '#fff', borderRadius: '50%',
                          width: 24, height: 24, cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
