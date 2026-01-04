import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <h1 className={styles.title}>GSV Company</h1>
        <p className={styles.subtitle}>
          Empowering the next generation of tech leaders through our
          Admin & Internship Management Portal.
        </p>
        <div className={styles.actions}>
          <Link href="/register?role=student" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
            Apply for Internship
          </Link>
          <Link href="/login" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '1rem 2rem', fontSize: '1.2rem' }}>
            Login
          </Link>
        </div>
      </section>

      <section className={`container ${styles.features}`}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Why Join GSV?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>🚀 Real World Projects</h3>
            <p>Work on live projects and gain hands-on experience in modern tech stacks.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>👥 Mentorship</h3>
            <p>Get guided by industry experts and improve your coding standards.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📜 Certification</h3>
            <p>Receive a verified certificate of completion upon successful internship.</p>
          </div>
        </div>
      </section>

      <footer style={{ background: '#0f172a', color: 'white', padding: '2rem', textAlign: 'center' }}>
        <p>&copy; 2026 GSV Company. All rights reserved.</p>
      </footer>
    </main>
  );
}
