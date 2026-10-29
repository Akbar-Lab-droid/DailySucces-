// Daftar karakter teladan. Tiap karakter punya tugas harian dengan XP.
export const MODELS = {
  muhammad: {
    id: 'muhammad', name: 'Nabi Muhammad ﷺ',
    title: 'Rasulullah — Teladan Sepanjang Zaman',
    religion: 'islam', icon: '🕌',
    desc: 'Ibadah tepat waktu, akhlak mulia, dan kerja yang berkah.',
    tasks: [
      { id: 'm1', title: 'Sholat Subuh tepat waktu', desc: 'Awali hari dengan ibadah', xp: 20 },
      { id: 'm2', title: 'Tilawah Al-Quran', desc: 'Minimal 1 halaman', xp: 15 },
      { id: 'm3', title: 'Sholat 5 waktu lengkap', desc: 'Jaga sholat sebagai prioritas', xp: 30 },
      { id: 'm4', title: 'Sedekah / bantu orang', desc: 'Kebaikan kecil yang konsisten', xp: 15 },
      { id: 'm5', title: 'Dzikir pagi & petang', desc: 'Hati tenang, fokus terjaga', xp: 15 },
      { id: 'm6', title: 'Bekerja dengan amanah', desc: 'Rezeki halal, hasil berkah', xp: 20 },
    ],
  },
  umar: {
    id: 'umar', name: 'Umar bin Khattab',
    title: 'Pemimpin Adil & Tegas', religion: 'islam', icon: '⚔️',
    desc: 'Disiplin tinggi, adil, dan kuat dalam beribadah.',
    tasks: [
      { id: 'u1', title: 'Sholat 5 waktu tepat waktu', desc: 'Disiplin ibadah adalah fondasi', xp: 30 },
      { id: 'u2', title: 'Baca 1 halaman Al-Quran', desc: 'Ilmu yang menerangi keputusan', xp: 15 },
      { id: 'u3', title: 'Bekerja dengan adil', desc: 'Tegas tapi berempati', xp: 20 },
      { id: 'u4', title: 'Latihan fisik', desc: 'Tubuh kuat, jiwa kuat', xp: 15 },
      { id: 'u5', title: 'Muhasabah diri', desc: 'Evaluasi sebelum tidur', xp: 15 },
      { id: 'u6', title: 'Bantu satu orang hari ini', desc: 'Kepemimpinan adalah pelayanan', xp: 15 },
    ],
  },
  ibnu_sina: {
    id: 'ibnu_sina', name: 'Ibnu Sina',
    title: 'Bapak Kedokteran Modern', religion: 'islam', icon: '🔬',
    desc: 'Ilmuwan muslim yang menggabungkan iman, ilmu, dan kerja keras.',
    tasks: [
      { id: 'i1', title: 'Sholat Subuh', desc: 'Niat lurus di awal hari', xp: 20 },
      { id: 'i2', title: 'Belajar sains 1 jam', desc: 'Kedokteran, biologi, atau fisika', xp: 25 },
      { id: 'i3', title: 'Menulis catatan ilmiah', desc: 'Rekam insight hari ini', xp: 20 },
      { id: 'i4', title: 'Sholat 5 waktu', desc: 'Seimbang dunia & akhirat', xp: 25 },
      { id: 'i5', title: 'Olahraga ringan', desc: 'Jaga kesehatan fisik', xp: 15 },
      { id: 'i6', title: 'Refleksi keilmuan', desc: 'Apa yang baru kamu pahami?', xp: 15 },
    ],
  },
  teresa: {
    id: 'teresa', name: 'Mother Teresa',
    title: 'Pelayan Kemanusiaan', religion: 'kristen', icon: '🕊️',
    desc: 'Hidup untuk melayani, berdoa, dan menyebarkan kasih.',
    tasks: [
      { id: 'te1', title: 'Doa pagi', desc: 'Awali dengan bersyukur', xp: 20 },
      { id: 'te2', title: 'Membantu satu orang', desc: 'Kebaikan konkret hari ini', xp: 25 },
      { id: 'te3', title: 'Baca ayat Alkitab', desc: 'Renungkan firman-Nya', xp: 15 },
      { id: 'te4', title: 'Tersenyum & sabar', desc: 'Latih hati yang lapang', xp: 10 },
      { id: 'te5', title: 'Berbuat baik tanpa pamrih', desc: 'Berbagi tanpa hitung-hitungan', xp: 25 },
      { id: 'te6', title: 'Doa malam', desc: 'Tutup hari dengan syukur', xp: 15 },
    ],
  },
  aquinas: {
    id: 'aquinas', name: 'Thomas Aquinas',
    title: 'Filsuf & Teolog Besar', religion: 'kristen', icon: '📖',
    desc: 'Menyeimbangkan iman, akal, dan kerja intelektual.',
    tasks: [
      { id: 'aq1', title: 'Doa pagi', desc: 'Diam sejenak, hadir utuh', xp: 20 },
      { id: 'aq2', title: 'Belajar filsafat/teologi', desc: '45 menit merenung & membaca', xp: 25 },
      { id: 'aq3', title: 'Menulis refleksi', desc: 'Tuangkan gagasan ke tulisan', xp: 20 },
      { id: 'aq4', title: 'Berbuat baik ke sesama', desc: 'Iman tanpa perbuatan hampa', xp: 20 },
      { id: 'aq5', title: 'Olahraga ringan', desc: 'Jaga tubuh tetap bugar', xp: 15 },
      { id: 'aq6', title: 'Doa malam', desc: 'Refleksi & syukur', xp: 15 },
    ],
  },
  gandhi: {
    id: 'gandhi', name: 'Mahatma Gandhi',
    title: 'Bapak Non-Kekerasan', religion: 'hindu', icon: '🪷',
    desc: 'Hidup sederhana, penuh meditasi, dan perjuangan tanpa kekerasan.',
    tasks: [
      { id: 'g1', title: 'Meditasi pagi', desc: '15 menit hening', xp: 20 },
      { id: 'g2', title: 'Makan sederhana', desc: 'Latih kesederhanaan', xp: 15 },
      { id: 'g3', title: 'Baca Bhagavad Gita', desc: 'Renungkan satu sloka', xp: 20 },
      { id: 'g4', title: 'Jalan kaki / olahraga', desc: 'Tubuh dan pikiran segar', xp: 20 },
      { id: 'g5', title: 'Pelajari ahimsa', desc: 'Praktik non-kekerasan hari ini', xp: 15 },
      { id: 'g6', title: 'Pelayanan kecil', desc: 'Bantu tanpa berharap balas', xp: 20 },
    ],
  },
  aryabhata: {
    id: 'aryabhata', name: 'Aryabhata',
    title: 'Matematikawan & Astronom', religion: 'hindu', icon: '🌌',
    desc: 'Menggabungkan spiritualitas dengan sains dan rasa ingin tahu.',
    tasks: [
      { id: 'a1', title: 'Meditasi / shanti', desc: 'Tenangkan pikiran', xp: 15 },
      { id: 'a2', title: 'Belajar matematika/astronomi', desc: '1 jam eksplorasi', xp: 30 },
      { id: 'a3', title: 'Menulis catatan ilmiah', desc: 'Rekam penemuan kecil', xp: 20 },
      { id: 'a4', title: 'Baca kitab suci / renungan', desc: 'Ilmu & iman berjalan bersama', xp: 20 },
      { id: 'a5', title: 'Olahraga ringan', desc: 'Jaga stamina berpikir', xp: 15 },
      { id: 'a6', title: 'Ajar satu orang', desc: 'Berbagi ilmu = menguatkan ilmu', xp: 20 },
    ],
  },
  siddhartha: {
    id: 'siddhartha', name: 'Siddhartha Gautama',
    title: 'Sang Buddha — Pencerah', religion: 'buddha', icon: '☸️',
    desc: 'Hidup dalam kesadaran, welas asih, dan pelepasan.',
    tasks: [
      { id: 's1', title: 'Meditasi pagi 20 menit', desc: 'Amati napas, hadir sekarang', xp: 25 },
      { id: 's2', title: 'Mindfulness sepanjang hari', desc: 'Sadar pada setiap aktivitas', xp: 20 },
      { id: 's3', title: 'Baca Dhamma', desc: 'Renungkan satu ajaran', xp: 15 },
      { id: 's4', title: 'Berbuat baik ke makhluk', desc: 'Welas asih dalam tindakan', xp: 20 },
      { id: 's5', title: 'Olahraga ringan', desc: 'Tubuh sehat, pikiran jernih', xp: 15 },
      { id: 's6', title: 'Kontemplasi malam', desc: 'Refleksi sebelum tidur', xp: 20 },
    ],
  },
  ashoka: {
    id: 'ashoka', name: 'Kaisar Ashoka',
    title: 'Pemimpin Bijak & Welas Asih', religion: 'buddha', icon: '🕉️',
    desc: 'Dari penakluk menjadi pelayan rakyat — kekuatan sejati adalah kebaikan.',
    tasks: [
      { id: 'as1', title: 'Meditasi pagi', desc: 'Hadirkan ketenangan', xp: 20 },
      { id: 'as2', title: 'Baca ajaran Dharma', desc: 'Renungkan kebijaksanaan', xp: 15 },
      { id: 'as3', title: 'Berbuat baik ke orang lain', desc: 'Kekuasaan adalah pelayanan', xp: 25 },
      { id: 'as4', title: 'Olahraga / jalan kaki', desc: 'Jaga tubuh', xp: 15 },
      { id: 'as5', title: 'Latihan mindfulness', desc: 'Sadar penuh hari ini', xp: 20 },
      { id: 'as6', title: 'Refleksi malam', desc: 'Evaluasi dengan welas asih', xp: 15 },
    ],
  },
  einstein: {
    id: 'einstein', name: 'Albert Einstein',
    title: 'Fisikawan Teoretis Legendaris', religion: 'umum', icon: '🧠',
    desc: 'Fokus mendalam, rasa ingin tahu tinggi, dan hidup seimbang.',
    tasks: [
      { id: 'e1', title: 'Deep work 2 jam', desc: 'Satu tugas, tanpa distraksi', xp: 30 },
      { id: 'e2', title: 'Belajar fisika/teori baru', desc: '1 jam eksplorasi konsep', xp: 25 },
      { id: 'e3', title: 'Jalan kaki santai', desc: 'Ide terbaik muncul saat santai', xp: 15 },
      { id: 'e4', title: 'Tidur cukup 7-8 jam', desc: 'Otak butuh istirahat', xp: 15 },
      { id: 'e5', title: 'Baca buku', desc: 'Minimal 20 halaman', xp: 20 },
      { id: 'e6', title: 'Refleksi & catat ide', desc: 'Tuangkan pemikiran hari ini', xp: 15 },
    ],
  },
  jobs: {
    id: 'jobs', name: 'Steve Jobs',
    title: 'Visioner Teknologi', religion: 'umum', icon: '🍎',
    desc: 'Fokus, minimalis, dan berani membuat hal yang berbeda.',
    tasks: [
      { id: 'j1', title: 'Deep work 2 jam', desc: 'Kerjakan yang paling penting', xp: 30 },
      { id: 'j2', title: 'Meditasi / mindfulness', desc: 'Jaga kejernihan pikiran', xp: 15 },
      { id: 'j3', title: 'Buat / desain sesuatu', desc: 'Latih rasa estetika', xp: 20 },
      { id: 'j4', title: 'Olahraga 30 menit', desc: 'Energi untuk berkarya', xp: 15 },
      { id: 'j5', title: 'Baca insight / buku', desc: 'Cari inspirasi baru', xp: 15 },
      { id: 'j6', title: 'Refleksi produk / ide', desc: 'Sederhanakan, fokuskan', xp: 20 },
    ],
  },
};

export const LEVELS = [
  { level: 1, name: 'Pemula',     min: 0,    max: 100 },
  { level: 2, name: 'Pelajar',    min: 100,  max: 300 },
  { level: 3, name: 'Disiplin',   min: 300,  max: 700 },
  { level: 4, name: 'Produktif',  min: 700,  max: 1500 },
  { level: 5, name: 'Visioner',   min: 1500, max: 3000 },
  { level: 6, name: 'Inspirator', min: 3000, max: 6000 },
  { level: 7, name: 'Legenda',    min: 6000, max: Infinity },
];

export function getLevelForXp(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}
