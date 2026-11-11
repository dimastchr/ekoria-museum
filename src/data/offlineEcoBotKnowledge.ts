/**
 * Offline Knowledge Base for EcoBot
 * Contains 35+ child-friendly Q&As covering the entire IPAS Kelas V Grade 5 Curriculum
 * "Harmoni dalam Ekosistem".
 * 
 * Formatting standard:
 * - Bahasa Indonesia sederhana untuk anak 10-11 tahun
 * - 2-4 kalimat pendek
 * - 1 contoh kehidupan nyata di Indonesia
 * - Maksimal 1 emoji
 * - Diakhiri 1 pertanyaan pancingan singkat
 */

export interface OfflineQAPair {
  keywords: string[];
  answer: string;
}

export const OFFLINE_ECOBOT_KNOWLEDGE: OfflineQAPair[] = [
  {
    keywords: ['ekosistem', 'apa itu ekosistem', 'arti ekosistem'],
    answer: 'Ekosistem adalah hubungan timbal balik antara makhluk hidup dan benda tak hidup di sekitarnya yang saling membutuhkan. Contohnya sawah di dekat rumahmu: ada padi, katak, air parit, dan sinar matahari. Tanpa air dan matahari, padi tidak akan bisa tumbuh subur! 🌱 Menurutmu, makhluk apa lagi yang sering kamu lihat di sawah?'
  },
  {
    keywords: ['produsen', 'apa itu produsen', 'tumbuhan'],
    answer: 'Produsen adalah makhluk hidup yang bisa memasak makanannya sendiri menggunakan bantuan sinar matahari. Tumbuhan hijau seperti pohon mangga di halaman rumahmu adalah contoh produsen hebat. Mereka menghasilkan oksigen segar yang kita hirup setiap hari. 🌿 Apakah kamu punya tanaman kesayangan di rumah?'
  },
  {
    keywords: ['konsumen', 'herbivora', 'pemakan rumput', 'pemakan tumbuhan'],
    answer: 'Konsumen adalah makhluk hidup yang tidak bisa membuat makanannya sendiri. Herbivora adalah konsumen yang khusus memakan dedaunan, rumput, atau buah-buahan. Contohnya adalah kambing dan sapi milik warga desa yang suka mengunyah rumput lapangan. Gigi geraham mereka lebar dan datar, cocok untuk mengunyah rumput. 🐐 Hewan pemakan rumput apa lagi yang ada di sekitarmu?'
  },
  {
    keywords: ['karnivora', 'pemakan daging', 'singa', 'harimau'],
    answer: 'Karnivora adalah hewan yang makanan utamanya adalah daging hewan lain. Harimau Sumatra adalah contoh karnivora gagah di hutan Indonesia yang menjaga agar jumlah rusa tidak meledak terlalu banyak. Mereka punya cakar dan taring yang sangat kuat. 🐯 Mengapa harimau sangat penting bagi kelestarian hutan?'
  },
  {
    keywords: ['omnivora', 'pemakan segala', 'monyet', 'ayam'],
    answer: 'Omnivora adalah hewan pemakan segala, yaitu memakan tumbuhan sekaligus hewan lain. Contohnya ayam kampung di pekarangan yang suka mematuk butir jagung sekaligus menangkap cacing tanah. Mereka mudah menyesuaikan diri dengan makanan yang tersedia. 🐔 Bisakah kamu menebak apakah manusia juga termasuk omnivora?'
  },
  {
    keywords: ['pengurai', 'dekomposer', 'jamur', 'bakteri'],
    answer: 'Pengurai seperti jamur dan bakteri adalah pahlawan kebersihan alami di alam. Mereka membusukkan daun kering dan ranting pohon yang jatuh menjadi tanah humus yang subur. Tanpa pengurai, daun mati di hutan akan terus menumpuk dan tidak kembali menjadi tanah! 🍄 Pernahkah kamu melihat jamur tumbuh di batang pohon yang lapuk?'
  },
  {
    keywords: ['detritivor', 'cacing', 'kaki seribu', 'rayap'],
    answer: 'Detritivor adalah hewan kecil seperti cacing tanah dan rayap yang memakan dan menghancurkan daun gugur menjadi serpihan kecil. Cacing tanah di kebunmu membuat lorong udara di dalam tanah sehingga akar tanaman mudah bernapas. Mereka adalah sahabat terbaik petani kita! 🪱 Menurutmu, tanah yang banyak cacingnya itu subur atau gersang?'
  },
  {
    keywords: ['rantai makanan', 'aliran energi', 'panah'],
    answer: 'Rantai makanan adalah jalur makan dan dimakan yang memindahkan energi kehidupan dari satu makhluk ke makhluk lain. Tanda panah (→) artinya "dimakan oleh" dan energi berpindah ke pemakan, misalnya Padi → Tikus → Ular. Jadi energi dari padi berpindah masuk ke tubuh tikus! 🌾 Menurutmu, siapakah yang akan memangsa ular sawah?'
  },
  {
    keywords: ['jaring jaring', 'jaring makanan', 'perbedaan rantai'],
    answer: 'Jaring-jaring makanan adalah gabungan dari banyak rantai makanan yang saling terhubung di alam. Di kebun, seekor katak tidak hanya makan belalang, tetapi juga lalat dan nyamuk. Katak pun bisa dimakan ular atau burung bangau. Semakin banyak cabang makanannya, ekosistem akan semakin kuat bertahan! 🕸️ Apa yang terjadi jika salah satu makanan katak habis?'
  },
  {
    keywords: ['ular diburu', 'tikus sawah', 'ular habis'],
    answer: 'Jika ular sawah diburu habis oleh manusia, tidak ada lagi pemangsa alami bagi tikus. Akibatnya, jumlah tikus akan meledak sangat banyak dan memakan seluruh tanaman padi hingga petani gagal panen. Itulah mengapa kita tidak boleh membunuh ular sawah sembarangan! 🐍 Apa cara terbaik petani mengatasi tikus tanpa racun kimia?'
  },
  {
    keywords: ['terumbu karang', 'karang laut', 'biotik laut'],
    answer: 'Terumbu karang yang berwarna-warni di dasar laut sebenarnya adalah kumpulan jutaan hewan laut mungil yang hidup bersama, bukan batu mati! Mereka bersimbiosis dengan alga bersel satu dan menjadi rumah aman bagi ikan badut. Jika laut tercemar, karang bisa sakit dan memutih. 🪸 Ikan laut apa yang paling ingin kamu lihat di karang?'
  },
  {
    keywords: ['sampah plastik', 'plastik laut', 'penyu'],
    answer: 'Kantong plastik yang hanyut ke laut sangat berbahaya karena melayang seperti ubur-ubur makanan kesukaan penyu laut. Ketika penyu memakannya, plastik itu menyumbat perutnya dan membuat penyu jatuh sakit. Membawa tas belanja kain sendiri adalah aksi hebat menyelamatkan penyu! 🐢 Maukah kamu mengurangi sedotan plastik saat jajan di sekolah?'
  },
  {
    keywords: ['sungai', 'capung', 'air sungai'],
    answer: 'Banyaknya capung yang terbang di tepi sungai adalah tanda bahwa air sungai itu masih cukup bersih. Sebagian besar anak capung membutuhkan air yang jernih dan kaya oksigen untuk hidup. Jika sungai tercemar detergen, anak capung tidak akan selamat. 💧 Apakah sungai di dekat tempat tinggalmu masih jernih?'
  },
  {
    keywords: ['mutualisme', 'simbiosis mutualisme', 'saling untung'],
    answer: 'Simbiosis mutualisme adalah hubungan dua makhluk hidup yang saling menguntungkan kedua belah pihak. Contohnya burung jalak yang kenyang memakan kutu di punggung kerbau, sementara kerbau merasa nyaman bebas dari gatal. Keduanya sama-sama senang dan tertolong! 🐦 Apakah kamu ingat contoh mutualisme antara ikan badut dan anemon laut?'
  },
  {
    keywords: ['komensalisme', 'anggrek', 'remora'],
    answer: 'Simbiosis komensalisme adalah hubungan di mana satu makhluk hidup mendapat keuntungan, sedangkan makhluk lainnya tidak dirugikan sama sekali. Contohnya tanaman anggrek yang menempel di dahan pohon mangga agar terkena sinar matahari tanpa menyerap makanan pohon itu. Pohon mangga tetap tumbuh segar! 🌸 Pernahkah kamu melihat tanaman anggrek menempel di pohon?'
  },
  {
    keywords: ['parasitisme', 'benalu', 'kutu'],
    answer: 'Simbiosis parasitisme terjadi jika satu pihak untung sementara pihak yang ditumpangi (inang) menjadi rugi atau sakit. Contohnya benalu yang menancap di pohon inang dan menyedot sari makanan sampai dahan pohon itu mengering. Kutu di bulu kucing juga contoh parasit. 🐜 Bagaimana cara merawat kucing peliharaan agar bebas kutu?'
  },
  {
    keywords: ['pestisida', 'racun hama', 'pupuk kimia'],
    answer: 'Pestisida kimia yang disemprotkan berlebihan bisa meracuni cacing tanah dan mematikan serangga baik seperti lebah madu. Racun itu juga bisa hanyut ke parit sawah dan membuat ikan-ikan kecil mati lemas. Petani bijak lebih suka menggunakan pembasmi hama alami seperti burung hantu! 🌾 Mengapa lebah sangat berjasa bagi tanaman buah?'
  },
  {
    keywords: ['fotosintesis', 'cara tanaman makan'],
    answer: 'Fotosintesis adalah cara tumbuhan hijau memasak makanannya menggunakan klorofil daun, air tanah, karbon dioksida dari udara, dan sinar matahari. Proses ajaib ini menghasilkan oksigen bersih yang kita gunakan untuk bernapas setiap detik. Menanam satu pohon di depan rumah sangat membantu udara bumi tetap sejuk! ☀️ Berapa banyak pohon yang ada di sekitar rumahmu?'
  },
  {
    keywords: ['biotik', 'arti biotik'],
    answer: 'Biotik adalah sebutan untuk semua komponen yang hidup di lingkungan. Contoh biotik adalah pohon kelapa, burung gereja, ikan mujair, semut, hingga bakteri kecil di tanah. Mereka semua bisa bernapas, tumbuh, dan berkembang biak. 🌳 Bisakah kamu menyebutkan tiga makhluk hidup di halaman rumahmu?'
  },
  {
    keywords: ['abiotik', 'arti abiotik'],
    answer: 'Abiotik adalah komponen tak hidup yang ada di lingkungan kita tetapi sangat dibutuhkan makhluk hidup. Contoh abiotik adalah sinar matahari, air sumur, batu kali, tanah pekarangan, dan udara. Tanpa komponen abiotik ini, tumbuhan dan hewan tidak akan bisa bertahan hidup. 💨 Menurutmu, apa yang terjadi jika bumi tidak punya air?'
  },
  {
    keywords: ['hutan', 'hutan hujan', 'hutan harmoni'],
    answer: 'Hutan hujan tropis di Indonesia sering disebut sebagai paru-paru dunia karena menghasilkan oksigen yang sangat melimpah. Di dalam hutan terdapat pohon meranti yang tinggi menjulang, orangutan, harimau, dan ribuan tanaman obat. Merawat hutan berarti melindungi udara bersih untuk kita semua! 🌲 Tahukah kamu pulau mana di Indonesia yang memiliki hutan paling luas?'
  },
  {
    keywords: ['burung hantu', 'rubuha', 'tikus kebun'],
    answer: 'Burung hantu adalah pemburu malam yang luar biasa gesit dan memiliki penglihatan super tajam dalam kegelapan. Satu ekor burung hantu bisa memangsa dua sampai lima tikus perusak tanaman setiap malam. Petani cerdas sering memasang rumah burung hantu (rubuha) di tengah sawah untuk menjaga panen padi! 🦉 Apakah kamu pernah mendengar suara burung hantu di malam hari?'
  },
  {
    keywords: ['pohon ditebang', 'deforestasi', 'banjir'],
    answer: 'Akar pohon di hutan berfungsi seperti spons raksasa yang menyerap dan menahan air hujan di dalam tanah. Jika pohon di bukit ditebang habis, air hujan akan langsung mengalir deras ke bawah dan menyebabkan tanah longsor serta banjir bandang di permukiman. Menanam pohon kembali adalah obat terbaik bagi bumi! 🌧️ Apakah kamu pernah ikut kegiatan menanam pohon?'
  },
  {
    keywords: ['keseimbangan', 'harmoni ekosistem', 'seimbang'],
    answer: 'Keseimbangan ekosistem tercapai jika jumlah produsen, herbivora, dan pemangsa berada pada jumlah yang pas dan lestari. Tidak ada makhluk yang punah dan tidak ada hama yang meledak terlalu banyak. Semua makhluk hidup saling melengkapi seperti alunan musik yang indah. 🎶 Bagaimana perasaanmu saat melihat alam yang asri dan hijau?'
  },
  {
    keywords: ['kuis', 'jawaban kuis', 'bocoran', 'kunci jawaban'],
    answer: 'Ozi tidak boleh langsung memberikan kunci jawaban ya, agar kamu bisa menjadi detektif sains yang hebat! Tetapi Ozi bisa memberi petunjuk: perhatikan siapa yang membuat makanan sendiri dan ke mana arah energi berpindah. Coba baca pertanyaannya pelan-pelan lagi ya! 💡 Bagian mana dari soal itu yang membuatmu bingung?'
  },
  {
    keywords: ['halo', 'hai', 'siapa kamu', 'ozi', 'ecobot'],
    answer: 'Halo penjelajah cilik! Aku adalah Ozi si EcoBot, robot bulat putih bermata biru dengan antena kuning yang bertugas sebagai pemandu belajarmu di EkoRia. Aku bukan manusia, tapi aku punya banyak informasi seru tentang rahasia ekosistem alam di Indonesia! 🤖 Topik apa yang paling ingin kamu tanyakan hari ini?'
  },
  {
    keywords: ['sedih', 'takut', 'marah', 'capek'],
    answer: 'Tidak apa-apa, setiap orang kadang merasa lelah atau sedih saat belajar. Jangan dipendam sendirian ya, cobalah bercerita kepada guru pembimbingmu di kelas atau ayah dan ibu di rumah. Beristirahat sejenak sambil minum air putih hangat akan membuat tubuhmu lebih segar! 💛 Mau beristirahat sebentar sebelum kita lanjut menjelajah?'
  },
  {
    keywords: ['namaku', 'alamatku', 'alamat rumah', 'sekolahku', 'nomor hp'],
    answer: 'Ingat ya penjelajah hebat, di internet kita harus selalu berhati-hati dan tidak membagikan nama lengkap, alamat rumah, atau nomor HP kepada siapa pun. Sebagai robot pemandu, tugasku adalah membantumu belajar sains ekosistem dengan aman dan ceria! 🛡️ Apakah kamu sudah siap lanjut belajar tentang rantai makanan?'
  },
  {
    keywords: ['ikan badut', 'anemon', 'nemo'],
    answer: 'Ikan badut memiliki lapisan lendir istimewa di kulitnya sehingga tubuhnya kebal terhadap sengatan tentakel anemon laut yang beracun. Anemon melindungi ikan badut dari ikan pemangsa besar, dan ikan badut membantu membersihkan sisa kotoran anemon. Persahabatan mereka di terumbu karang sangat mengagumkan! 🐠 Menurutmu, mengapa ikan badut punya warna belang oranye putih yang mencolok?'
  },
  {
    keywords: ['padi', 'beras', 'nasi'],
    answer: 'Tanaman padi di sawah adalah produsen utama makanan pokok sebagian besar masyarakat Indonesia. Bibit padi yang ditanam di lumpur basah akan tumbuh dan menghasilkan bulir gabah. Gabah digiling menjadi beras, lalu dimasak menjadi nasi lezat di meja makanmu. Kita harus selalu menghargai jerih payah para petani! 🌾 Apakah kamu menghabiskan nasimu saat makan tadi?'
  },
  {
    keywords: ['ikan wader', 'ikan sungai'],
    answer: 'Ikan wader adalah ikan air tawar asli sungai-sungai di Indonesia yang berukuran kecil dan berenang lincah secara berkelompok. Mereka memakan lumut batu kali dan jentik nyamuk, sehingga membantu mengurangi jumlah nyamuk penyebar penyakit. Adanya ikan wader menandakan air kali masih bersih! 🐟 Apakah di sungai dekat rumahmu masih ada ikan-ikan kecil?'
  },
  {
    keywords: ['elang', 'burung pemangsa'],
    answer: 'Burung elang memiliki sayap yang lebar untuk meluncur tinggi di angkasa dan mata super tajam yang bisa melihat gerakan ular dari jarak ratusan meter. Elang bertindak sebagai konsumen puncak yang memastikan populasi ular dan tikus tidak berlebihan di alam. Saat elang mati karena tua, tubuhnya akan diuraikan oleh bakteri dan jamur menjadi zat hara di tanah. 🦅 Keren sekali bukan bagaimana alam mendaur ulang dirinya sendiri?'
  },
  {
    keywords: ['klorofil', 'daun hijau'],
    answer: 'Klorofil adalah zat warna hijau pada daun yang bekerja seperti panel surya mini untuk menangkap sinar matahari. Tanpa klorofil, daun tidak bisa menyerap energi cahaya untuk mengubah air dan karbon dioksida menjadi makanan. Itulah sebabnya dedaunan tampak berwarna hijau segar! 🍃 Apakah kamu tahu ada tanaman yang daunnya berwarna merah atau ungu?'
  },
  {
    keywords: ['humus', 'tanah subur'],
    answer: 'Humus adalah lapisan tanah paling atas yang berwarna cokelat gelap dan kaya akan zat hara bagi akar tumbuhan. Humus terbentuk dari tumpukan daun gugur, ranting lapuk, dan sisa bangkai yang telah dibusukkan oleh jutaan jamur serta bakteri pengurai. Tanah humus terasa gembur dan tidak berbau busuk! 🌱 Mau mencoba menanam biji cabai di tanah humus?'
  },
  {
    keywords: ['air bersih', 'hemat air'],
    answer: 'Air adalah cairan kehidupan bagi seluruh makhluk di muka bumi. Hewan minum air untuk bertahan hidup, dan tumbuhan menyerap air untuk mengangkut zat hara dari akar ke daun. Menutup keran air setelah mencuci tangan adalah kebiasaan baik menjaga persediaan air bersih! 💧 Aksi hemat air apa yang sudah kamu lakukan hari ini?'
  }
];

/**
 * Fuzzy / Keyword based matching for offline fallback
 */
export function getOfflineEcoBotAnswer(query: string): string {
  const normalized = query.toLowerCase().trim();

  // Search through knowledge base for matching keywords
  let bestMatch: OfflineQAPair | null = null;
  let maxScore = 0;

  for (const item of OFFLINE_ECOBOT_KNOWLEDGE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += kw.length; // Weigh longer matches higher
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 0) {
    return bestMatch.answer;
  }

  // Polite generic child-friendly fallback if no keyword matches
  return 'Pertanyaanmu sangat menarik tentang alam! Di ekosistem Indonesia, semua makhluk hidup saling terhubung dan saling membantu menjaga keharmonisan bumi. Contohnya pohon rindang yang menaungi burung dan menghasilkan oksigen segar untuk kita. 🌿 Mau coba tanya tentang rantai makanan di sawah atau terumbu karang di laut?';
}
