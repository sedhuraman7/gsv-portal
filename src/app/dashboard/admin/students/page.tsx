'use client';

import { useEffect, useState } from 'react';

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = () => {
        fetch('/api/admin/students')
            .then(res => res.json())
            .then(data => {
                setStudents(data.students || []);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleStatus = async (userId: string, status: 'approved' | 'rejected') => {
        if (!confirm(`Are you sure you want to ${status} this student?`)) return;

        await fetch('/api/admin/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, status }),
        });
        fetchStudents();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Intern Applications</h1>
                <button onClick={() => window.location.href = '/api/admin/export'} className="btn btn-outline">Export to Excel</button>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Name</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Details</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Domain</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Resume</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{student.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{student.email}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{student.phone}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div>{student.college}</div>
                                    <div style={{ fontSize: '0.875rem' }}>{student.department} - {student.year} Yr</div>
                                    {student.about && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#475569', background: '#f1f5f9', padding: '0.5rem', borderRadius: '4px', fontStyle: 'italic' }}>
                                            "{student.about}"
                                        </div>
                                    )}
                                    {student.startDate && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                                            📅 {student.startDate} to {student.endDate}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>{student.domain}</td>
                                <td style={{ padding: '1rem' }}>
                                    {student.resumeUrl ? (
                                        <a href={student.resumeUrl} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View PDF</a>
                                    ) : 'N/A'}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`badge ${student.status || 'pending'}`}>{(student.status || 'pending').toUpperCase()}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {(!student.status || student.status === 'pending') && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleStatus(student._id, 'approved')} className="btn" style={{ background: 'var(--success)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Approve</button>
                                            <button onClick={() => handleStatus(student._id, 'rejected')} className="btn" style={{ background: 'var(--error)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Reject</button>
                                        </div>
                                    )}
                                    {(student.status && student.status !== 'pending') && <span style={{ color: 'var(--text-secondary)' }}>-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {students.length === 0 && <p style={{ padding: '2rem', textAlign: 'center' }}>No students found.</p>}
            </div>
        </div>
    );
}
