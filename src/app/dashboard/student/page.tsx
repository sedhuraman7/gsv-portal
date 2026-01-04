'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StudentDashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Error loading profile</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Welcome, {user.name}</h1>

            {user.status === 'pending' && (
                <div style={{ background: '#fef3c7', color: '#92400e', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid #fcd34d' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Application Under Review</h2>
                    <p>Your internship application is currently being reviewed by the admin. You will receive an email once approved.</p>
                </div>
            )}

            {user.status === 'rejected' && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid #fca5a5' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Application Status: Rejected</h2>
                    <p>Unfortunately, your application was not accepted at this time.</p>
                </div>
            )}

            {user.status === 'approved' && (
                <div>
                    <div style={{ marginBottom: '2rem', background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: 'var(--radius)' }}>
                        <strong>Status: Active Intern</strong> | Domain: {user.domain}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="card">
                            <h2>Daily Attendance</h2>
                            <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>Mark your attendance for today.</p>
                            <button className="btn btn-primary">Mark Present</button>
                        </div>

                        <div className="card">
                            <h2>Pending Tasks</h2>
                            <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>You have no pending tasks.</p>
                            <Link href="/dashboard/student/tasks" className="btn btn-outline">View All Tasks</Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="card" style={{ marginTop: '2rem' }}>
                <h2>Profile Details</h2>
                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Phone:</strong> {user.phone}</div>
                    <div><strong>College:</strong> {user.college}</div>
                    <div><strong>Department:</strong> {user.department}</div>
                </div>
            </div>
        </div>
    );
}
