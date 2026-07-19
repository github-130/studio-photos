import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: 100 }}>
      <h1 className="fraunces" style={{ fontSize: 36 }}>Studio Photo</h1>
      <p className="muted" style={{ marginBottom: 32 }}>
        Le photographe dépose les photos, chaque client retrouve les siennes avec son lien.
      </p>
      <Link href="/photographe" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
        Espace photographe
      </Link>
    </div>
  );
}
