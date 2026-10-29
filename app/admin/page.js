'use client';

import { useState, useEffect } from 'react';
import { getLevelForXp } from '@/lib/models';
import { COURSES } from '@/lib/courses';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('users'); // users | submissions
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setAuthed(true);
          setUsers(data.users || []);
          fetchSubmissions();
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Password salah');
    setAuthed(true);
    setPassword('');
    fetchUsers();
    fetchSubmissions();
  }

  async function fetchUsers() {
    setLoading(true);
    const r = await fetch('/api/admin/users');
    const data = await r.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  async function fetchSubmissions() {
    const r = await fetch('/api/admin/submissions');
    const data = await r.json();
    setSubmissions(data.submissions || []);
  }

  async function verifySubmission(id, action) {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId: id, action }),
    });
    if (res.ok) {
      fetchSubmissions();
      fetchUsers();
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
  }

  if (!authed) {
    return (
      <>
        <div className="bg-blob b1" /><div className="bg-blob b2" /><div className="bg-blob b3" />
        <div id="authScreen">
          <div className="auth-wrap">
            <div className="auth-brand">
              <div className="logo-mark">🔐</div>
              <h1>Admin Panel</h1>
              <p>DailySuccess — verifikasi aktivitas pengguna</p>
            </div>
            <div className="auth-card glass">
              {error && <div className="auth-error show">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Password Admin</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Masuk Admin
                </button>
              </form>
            </div>
            <div className="auth-footer">
              Khusus pengelola — dibuat oleh <strong>aiproxcrop</strong>
            </div>
          </div>
        </div>
      </>
    );
  }

  const filtered = submissions.filter((s) => filterStatus === 'all' || s.status === filterStatus);
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <>
      <div className="bg-blob b1" /><div className="bg-blob b2" /><div className="bg-blob b3" />
      <div className="admin-page">
        <div className="admin-header glass">
          <div>
            <h1>Admin Panel</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: 4 }}>
              Monitor pengguna dan verifikasi bukti pembelajaran
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { fetchUsers(); fetchSubmissions(); }}>
              ⟳ Refresh
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Keluar</button>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>
            Pengguna ({users.length})
          </button>
          <button className={tab === 'submissions' ? 'active' : ''} onClick={() => setTab('submissions')}>
            Verifikasi {pendingCount > 0 && <span className="badge pending">{pendingCount} baru</span>}
          </button>
        </div>

        {tab === 'users' && (
          <div className="glass" style={{ padding: 20, overflow: 'auto' }}>
            {loading ? (
              <div className="empty-state">Memuat pengguna...</div>
            ) : users.length === 0 ? (
              <div className="empty-state">Belum ada pengguna terdaftar.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Agama</th>
                    <th>Level</th>
                    <th>XP</th>
                    <th>Karakter</th>
                    <th>Tugas</th>
                    <th>Bergabung</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const lv = getLevelForXp(u.xp || 0);
                    const done = Object.values(u.completedTasks?.[u.modelId] || {}).filter(Boolean).length;
                    return (
                      <tr key={u.email}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td style={{ textTransform: 'capitalize' }}>{u.religion}</td>
                        <td><span className="badge level">Lv.{lv.level} {lv.name}</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--emerald-dark)' }}>{u.xp || 0}</td>
                        <td>{u.modelId || '—'}</td>
                        <td>{done} tugas</td>
                        <td>{new Date(u.joinedAt).toLocaleDateString('id-ID')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'submissions' && (
          <>
            <div className="filter-tabs" style={{ justifyContent: 'flex-start' }}>
              {['pending', 'verified', 'rejected', 'all'].map((s) => (
                <button
                  key={s}
                  className={filterStatus === s ? 'active' : ''}
                  onClick={() => setFilterStatus(s)}
                >
                  {s === 'pending' ? 'Menunggu' : s === 'verified' ? 'Terverifikasi' : s === 'rejected' ? 'Ditolak' : 'Semua'}
                </button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div className="glass" style={{ padding: 40 }}>
                <div className="empty-state">Tidak ada submission di kategori ini.</div>
              </div>
            ) : (
              filtered.map((sub) => {
                const course = COURSES.find((c) => c.id === sub.courseId);
                const lesson = course?.lessons.find((l) => l.id === sub.lessonId);
                return (
                  <div key={sub.id} className="submission-card glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h4>{course?.title || sub.courseId} — {lesson?.title || sub.lessonId}</h4>
                        <div className="meta">
                          Dari: <strong>{sub.userEmail}</strong> · {new Date(sub.submittedAt).toLocaleString('id-ID')}
                        </div>
                      </div>
                      <span className={`badge ${sub.status}`}>
                        {sub.status === 'pending' ? 'Menunggu' : sub.status === 'verified' ? 'Terverifikasi' : 'Ditolak'}
                      </span>
                    </div>
                    <div className="proof">{sub.proof}</div>
                    {sub.status === 'pending' && (
                      <div className="actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => verifySubmission(sub.id, 'verify')}
                        >
                          ✓ Verifikasi (+50 XP)
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => verifySubmission(sub.id, 'reject')}
                        >
                          ✕ Tolak
                        </button>
                      </div>
                    )}
                    {sub.reviewedAt && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 10 }}>
                        Direview: {new Date(sub.reviewedAt).toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </>
  );
}
