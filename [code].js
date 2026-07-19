import { supabase } from '../../lib/supabaseClient';
import { useState } from 'react';

export async function getServerSideProps({ params }) {
  const code = params.code.toUpperCase();
  const { data: client } = await supabase.from('clients').select('*').eq('code', code).single();

  if (!client) return { props: { found: false } };

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: true });

  const urls = (photos || []).map((p) => ({
    id: p.id,
    url: supabase.storage.from('photos').getPublicUrl(p.path).data.publicUrl,
  }));

  return { props: { found: true, name: client.name, photos: urls } };
}

export default function Gallery({ found, name, photos }) {
  const [lightbox, setLightbox] = useState(null);

  if (!found) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 100 }}>
        <h1 className="fraunces" style={{ fontSize: 26 }}>Lien introuvable</h1>
        <p className="muted">Vérifie le lien auprès de ton photographe.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h1 className="fraunces" style={{ fontSize: 30, marginTop: 32 }}>Bonjour {name}</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        {photos.length} photo{photos.length > 1 ? 's' : ''}
      </p>

      {photos.length === 0 ? (
        <p className="muted">Les photos arrivent bientôt.</p>
      ) : (
        <div className="grid-photos">
          {photos.map((p) => (
            <div key={p.id} className="photo-thumb" style={{ cursor: 'pointer' }} onClick={() => setLightbox(p)}>
              <img src={p.url} alt="" />
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: '#0e0c11ee',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16, padding: 24, zIndex: 50,
          }}
        >
          <img src={lightbox.url} alt="" style={{ maxHeight: '75vh', maxWidth: '100%', borderRadius: 10 }} onClick={(e) => e.stopPropagation()} />
          <a href={lightbox.url} download className="btn" onClick={(e) => e.stopPropagation()}>
            Télécharger
          </a>
        </div>
      )}
    </div>
  );
}
