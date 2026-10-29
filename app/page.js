'use client';

import { useState, useEffect } from 'react';
import { MODELS, LEVELS, getLevelForXp } from '@/lib/models';
import { COURSES } from '@/lib/courses';

export default function HomePage() {
  const [view, setView] = useState('loading'); // loading | auth | select | dashboard
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [authTab, setAuthTab] = useState('login');
  const [error, setError] = useState('');
  const [selectFilter, setSelectFilter] = useState('mine');
  const [showModelModal, setShowModelModal] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ---- Toast helper ----
  function toast(msg, type = '') {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  }

  // ---- Load session ----
  useEffect(() => {
    fetch('/api/user')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setView(data.user.modelId ? 'dashboard' : 'select');
        } else {
          setView('auth');
        }
      })
      .catch(() => setView('auth'));
  }, []);

  // ---- Fetch leaderboard + submissions when logged in ----
  useEffect(() => {
    if (!user) return;
    fetchLeaderboard();
    fetchSubmissions();
  }, [user?.email, user?.xp]);

  async function fetchLeaderboard() {
    try {
      const r = await fetch('/api/leaderboard');
      const data = await r.json();
      setLeaderboard(data.users || []);
    } catch {}
  }
  async function fetchSubmissions() {
    try {
      const r = await fetch('/api/courses/my-submissions');
      const data = await r.json();
      setSubmissions(data.submissions || []);
    } catch {}
  }

  // ---- Auth ----
  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.target);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        password: form.get('password'),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Gagal masuk');
    setUser(data.user);
    setView(data.user.modelId ? 'dashboard' : 'select');
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.target);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
        religion: form.get('religion'),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Gagal daftar');
    setUser(data.user);
    setView('select');
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setLeaderboard([]);
    setSubmissions([]);
    setView('auth');
  }

  // ---- Model pick ----
  async function pickModel(modelId) {
    const res = await fetch('/api/user/model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId }),
    });
    const data = await res.json();
    if (!res.ok) return toast(data.error || 'Gagal', 'error');
    setUser(data.user);
    setShowModelModal(false);
    setView('dashboard');
    toast(`Karakter "${MODELS[modelId].name}" dipilih!`);
  }

  // ---- Task toggle ----
  async function toggleTask(task) {
    if (!user.modelId) return;
    const res = await fetch('/api/user/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modelId: user.modelId,
        taskId: task.id,
      }),
    });
    const data = await res.json();
    if (!res.ok) return toast(data.error || 'Gagal', 'error');
    setUser(data.user);
    toast(data.message);
  }

  // ---- Submit course proof ----
  async function submitProof(e) {
    e.preventDefault();
    if (!activeCourse) return;
    setSubmitting(true);
    const form = new FormData(e.target);
    const res = await fetch('/api/courses/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: activeCourse.id,
        lessonId: form.get('lessonId'),
        proof: form.get('proof'),
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) return toast(data.error || 'Gagal', 'error');
    toast('Bukti terkirim! Menunggu verifikasi admin.');
    setActiveCourse(null);
    fetchSubmissions();
  }

  // ---- Loading ----
  if (view === 'loading') {
    return (
      <>
        <div className="bg-blob b1" /><div className="bg-blob b2" /><div className="bg-blob b3" />
        <div className="loading-wrap">
          <div className="spinner" />
          <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>Memuat DailySuccess...</p>
        </div>
      </>
    );
  }

  // ---- Auth ----
  if (view === 'auth') {
    return (
      <>
        <div className="bg-blob b1" /><div className="bg-blob b2" /><div className="bg-blob b3" />
        <ToastWrap toasts={toasts} />
        <div id="authScreen">
          <div className="auth-wrap">
            <div className="auth-brand">
              <div className="logo-mark">🌱</div>
              <h1>DailySuccess</h1>
              <p>Focus And Success — Mulai dari nol, tumbuh setiap hari</p>
            </div>
            <div className="auth-card glass">
              <div className="auth-tabs">
                <button className={authTab === 'login' ? 'active' : ''} onClick={() => { setAuthTab('login'); setError(''); }}>Masuk</button>
                <button className={authTab === 'register' ? 'active' : ''} onClick={() => { setAuthTab('register'); setError(''); }}>Daftar</button>
              </div>
              {error && <div className="auth-error show">{error}</div>}
              {authTab === 'login' ? (
                <form onSubmit={handleLogin}>
                  <div className="field">
                    <label>Email</label>
                    <input name="email" type="email" placeholder="nama@email.com" required />
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <input name="password" type="password" placeholder="••••••••" required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Masuk Sekarang</button>
                </form>
              ) : (
                <form onSubmit={handleRegister}>
                  <div className="field">
                    <label>Nama Lengkap</label>
                    <input name="name" type="text" placeholder="Nama kamu" required />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input name="email" type="email" placeholder="nama@email.com" required />
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <input name="password" type="password" placeholder="Minimal 6 karakter" required />
                  </div>
                  <div className="field">
                    <label>Agama</label>
                    <select name="religion" required defaultValue="">
                      <option value="" disabled>— Pilih Agama —</option>
                      <option value="islam">Islam</option>
                      <option value="kristen">Kristen</option>
                      <option value="hindu">Hindu</option>
                      <option value="buddha">Buddha</option>
                      <option value="umum">Umum / Lainnya</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Buat Akun</button>
                </form>
              )}
            </div>
            <div className="auth-footer">
              DailySuccess v2 — dibuat oleh <strong>aiproxcrop</strong>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ---- Model selection ----
  if (view === 'select') {
    const models = Object.values(MODELS).filter(
      (m) => selectFilter === 'all' || m.religion === user.religion
    );
    return (
      <>
        <div className="bg-blob b1" /><div className="bg-blob b2" /><div className="bg-blob b3" />
        <ToastWrap toasts={toasts} />
        <nav className="topnav">
          <div className="nav-brand"><span className="mark">🌱</span>DailySuccess</div>
          <button className="logout-btn" onClick={handleLogout}>Keluar</button>
        </nav>
        <div className="container">
          <div className="select-header">
            <h2>Pilih Karakter Teladanmu</h2>
            <p>Setiap karakter punya rutinitas harian berbeda. Pilih yang sesuai agama dan tujuanmu.</p>
          </div>
          <div className="filter-tabs">
            <button className={selectFilter === 'mine' ? 'active' : ''} onClick={() => setSelectFilter('mine')}>Sesuai Agama Saya</button>
            <button className={selectFilter === 'all' ? 'active' : ''} onClick={() => setSelectFilter('all')}>Lihat Semua</button>
          </div>
          <div className="model-grid">
            {models.map((m) => (
              <div key={m.id} className="model-card glass">
                <div className="mc-icon">{m.icon}</div>
                <div>
                  <div className="mc-name">{m.name}</div>
                  <div className="mc-title">{m.title}</div>
                </div>
                <div className="mc-desc">{m.desc}</div>
                <button className="mc-pick" onClick={() => pickModel(m.id)}>Pilih Karakter Ini</button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ---- Dashboard ----
  const model = MODELS[user.modelId];
  const level = getLevelForXp(user.xp || 0);
  const levelProgress = level.max === Infinity ? 100 : Math.round(((user.xp - level.min) / (level.max - level.min)) * 100);
  const completedTaskIds = (user.completedTasks?.[user.modelId] || {});
  const completedCount = Object.values(completedTaskIds).filter(Boolean).length;
  const totalTasks = model.tasks.length;
  const taskPct = Math.round((completedCount / totalTasks) * 100);
  const myRank = leaderboard.findIndex((u) => u.email === user.email) + 1;

  return (
    <>
      <div className="bg-blob b1" /><div className="bg-blob b2" /><div className="bg-blob b3" />
      <ToastWrap toasts={toasts} />
      <nav className="topnav">
        <div className="nav-brand"><span className="mark">🌱</span>DailySuccess</div>
        <div className="user-area">
          <div className="user-chip">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="user-meta">
              <div className="name">{user.name}</div>
              <div className="lvl">Lv. {level.level} · {level.name}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Keluar</button>
        </div>
      </nav>

      <div className="container">
        {/* Welcome + XP */}
        <section className="welcome-block glass">
          <div className="welcome-text">
            <h1>Selamat datang, <span className="accent">{user.name}</span> 👋</h1>
            <p>{model.desc}</p>
          </div>
          <div className="xp-panel">
            <div className="xp-head">
              <span className="lv-tag">Level {level.level} · {level.name}</span>
              <span className="xp-count">
                {level.max === Infinity ? `${user.xp} XP (Max)` : `${user.xp} / ${level.max} XP`}
              </span>
            </div>
            <div className="xp-bar"><div className="xp-fill" style={{ width: `${levelProgress}%` }} /></div>
            <div className="xp-hint">
              {level.max === Infinity ? 'Level tertinggi tercapai!' : `${level.max - user.xp} XP lagi menuju level berikutnya`}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="stat-grid">
          <div className="stat-card glass">
            <div className="label">Total XP</div>
            <div className="value accent">{user.xp.toLocaleString('id-ID')}</div>
            <div className="desc">Poin pengalamanmu</div>
          </div>
          <div className="stat-card glass">
            <div className="label">Ranking Global</div>
            <div className="value">#{myRank || '—'}</div>
            <div className="desc">dari {leaderboard.length} pengguna</div>
          </div>
          <div className="stat-card glass">
            <div className="label">Tugas Hari Ini</div>
            <div className="value">{completedCount} / {totalTasks}</div>
            <div className="desc">{completedCount === totalTasks ? 'Semua selesai! 🎉' : `${totalTasks - completedCount} tugas tersisa`}</div>
          </div>
          <div className="stat-card glass">
            <div className="label">Karakter Teladan</div>
            <div className="value" style={{ fontSize: '1.05rem', lineHeight: 1.3 }}>{model.name}</div>
            <div className="desc">Model harianmu</div>
          </div>
        </section>

        {/* Main grid */}
        <div className="main-grid">
          {/* Tasks */}
          <section className="tasks-panel glass">
            <div className="panel-head"><h2>Rutinitas Hari Ini</h2></div>
            <div className="model-badge">
              <div className="icon">{model.icon}</div>
              <div className="info">
                <div className="title">{model.name}</div>
                <div className="sub">{model.title}</div>
              </div>
              <button className="change-btn" onClick={() => setShowModelModal(true)}>Ganti</button>
            </div>
            <div className="task-list">
              {model.tasks.map((task) => {
                const done = !!completedTaskIds[task.id];
                return (
                  <div key={task.id} className={`task-item ${done ? 'done' : ''}`} onClick={() => toggleTask(task)}>
                    <div className="task-check">✓</div>
                    <div className="task-body">
                      <div className="task-title">{task.title}</div>
                      <div className="task-desc">{task.desc}</div>
                    </div>
                    <div className="task-xp">+{task.xp} XP</div>
                  </div>
                );
              })}
            </div>
            <div className="task-progress">
              <div className="tp-ring" style={{ '--p': `${taskPct}%` }}><span>{taskPct}%</span></div>
              <div className="tp-text">
                <strong>{taskPct === 100 ? 'Luar biasa! 🎉' : taskPct === 0 ? 'Belum dimulai' : `${completedCount} dari ${totalTasks} selesai`}</strong>
                <small>{taskPct === 100 ? 'Semua tugas hari ini selesai' : 'Selesaikan tugas untuk mengumpulkan XP'}</small>
              </div>
            </div>
          </section>

          {/* Leaderboard */}
          <section className="leaderboard-panel glass">
            <div className="panel-head"><h2>Papan Peringkat</h2></div>
            <div className="lb-list">
              {leaderboard.slice(0, 10).map((u, idx) => {
                const rank = idx + 1;
                const uLv = getLevelForXp(u.xp);
                const isMe = u.email === user.email;
                const rankCls = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
                const rankShow = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
                return (
                  <div key={u.email} className={`lb-row ${isMe ? 'me' : ''}`}>
                    <div className={`lb-rank ${rankCls}`}>{rankShow}</div>
                    <div className="lb-avatar">{u.name.charAt(0).toUpperCase()}</div>
                    <div className="lb-body">
                      <div className="lb-name">{u.name}{isMe ? ' (Kamu)' : ''}</div>
                      <div className="lb-level">Lv. {uLv.level} · {uLv.name}</div>
                    </div>
                    <div className="lb-xp">{u.xp.toLocaleString('id-ID')}</div>
                  </div>
                );
              })}
              {leaderboard.length === 0 && <div className="empty-state">Belum ada pengguna lain.</div>}
            </div>
            <div className="lb-footer">Posisimu: #{myRank} dari {leaderboard.length} pengguna</div>
          </section>
        </div>

        {/* Courses */}
        <section className="courses-panel glass">
          <div className="panel-head">
            <h2>Course & Pembelajaran</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
              Selesaikan pelajaran, kirim bukti, dan dapatkan XP setelah diverifikasi admin.
            </p>
          </div>
          <div className="course-grid">
            {COURSES.map((course) => {
              const verifiedCount = submissions.filter((s) => s.courseId === course.id && s.status === 'verified').length;
              const pendingCount = submissions.filter((s) => s.courseId === course.id && s.status === 'pending').length;
              const totalLessons = course.lessons.length;
              const isDone = verifiedCount === totalLessons;
              return (
                <div key={course.id} className="course-card glass" onClick={() => setActiveCourse(course)}>
                  <img className="course-cover" src={course.cover} alt={course.title} loading="lazy" />
                  <div className="course-body">
                    <span className="course-cat">{course.category}</span>
                    <div className="course-title">{course.title}</div>
                    <div className="course-desc">{course.desc}</div>
                    <div className="course-meta">
                      <span>{verifiedCount} / {totalLessons} pelajaran</span>
                      <span className={`status ${isDone ? 'done' : pendingCount > 0 ? 'pending' : ''}`}>
                        {isDone ? '✓ Selesai' : pendingCount > 0 ? `${pendingCount} menunggu` : 'Mulai'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Modal — ganti model */}
      {showModelModal && (
        <div className="modal-backdrop show" onClick={(e) => e.target === e.currentTarget && setShowModelModal(false)}>
          <div className="modal-box glass">
            <button className="modal-close" onClick={() => setShowModelModal(false)}>✕</button>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Ganti Karakter Teladan</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-soft)', marginTop: 4 }}>
                Tugas hari ini untuk karakter baru akan dimulai dari nol. XP total tetap tersimpan.
              </p>
            </div>
            <div className="model-grid">
              {Object.values(MODELS).map((m) => (
                <div key={m.id} className="model-card glass">
                  <div className="mc-icon">{m.icon}</div>
                  <div>
                    <div className="mc-name">{m.name}</div>
                    <div className="mc-title">{m.title}</div>
                  </div>
                  <div className="mc-desc">{m.desc}</div>
                  <button className="mc-pick" onClick={() => pickModel(m.id)}>Pilih</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal — course detail */}
      {activeCourse && (
        <div className="modal-backdrop show" onClick={(e) => e.target === e.currentTarget && setActiveCourse(null)}>
          <div className="modal-box glass">
            <button className="modal-close" onClick={() => setActiveCourse(null)}>✕</button>
            <img
              src={activeCourse.cover}
              alt={activeCourse.title}
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 16, marginBottom: 18 }}
            />
            <span className="course-cat">{activeCourse.category}</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: 10, marginBottom: 6 }}>{activeCourse.title}</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-soft)', marginBottom: 20 }}>{activeCourse.desc}</p>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>Daftar Pelajaran</h3>
            <div className="lesson-list">
              {activeCourse.lessons.map((lesson, idx) => {
                const sub = submissions.find((s) => s.courseId === activeCourse.id && s.lessonId === lesson.id);
                const status = sub?.status || 'not-started';
                return (
                  <LessonItem
                    key={lesson.id}
                    course={activeCourse}
                    lesson={lesson}
                    index={idx}
                    status={status}
                    submitting={submitting}
                    onSubmit={submitProof}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToastWrap({ toasts }) {
  return (
    <div id="toastWrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast show ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

function LessonItem({ course, lesson, index, status, submitting, onSubmit }) {
  const [expanded, setExpanded] = useState(false);
  const label = {
    'not-started': 'Belum',
    pending: 'Menunggu',
    verified: 'Terverifikasi',
    rejected: 'Ditolak',
  }[status];

  return (
    <div className="lesson-item">
      <div className="lesson-num">{index + 1}</div>
      <div className="lesson-info">
        <h4>{lesson.title}</h4>
        <p>{lesson.desc}</p>
        {expanded && status !== 'verified' && (
          <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
            <input type="hidden" name="lessonId" value={lesson.id} />
            <div className="field">
              <label>Bukti belajar (jelaskan apa yang kamu pelajari)</label>
              <textarea name="proof" required placeholder="Contoh: Saya sudah membaca bab ini dan mempraktikkan 3 teknik..." />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? 'Mengirim...' : 'Kirim Bukti'}
            </button>
          </form>
        )}
        {expanded && status === 'verified' && (
          <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--emerald-dark)' }}>
            ✓ Pelajaran ini sudah diverifikasi admin
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <span className={`lesson-status ${status}`}>{label}</span>
        {status !== 'verified' && (
          <button
            className="change-btn"
            onClick={() => setExpanded((v) => !v)}
            style={{ fontSize: '0.7rem', padding: '4px 10px' }}
          >
            {expanded ? 'Tutup' : status === 'pending' ? 'Lihat' : 'Kirim bukti'}
          </button>
        )}
      </div>
    </div>
  );
}
