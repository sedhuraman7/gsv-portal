'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'student';

    const [role, setRole] = useState(initialRole);
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dbStatus, setDbStatus] = useState<'ok' | 'error' | null>(null);

    useEffect(() => {
        fetch('/api/health')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'error') {
                    setDbStatus('error');
                    setError(data.message);
                } else {
                    setDbStatus('ok');
                }
            })
            .catch(() => setDbStatus('error'));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.append('role', role);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    Create {role === 'admin' ? 'Admin' : 'Student'} Account
                </h2>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <button
                        type="button"
                        className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1 }}
                        onClick={() => setRole('student')}
                    >
                        Student
                    </button>
                    <button
                        type="button"
                        className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1 }}
                        onClick={() => setRole('admin')}
                    >
                        Admin
                    </button>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input name="name" type="text" className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input name="email" type="email" className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input name="password" type="password" className="form-input" required minLength={6} />
                    </div>

                    {role === 'admin' ? (
                        <div className="form-group">
                            <label className="form-label">Admin Secret Code</label>
                            <input name="adminSecret" type="password" className="form-input" placeholder="Enter provided secret code" required />
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input name="phone" type="tel" className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Year of Study</label>
                                    <select name="year" className="form-select" required>
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">College Name</label>
                                <input name="college" type="text" className="form-input" required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    name="department"
                                    className="form-select"
                                    required
                                    onChange={(e) => setDepartment(e.target.value)}
                                >
                                    <option value="">Select Department</option>
                                    <option value="ECE">ECE (Electronics & Communication)</option>
                                    <option value="CSE">CSE (Computer Science)</option>
                                    <option value="IT">IT (Information Technology)</option>
                                    <option value="EEE">EEE (Electrical & Electronics)</option>
                                    <option value="MECH">MECH (Mechanical)</option>
                                    <option value="CIVIL">CIVIL (Civil Engineering)</option>
                                    <option value="AIDS">AIDS (AI & Data Science)</option>
                                    <option value="AIML">AIML (AI & Machine Learning)</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Internship Start Date</label>
                                    <input name="startDate" type="date" className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Internship End Date</label>
                                    <input name="endDate" type="date" className="form-input" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Internship Domain</label>
                                <select name="domain" className="form-select" required key={department}>
                                    <option value="">Select Domain</option>
                                    {department === 'ECE' && (
                                        <>
                                            <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                                            <option value="VLSI Design">VLSI Design</option>
                                            <option value="Robotics & Automation">Robotics & Automation</option>
                                            <option value="MATLAB & Signal Processing">MATLAB & Signal Processing</option>
                                            <option value="PCB Design">PCB Design</option>
                                            <option value="Communication Systems">Communication Systems</option>
                                        </>
                                    )}
                                    <option value="Web Development">Web Development</option>
                                    <option value="App Development">App Development</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Cyber Security">Cyber Security</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Why should we hire you? (Short Bio)</label>
                                <textarea
                                    name="about"
                                    className="form-textarea"
                                    rows={3}
                                    placeholder="Briefly describe your skills and why you are a good fit..."
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Resume / CV Link (Google Drive / LinkedIn)</label>
                                <input
                                    name="resumeUrl"
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    className="form-input"
                                    required
                                />
                                <small style={{ display: 'block', marginTop: '0.25rem', color: '#64748b' }}>
                                    Please ensure the link is publicly accessible (Anyone with link can view).
                                </small>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Already registered? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
