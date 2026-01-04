'use client';

import { useState } from 'react';
import { IoMenu, IoClose } from 'react-icons/io5';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ role }: { role: 'admin' | 'student' }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => pathname === path ? 'active' : '';

    const handleLogout = async () => {
        document.cookie = 'token=; Max-Age=0; path=/;';
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="mobile-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
            </button>

            {/* Sidebar / Drawer */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>GSV Portal</h2>
                    {/* Close button inside drawer for easier access */}
                    <button className="mobile-only-close" onClick={() => setIsOpen(false)}>
                        <IoClose size={24} />
                    </button>
                </div>

                <nav style={{ flex: 1 }}>
                    <div onClick={() => setIsOpen(false)}>
                        {role === 'admin' ? (
                            <>
                                <Link href="/dashboard/admin" className={`sidebar-link ${isActive('/dashboard/admin')}`}>
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/admin/students" className={`sidebar-link ${isActive('/dashboard/admin/students')}`}>
                                    Interns
                                </Link>
                                <Link href="/dashboard/admin/attendance" className={`sidebar-link ${isActive('/dashboard/admin/attendance')}`}>
                                    Attendance
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/dashboard/student" className={`sidebar-link ${isActive('/dashboard/student')}`}>
                                    My Dashboard
                                </Link>
                                <Link href="/dashboard/student/tasks" className={`sidebar-link ${isActive('/dashboard/student/tasks')}`}>
                                    My Tasks
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <button onClick={handleLogout} className="sidebar-link" style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
                    Logout
                </button>
            </aside>

            {/* Backdrop for mobile */}
            {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />}
        </>
    );
}
