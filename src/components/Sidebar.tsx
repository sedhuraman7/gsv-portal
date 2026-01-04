'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoStatsChart, IoPeople, IoDocumentText, IoMegaphone, IoLogOut } from 'react-icons/io5';

export default function Sidebar({ role }: { role: 'admin' | 'student' }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path ? 'active' : '';

    const handleLogout = async () => {
        // Clear cookies
        document.cookie = 'token=; Max-Age=0; path=/;';
        window.location.href = '/login';
    };

    return (
        <aside className="sidebar">
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>GSV Portal</h2>

            <nav style={{ flex: 1 }}>
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
            </nav>

            <button onClick={handleLogout} className="sidebar-link" style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
                Logout
            </button>
        </aside>
    );
}
