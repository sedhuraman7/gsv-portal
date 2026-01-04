'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Interns</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats?.total || 0}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active Interns</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats?.active || 0}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Pending Requests</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats?.pending || 0}</p>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2>Quick Actions</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link href="/dashboard/admin/students" className="btn btn-outline">
                        Review Applications
                    </Link>
                    <button className="btn btn-primary" onClick={() => alert('Feature coming soon: Post Announcement')}>
                        Post Announcement
                    </button>
                    <button className="btn btn-outline" onClick={() => window.location.href = '/api/admin/export'}>
                        Export Data (Excel)
                    </button>
                </div>
            </div>
        </div>
    );
}
