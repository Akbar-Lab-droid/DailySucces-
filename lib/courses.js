// Course pembelajaran dengan gambar Unsplash
export const COURSES = [
  {
    id: 'produktif-muslim',
    title: 'Produktif Ala Nabi Muhammad ﷺ',
    category: 'islam',
    cover: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80',
    desc: 'Membangun hari produktif dengan meneladani sunnah Rasulullah.',
    lessons: [
      { id: 'l1', title: 'Adab Bangun Pagi', desc: 'Doa, wudhu, dan sholat Subuh sebagai fondasi hari.' },
      { id: 'l2', title: 'Mengelola Waktu dengan Barakah', desc: 'Memanfaatkan waktu sesuai ajaran Nabi.' },
      { id: 'l3', title: 'Bekerja dengan Amanah', desc: 'Etika kerja islami dan niat yang lurus.' },
    ],
  },
  {
    id: 'time-management-islam',
    title: 'Manajemen Waktu Islami',
    category: 'islam',
    cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    desc: 'Mengatur waktu berdasarkan Al-Quran dan sunnah.',
    lessons: [
      { id: 'l1', title: 'Konsep Waktu dalam Islam', desc: 'Waktu adalah amanah dan nikmat.' },
      { id: 'l2', title: 'Prioritas Berdasarkan Maqashid', desc: 'Menyusun prioritas dunia-akhirat.' },
      { id: 'l3', title: 'Produktif di Waktu Emas', desc: 'Subuh dan pagi hari sebagai peak time.' },
    ],
  },
  {
    id: 'doa-kristen',
    title: 'Doa & Meditasi Kristen',
    category: 'kristen',
    cover: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80',
    desc: 'Membangun kehidupan doa yang teratur dan bermakna.',
    lessons: [
      { id: 'l1', title: 'Jenis-jenis Doa', desc: 'Doa syukur, syafaat, dan permohonan.' },
      { id: 'l2', title: 'Doa yang Efektif', desc: 'Belajar berdoa sesuai Alkitab.' },
      { id: 'l3', title: 'Rutinitas Doa Harian', desc: 'Membangun jadwal doa yang konsisten.' },
    ],
  },
  {
    id: 'mindfulness-buddha',
    title: 'Mindfulness & Meditasi',
    category: 'buddha',
    cover: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    desc: 'Latihan kesadaran penuh untuk hidup yang lebih tenang.',
    lessons: [
      { id: 'l1', title: 'Dasar Meditasi', desc: 'Postur, napas, dan fokus.' },
      { id: 'l2', title: 'Mindfulness Harian', desc: 'Hadir penuh di setiap aktivitas.' },
      { id: 'l3', title: 'Mengelola Emosi', desc: 'Mengamati tanpa menghakimi.' },
    ],
  },
  {
    id: 'filosofi-gandhi',
    title: 'Filosofi Gandhi untuk Kehidupan',
    category: 'hindu',
    cover: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
    desc: 'Kesederhanaan, non-kekerasan, dan pelayanan.',
    lessons: [
      { id: 'l1', title: 'Ahimsa — Non-Kekerasan', desc: 'Prinsip dasar perjuangan Gandhi.' },
      { id: 'l2', title: 'Hidup Sederhana', desc: 'Mengurangi keinginan, meningkatkan kebahagiaan.' },
      { id: 'l3', title: 'Pelayanan Tanpa Pamrih', desc: 'Seva sebagai jalan spiritual.' },
    ],
  },
  {
    id: 'deep-work',
    title: 'Deep Work untuk Sukses',
    category: 'umum',
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    desc: 'Teknik fokus mendalam ala Cal Newport, disesuaikan untuk produktivitas nyata.',
    lessons: [
      { id: 'l1', title: 'Apa itu Deep Work?', desc: 'Fokus tanpa distraksi di era digital.' },
      { id: 'l2', title: 'Membangun Ritual Fokus', desc: 'Waktu, tempat, dan ritual yang konsisten.' },
      { id: 'l3', title: 'Melawan Distraksi', desc: 'Manajemen notifikasi dan media sosial.' },
    ],
  },
];

export function getCourse(id) {
  return COURSES.find(c => c.id === id);
}
