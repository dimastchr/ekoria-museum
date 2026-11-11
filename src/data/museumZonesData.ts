import { Badge, ZoneData, RoomData } from '../types';
import img_room_hutan_harmoni from '../assets/images/room_hutan_harmoni_1794113870103.jpg';
import img_room_laut_karang from '../assets/images/room_laut_karang_1794113870846.jpg';
import img_room_sawah_kebun from '../assets/images/room_sawah_kebun_1794113871188.jpg';
import img_room_sungai_bersih from '../assets/images/room_sungai_bersih_1794113871226.jpg';
import img_zone_keseimbangan_ekosistem from '../assets/images/zone_keseimbangan_ekosistem_1794244221728.jpg';
import img_zone_padang_rumput from '../assets/images/zone_padang_rumput_1794244189815.jpg';
import img_zone_pelestarian_lingkungan from '../assets/images/zone_pelestarian_lingkungan_1794244190564.jpg';
import img_zone_rantai_makanan from '../assets/images/zone_rantai_makanan_1794244222145.jpg';

export const MUSEUM_ZONES: ZoneData[] = [
  // 1. Hutan
  {
    id: 'hutan',
    zoneNumber: 1,
    title: 'Hutan',
    theme: 'Ekosistem Hutan Hujan Tropis',
    tagline: 'Pohon-pohon rimbun dengan kanopi raksasa, tempat berteduh aneka satwa liar.',
    curriculumTopic: 'Produsen Hutan, Herbivora, Karnivora, dan Dekomposer Serasah',
    bgImage: img_room_hutan_harmoni,
    accentColor: '#1B5E3F',
    portalGlow: 'from-emerald-500 to-green-700',
    portalIcon: '🌲',
    ambientType: 'hutan',
    welcomeSpeech: 'Halo penjelajah! Selamat datang di Hutan Tropis. Di sini ada pohon meranti raksasa, rusa, harimau, serta jamur pengurai di lantai hutan. Mari temukan rahasia produsen dan pengurai!',
    guidingQuestion: 'Mengapa pohon di hutan disebut produsen sejati dan bagaimana jamur mengembalikan nutrisi ke tanah?',
    learningObjectives: [
      'Mengenal pohon hutan sebagai produsen penghasil makanan dan oksigen.',
      'Mengidentifikasi rusa (herbivora) dan harimau (karnivora).',
      'Memahami proses penguraian serasah daun oleh jamur dan cacing tanah di lantai hutan.'
    ],
    zoneMissions: [
      { id: 'm-hutan-1', text: 'Temukan 3 komponen biotik di hutan', type: 'biotik', targetCount: 3 },
      { id: 'm-hutan-2', text: 'Temukan 2 komponen abiotik (tanah/cahaya)', type: 'abiotik', targetCount: 2 },
      { id: 'm-hutan-3', text: 'Simpan hasil pengamatan ke Jurnal', type: 'journal', targetCount: 1 }
    ],
    organisms: [
      {
        id: 'pohon-hutan',
        name: 'Pohon Meranti Tropis',
        localName: 'Pohon Meranti Raksasa',
        scientificName: 'Shorea leprosula',
        role: 'produsen',
        trophicLevelName: 'Produsen (Pembuat Makanan)',
        habitat: 'Kanopi hutan tropis lebat',
        diet: 'Membuat makanan sendiri melalui fotosintesis dengan bantuan sinar matahari, air, dan karbon dioksida dari udara.',
        predators: ['Rusa (makan tunas daun)', 'Ulat'],
        energySource: 'Cahaya Matahari',
        funFact: 'Pohon-pohon di hutan menghasilkan oksigen dalam jumlah sangat banyak, oksigen yang juga kita hirup setiap hari!',
        thinkingQuestion: 'Jika pohon-pohon besar di hutan ditebang liar, bagaimana nasib hewan pemakan daun?',
        icon: '🌳',
        x: 28,
        y: 42,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'bunga-sepatu',
        name: 'Bunga Sepatu Liar',
        localName: 'Kembang Sepatu Hutan',
        scientificName: 'Hibiscus rosa-sinensis',
        role: 'produsen',
        trophicLevelName: 'Produsen (Tumbuhan Berbunga)',
        habitat: 'Semak di tepi hutan dan pekarangan',
        diet: 'Fotosintesis dengan bantuan cahaya matahari, air, dan udara.',
        predators: ['Kupu-kupu (nektar)', 'Kumbang'],
        energySource: 'Cahaya Matahari',
        funFact: 'Bunga sepatu membuat makanannya sendiri melalui fotosintesis dan nektarnya menjadi sumber energi serangga hutan.',
        thinkingQuestion: 'Mengapa tumbuhan hijau menjadi awal dari hampir seluruh rantai makanan di darat?',
        icon: '🌺',
        x: 18,
        y: 68,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'rusa-hutan',
        name: 'Rusa Sambar',
        localName: 'Rusa Pemakan Daun',
        scientificName: 'Rusa unicolor',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Herbivora)',
        habitat: 'Lantai hutan dan semak rumput',
        diet: 'Rumput segar, dedaunan muda, dan buah hutan yang jatuh.',
        predators: ['Harimau Sumatra'],
        energySource: 'Tumbuhan produsen',
        funFact: 'Rusa memiliki indra pendengaran yang sangat peka dan kaki yang gesit untuk lari dari terkaman pemangsa.',
        thinkingQuestion: 'Mengapa gigi rusa berbentuk datar dan lebar, berbeda dengan gigi harimau?',
        icon: '🦌',
        x: 48,
        y: 66,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'harimau-sumatra',
        name: 'Harimau Sumatra',
        localName: 'Raja Rimba Nusantara',
        scientificName: 'Panthera tigris sumatrae',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II / Puncak (Karnivora)',
        habitat: 'Kawasan hutan rimba lebat',
        diet: 'Rusa, babi hutan, dan kancil.',
        predators: ['Tidak ada pemangsa alami'],
        energySource: 'Daging hewan herbivora',
        funFact: 'Garis loreng hitam pada bulu harimau adalah kamuflase sempurna di antara bayangan semak belukar!',
        thinkingQuestion: 'Apa yang akan terjadi pada populasi rusa jika harimau punah dari hutan?',
        icon: '🐯',
        x: 75,
        y: 54,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'jamur-pengurai-hutan',
        name: 'Jamur Payung Pelapuk',
        localName: 'Jamur Kayu Alami',
        scientificName: 'Agaricomycetes',
        role: 'pengurai',
        trophicLevelName: 'Pengurai (Dekomposer)',
        habitat: 'Batang kayu lapuk dan serasah daun di tanah',
        diet: 'Menguraikan serat kayu dan dedaunan mati menjadi partikel tanah humus.',
        predators: ['Kumbang jamur'],
        energySource: 'Bahan organik lapuk',
        funFact: 'Tanpa jamur pengurai, daun mati di lantai hutan akan terus menumpuk semakin tinggi! Jamur mendaur ulang nutrisi kembali ke tanah.',
        thinkingQuestion: 'Mengapa jamur bukan tumbuhan sejati meskipun tumbuh di atas tanah?',
        icon: '🍄',
        x: 62,
        y: 82,
        isBiotic: true,
        category: 'fungi'
      }
    ],
    abioticFactors: [
      {
        id: 'sinar-matahari-hutan',
        name: 'Cahaya Matahari',
        role: 'Energi utama fotosintesis',
        effectOnEcosystem: 'Sinar matahari menembus celah dedaunan untuk memberi energi kepada seluruh produsen tumbuhan hijau.',
        thinkingQuestion: 'Bisakah tumbuhan hijau bertahan hidup jika matahari terhalang selamanya?',
        icon: '☀️',
        x: 52,
        y: 18
      },
      {
        id: 'tanah-humus-hutan',
        name: 'Tanah Humus Hutan',
        role: 'Media penyimpan air dan nutrisi',
        effectOnEcosystem: 'Tanah gembur berwarna gelap ini kaya nutrisi hasil daur ulang oleh jamur dan cacing tanah.',
        thinkingQuestion: 'Mengapa tanah di lantai hutan berbau segar dan sangat subur?',
        icon: '🌱',
        x: 36,
        y: 86
      }
    ],
    hiddenItem: {
      id: 'kumbang-permata-tersembunyi',
      name: 'Kumbang Permata Hijau',
      hint: 'Perhatikan batang pohon berlumut di sisi kanan...',
      discoveryFact: 'Luar biasa! Sayap kumbang permata berkilau hijau zamrud untuk menyamar di antara lumut basah.',
      xp: 60,
      x: 82,
      y: 38
    }
  },

  // 2. Padang Rumput (Savanna Jawa Timur / Baluran)
  {
    id: 'padang-rumput',
    zoneNumber: 2,
    title: 'Padang Rumput',
    theme: 'Ekosistem Sabana Tropis',
    tagline: 'Hamparan rumput emas dengan pohon akasia dan satwa perumput.',
    curriculumTopic: 'Interaksi Padang Rumput Baluran Jawa Timur: Produsen Rumput, Banteng, Belalang, dan Predator',
    bgImage: img_zone_padang_rumput,
    accentColor: '#8BC34A',
    portalGlow: 'from-lime-500 to-amber-600',
    portalIcon: '🌾',
    ambientType: 'padang',
    welcomeSpeech: 'Selamat datang di Padang Rumput! Seperti sabana Baluran di Jawa Timur, hamparan rumput luas ini menjadi rumah bagi belalang, kelinci liar, banteng, ular, dan burung elang yang melayang tinggi!',
    guidingQuestion: 'Mengapa rumput sabana tetap tumbuh subur meskipun terus dimakan hewan herbivora?',
    learningObjectives: [
      'Mengidentifikasi rumput sebagai produsen utama di sabana.',
      'Mengenal rantai makanan padang rumput: Rumput → Belalang → Katak → Ular → Elang, dan Rumput → Kelinci → Ular → Elang.',
      'Mengetahui peran banteng sebagai herbivora besar di sabana.'
    ],
    zoneMissions: [
      { id: 'm-padang-1', text: 'Temukan rumput produsen & hewan herbivora', type: 'biotik', targetCount: 2 },
      { id: 'm-padang-2', text: 'Temukan elang pemangsa puncak', type: 'biotik', targetCount: 1 },
      { id: 'm-padang-3', text: 'Catat hasil pengamatan ke Jurnal', type: 'journal', targetCount: 1 }
    ],
    organisms: [
      {
        id: 'rumput-gajah',
        name: 'Rumput Sabana',
        localName: 'Rumput Gajah & Ilalang',
        scientificName: 'Pennisetum purpureum',
        role: 'produsen',
        trophicLevelName: 'Produsen (Tumbuhan Sabana)',
        habitat: 'Hamparan padang terbuka',
        diet: 'Fotosintesis memanfaatkan sinar matahari terik dan air hujan.',
        predators: ['Belalang kembara', 'Sapi Jawa', 'Kelinci'],
        energySource: 'Cahaya Matahari',
        funFact: 'Akar rumput sabana sangat dalam dan kuat sehingga rumput dapat bertunas kembali setelah musim kemarau!',
        thinkingQuestion: 'Bagaimana rumput sabana bisa bertahan hidup meskipun berbulan-bulan tidak turun hujan?',
        icon: '🌾',
        x: 22,
        y: 74,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'belalang-savanna',
        name: 'Belalang Kembara',
        localName: 'Belalang Padang Rumput',
        scientificName: 'Locusta migratoria',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Herbivora)',
        habitat: 'Rumpun rumput ilalang',
        diet: 'Ujung daun rumput hijau muda.',
        predators: ['Katak', 'Burung Pipit', 'Ular'],
        energySource: 'Daun rumput',
        funFact: 'Kaki belakang belalang sangat kuat, mampu melompat sejauh 20 kali panjang tubuhnya sendiri!',
        thinkingQuestion: 'Jika rumput sabana mengering atau terbakar, ke mana belalang mencari makanan?',
        icon: '🦗',
        x: 35,
        y: 62,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'kelinci-jawa',
        name: 'Kelinci Padang Rumput',
        localName: 'Kelinci Liar Jawa',
        scientificName: 'Nesolagus netscheri',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Herbivora)',
        habitat: 'Semak tepi padang rumput',
        diet: 'Rumput manis, daun semanggi liar, dan umbi tanah.',
        predators: ['Ular', 'Burung Elang'],
        energySource: 'Rumput liar',
        funFact: 'Kelinci liar ini bersembunyi di cekungan tanah di bawah semak untuk berlindung dari sengatan panas dan pemangsa.',
        thinkingQuestion: 'Mengapa telinga kelinci berukuran panjang dan tegak?',
        icon: '🐇',
        x: 46,
        y: 72,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'sapi-jawa',
        name: 'Banteng Jawa',
        localName: 'Sapi Liar Pemamah Biak',
        scientificName: 'Bos javanicus',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Herbivora Besar)',
        habitat: 'Sabana terbuka dan tepi hutan',
        diet: 'Rumput gajah dan ilalang kering.',
        predators: ['Ajag (Anjing Hutan)'],
        energySource: 'Rumput padang',
        funFact: 'Banteng memiliki lambung dengan empat ruang untuk mencerna serat rumput yang keras!',
        thinkingQuestion: 'Kotoran sapi sangat baik untuk tanah rumput. Mengapa hal itu bisa terjadi?',
        icon: '🐂',
        x: 78,
        y: 68,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'ular-savanna',
        name: 'Ular Weling Padang',
        localName: 'Ular Belang Sabana',
        scientificName: 'Bungarus candidus',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II (Karnivora)',
        habitat: 'Celah bebatuan padang rumput',
        diet: 'Ular lain, tikus padang, katak, dan kadal kecil.',
        predators: ['Burung Elang'],
        energySource: 'Hewan kecil',
        funFact: 'Ular weling aktif berburu pada malam hari saat udara mulai sejuk. Bisanya sangat berbahaya, jadi jangan pernah mendekatinya!',
        thinkingQuestion: 'Bagaimana peran ular mengendalikan jumlah tikus di padang rumput?',
        icon: '🐍',
        x: 64,
        y: 78,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'elang-savanna',
        name: 'Elang Ular Bido',
        localName: 'Burung Elang Padang',
        scientificName: 'Spilornis cheela',
        role: 'konsumen-3',
        trophicLevelName: 'Konsumen Tingkat III / Puncak (Karnivora)',
        habitat: 'Pohon akasia tinggi',
        diet: 'Ular, kadal, dan tikus padang rumput.',
        predators: ['Tidak ada pemangsa alami'],
        energySource: 'Ular dan hewan darat kecil',
        funFact: 'Elang ular memiliki sisik tebal di kakinya agar tidak terluka saat mencengkeram ular!',
        thinkingQuestion: 'Mengapa burung pemangsa bertengger di pohon yang paling tinggi?',
        icon: '🦅',
        x: 82,
        y: 32,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'udara-panas-savanna',
        name: 'Angin dan Udara Sabana',
        role: 'Membantu penyerbukan bunga rumput',
        effectOnEcosystem: 'Embusan angin membawa serbuk sari rumput ke seluruh padang.',
        thinkingQuestion: 'Mengapa angin sangat penting bagi perkembangbiakan rumput?',
        icon: '💨',
        x: 50,
        y: 20
      },
      {
        id: 'tanah-berbatu-savanna',
        name: 'Tanah Padas Berbatu',
        role: 'Fondasi habitat sabana',
        effectOnEcosystem: 'Batu dan tanah kering menjadi tempat kadal dan ular berjemur untuk menghangatkan tubuh.',
        thinkingQuestion: 'Mengapa hewan berdarah dingin suka berjemur di atas batu saat pagi?',
        icon: '🪨',
        x: 14,
        y: 85
      }
    ],
    hiddenItem: {
      id: 'kadal-lidah-biru',
      name: 'Kadal Kebun',
      hint: 'Lihat celah batu di bawah pohon akasia kiri...',
      discoveryFact: 'Hebat! Kadal kebun ini pandai bersembunyi di celah batu dan berlari cepat untuk menghindari burung pemangsa.',
      xp: 60,
      x: 18,
      y: 78
    }
  },

  // 3. Sungai & Danau
  {
    id: 'sungai-danau',
    zoneNumber: 3,
    title: 'Sungai & Danau',
    theme: 'Ekosistem Perairan Tawar',
    tagline: 'Aliran air jernih dan danau tenang dengan kehidupan air yang kaya.',
    curriculumTopic: 'Organisme Air Tawar, Komponen Abiotik Jernih, dan Bioindikator Capung',
    bgImage: img_room_sungai_bersih,
    accentColor: '#1C5FC4',
    portalGlow: 'from-blue-500 to-cyan-600',
    portalIcon: '💧',
    ambientType: 'sungai',
    welcomeSpeech: 'Selamat datang di Sungai dan Danau! Dengarlah suara gemericik airnya. Di sini ada ikan wader, teratai mekar, capung jarum, dan katak sungai. Air bersih adalah sumber kehidupan!',
    guidingQuestion: 'Mengapa capung yang bertelur di sungai menjadi tanda bahwa air tersebut masih sangat bersih?',
    learningObjectives: [
      'Memahami faktor abiotik air tawar (kejernihan, batu, oksigen terlarut).',
      'Mengenal ikan wader pemakan jentik nyamuk.',
      'Memahami dampak limbah detergen dan sampah plastik terhadap kehidupan ikan.'
    ],
    zoneMissions: [
      { id: 'm-sungai-1', text: 'Amati 3 hewan/tumbuhan air tawar', type: 'biotik', targetCount: 3 },
      { id: 'm-sungai-2', text: 'Amati air dan batu kali', type: 'abiotik', targetCount: 2 },
      { id: 'm-sungai-3', text: 'Simpan catatan ke Jurnal', type: 'journal', targetCount: 1 }
    ],
    organisms: [
      {
        id: 'teratai-air',
        name: 'Tanaman Teratai',
        localName: 'Bunga Teratai Danau',
        scientificName: 'Nymphaea',
        role: 'produsen',
        trophicLevelName: 'Produsen (Tumbuhan Air)',
        habitat: 'Permukaan air danau, kolam, dan sungai yang tenang',
        diet: 'Membuat makanan sendiri melalui fotosintesis; akarnya menyerap air dan zat hara dari lumpur dasar danau.',
        predators: ['Siput air'],
        energySource: 'Cahaya Matahari',
        funFact: 'Daun teratai yang lebar berlapis lilin sehingga air tidak menempel dan daunnya tetap mengapung di permukaan!',
        thinkingQuestion: 'Mengapa daun teratai sangat lebar dan mengapung di permukaan air?',
        icon: '🪷',
        x: 24,
        y: 65,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'ikan-wader',
        name: 'Ikan Wader Kali',
        localName: 'Ikan Wader Asli',
        scientificName: 'Rasbora lateristriata',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I dan II (Omnivora)',
        habitat: 'Arus sungai jernih berbatu',
        diet: 'Lumut air dan jentik-jentik nyamuk.',
        predators: ['Ikan Gabus', 'Burung Raja Udang'],
        energySource: 'Lumut dan serangga kecil',
        funFact: 'Ikan wader suka makan jentik nyamuk sehingga membantu mengurangi jumlah nyamuk di sekitar sungai!',
        thinkingQuestion: 'Apa yang terjadi jika warga membuang air bekas sabun cuci langsung ke sungai?',
        icon: '🐟',
        x: 48,
        y: 75,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'capung-jarum',
        name: 'Capung Jarum Biru',
        localName: 'Capung Sahabat Air Bersih',
        scientificName: 'Ischnura senegalensis',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II (Predator Serangga)',
        habitat: 'Tumbuhan tepi sungai',
        diet: 'Nyamuk, lalat kecil, dan kutu air.',
        predators: ['Katak', 'Laba-laba air'],
        energySource: 'Nyamuk dan serangga kecil',
        funFact: 'Banyak jenis capung bertelur di air yang jernih karena anak capung butuh air bersih yang kaya oksigen. Jika banyak capung, itu tanda air sungai masih cukup bersih!',
        thinkingQuestion: 'Mengapa anak capung tidak bisa bertahan hidup di sungai yang tercemar limbah pabrik?',
        icon: '🫧',
        x: 32,
        y: 44,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'katak-sungai',
        name: 'Katak Sungai',
        localName: 'Katak Batu Kali',
        scientificName: 'Limnonectes kuhlii',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II atau III (Pemakan Serangga)',
        habitat: 'Bebatuan basah tepi sungai',
        diet: 'Capung, lalat, dan jangkrik air.',
        predators: ['Ular Air', 'Burung Bangau'],
        energySource: 'Serangga',
        funFact: 'Kulit katak selalu basah dan berlendir karena katak juga bernapas dengan menyerap oksigen melalui kulitnya!',
        thinkingQuestion: 'Mengapa katak harus hidup di dekat air atau tempat yang lembap?',
        icon: '🐸',
        x: 68,
        y: 72,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'air-sungai-jernih',
        name: 'Air Tawar Jernih',
        role: 'Media hidup seluruh organisme air',
        effectOnEcosystem: 'Air jernih kaya oksigen memungkinkan ikan bernapas lewat insang dengan nyaman.',
        thinkingQuestion: 'Bagaimana cara kita menjaga agar sungai di sekitar sekolah tetap jernih?',
        icon: '💧',
        x: 52,
        y: 84
      },
      {
        id: 'batu-sungai',
        name: 'Batu Kali Halus',
        role: 'Tempat berteduh dan tumbuh lumut',
        effectOnEcosystem: 'Batu kali menjadi tempat lumut tumbuh sebagai produsen makanan ikan wader.',
        thinkingQuestion: 'Mengapa batu kali di dalam air sering terasa licin saat dipegang?',
        icon: '🪨',
        x: 74,
        y: 85
      }
    ],
    hiddenItem: {
      id: 'kepiting-batu-langka',
      name: 'Kepiting Sungai',
      hint: 'Coba tengok celah batu di sebelah kiri sungai...',
      discoveryFact: 'Hebat! Kepiting air tawar bersembunyi di balik celah batu dan memakan serasah daun yang hanyut.',
      xp: 60,
      x: 18,
      y: 82
    }
  },

  // 4. Laut
  {
    id: 'laut',
    zoneNumber: 4,
    title: 'Laut',
    theme: 'Ekosistem Terumbu Karang',
    tagline: 'Surga warna-warni karang dan ikan hias di laut dangkal tropis.',
    curriculumTopic: 'Terumbu Karang Hewan Hidup, Simbiosis Ikan Badut, Bahaya Plastik bagi Penyu',
    bgImage: img_room_laut_karang,
    accentColor: '#0F766E',
    portalGlow: 'from-teal-500 to-blue-700',
    portalIcon: '🪸',
    ambientType: 'laut',
    welcomeSpeech: 'Ayo menyelam ke Laut! Tahukah kamu, terumbu karang yang indah ini sebenarnya dibangun oleh hewan hidup, jadi termasuk komponen biotik, bukan batu mati. Jangan sampai sampah plastik mencemari istana laut ini!',
    guidingQuestion: 'Mengapa terumbu karang disebut hewan dan bukan tumbuhan, dan mengapa penyu sering tertipu kantong plastik?',
    learningObjectives: [
      'Mengetahui bahwa terumbu karang hidup adalah hewan (komponen biotik).',
      'Memahami bahaya sampah plastik yang tertelan oleh penyu laut.',
      'Mengenal simbiosis mutualisme antara ikan badut dan anemon laut.'
    ],
    zoneMissions: [
      { id: 'm-laut-1', text: 'Amati hewan karang dan ikan badut', type: 'biotik', targetCount: 2 },
      { id: 'm-laut-2', text: 'Temukan penyu laut & bahaya plastik', type: 'biotik', targetCount: 1 },
      { id: 'm-laut-3', text: 'Simpan hasil pengamatan ke Jurnal', type: 'journal', targetCount: 1 }
    ],
    organisms: [
      {
        id: 'terumbu-karang',
        name: 'Terumbu Karang Hidup',
        localName: 'Hewan Karang Tropis',
        scientificName: 'Anthozoa',
        role: 'produsen',
        trophicLevelName: 'Konsumen (Hewan Karang, Rumah Laut)',
        habitat: 'Dasar laut dangkal hangat',
        diet: 'Mendapat makanan dari alga kecil (zooxanthellae) di tubuhnya dan menangkap plankton.',
        predators: ['Bintang Laut Berduri'],
        energySource: 'Alga kecil dan plankton',
        funFact: 'Terumbu karang adalah hewan! Karang hidup adalah biotik, sedangkan kerangka kapur karang yang sudah mati adalah abiotik.',
        thinkingQuestion: 'Jika air laut menjadi terlalu panas dan kotor, mengapa karang bisa memutih dan mati?',
        icon: '🪸',
        x: 24,
        y: 62,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'ikan-badut',
        name: 'Ikan Badut (Nemo)',
        localName: 'Ikan Badut Anemon',
        scientificName: 'Amphiprion ocellaris',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen (Omnivora: Pemakan Alga dan Plankton)',
        habitat: 'Anemon laut di terumbu karang',
        diet: 'Alga kecil, plankton, dan sisa makanan anemon.',
        predators: ['Ikan Kerapu'],
        energySource: 'Alga dan plankton',
        funFact: 'Ikan badut memiliki lendir khusus di kulitnya sehingga kebal terhadap sengatan racun anemon!',
        thinkingQuestion: 'Bagaimana ikan badut dan anemon laut saling membantu satu sama lain?',
        icon: '🐠',
        x: 38,
        y: 52,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'penyu-hijau',
        name: 'Penyu Hijau',
        localName: 'Penyu Laut Nusantara',
        scientificName: 'Chelonia mydas',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat I (Pemakan Lamun dan Alga)',
        habitat: 'Laut lepas dan padang lamun',
        diet: 'Lamun laut dan alga; penyu muda juga memakan ubur-ubur.',
        predators: ['Ikan Hiu'],
        energySource: 'Lamun dan ubur-ubur',
        funFact: 'Penyu sering mengira kantong plastik sebagai ubur-ubur makanan mereka. Sampah plastik sangat berbahaya jika tertelan penyu!',
        thinkingQuestion: 'Aksi kecil apa yang bisa kita lakukan di darat agar penyu di laut tidak menelan sampah plastik?',
        icon: '🐢',
        x: 68,
        y: 38,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'air-laut-asin',
        name: 'Air Laut Tropis',
        role: 'Media air dengan kadar garam alami',
        effectOnEcosystem: 'Air laut yang jernih memungkinkan sinar matahari sampai ke dasar karang.',
        thinkingQuestion: 'Mengapa terumbu karang hanya bisa tumbuh di air laut yang jernih dan dangkal?',
        icon: '🌊',
        x: 50,
        y: 18
      },
      {
        id: 'pasir-pantai-laut',
        name: 'Pasir Laut',
        role: 'Dasar laut tempat tinggal kerang',
        effectOnEcosystem: 'Pasir putih halus adalah benda mati (abiotik) tempat biota karang berpijak.',
        thinkingQuestion: 'Dari mana asal butiran pasir putih di pantai?',
        icon: '🏖️',
        x: 15,
        y: 84
      }
    ],
    hiddenItem: {
      id: 'kuda-laut',
      name: 'Kuda Laut Kecil',
      hint: 'Cari di antara cabang karang merah muda...',
      discoveryFact: 'Hebat! Kuda laut kecil pandai menyamar seperti cabang karang agar tidak dimangsa ikan lain.',
      xp: 60,
      x: 18,
      y: 72
    }
  },

  // 5. Rantai Makanan (Food Chain Lab)
  {
    id: 'rantai-makanan',
    zoneNumber: 5,
    title: 'Rantai Makanan',
    theme: 'Aliran Energi Makanan',
    tagline: 'Perpindahan energi kehidupan dari produsen, konsumen, hingga pengurai.',
    curriculumTopic: 'Arah Panah Rantai Makanan (Dimakan → Memakan) dan Jaring-jaring Makanan',
    bgImage: img_zone_rantai_makanan,
    accentColor: '#E68A00',
    portalGlow: 'from-amber-500 to-orange-600',
    portalIcon: '🔗',
    ambientType: 'alam',
    welcomeSpeech: 'Selamat datang di Laboratorium Rantai Makanan! Ingat prinsip sains: arah panah selalu dari yang dimakan ke yang memakan. Artinya, energi berpindah ke tubuh pemakannya!',
    guidingQuestion: 'Ke mana arah aliran energi berpindah dalam rantai makanan padi → tikus → ular → elang?',
    learningObjectives: [
      'Menyusun rantai makanan berurutan: Produsen → Konsumen I → Konsumen II → Konsumen Puncak → Pengurai.',
      'Memahami arah panah sebagai perpindahan energi kehidupan.',
      'Menganalisis perbedaan rantai makanan tunggal dengan jaring-jaring makanan yang bercabang.'
    ],
    zoneMissions: [
      { id: 'm-rantai-1', text: 'Susun urutan rantai makanan lengkap', type: 'activity', targetCount: 1 },
      { id: 'm-rantai-2', text: 'Tunjukkan ke mana energi berpindah dari yang dimakan ke pemakannya', type: 'biotik', targetCount: 2 },
      { id: 'm-rantai-3', text: 'Simpan penjelasan rantai ke Jurnal', type: 'journal', targetCount: 1 }
    ],
    organisms: [
      {
        id: 'padi-energi',
        name: 'Padi Produsen',
        localName: 'Tanaman Padi',
        scientificName: 'Oryza sativa',
        role: 'produsen',
        trophicLevelName: 'Produsen (Penyerap Sinar Matahari)',
        habitat: 'Petak sawah basah',
        diet: 'Membuat makanan sendiri melalui fotosintesis.',
        predators: ['Tikus', 'Belalang'],
        energySource: 'Cahaya Matahari',
        funFact: 'Padi adalah pangkal aliran energi makanan yang memberi makan miliaran manusia dan hewan di bumi!',
        thinkingQuestion: 'Jika tidak ada sinar matahari, apakah padi masih bisa mengawali rantai makanan?',
        icon: '🌾',
        x: 20,
        y: 65,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'tikus-sawah',
        name: 'Tikus Sawah',
        localName: 'Tikus Padi',
        scientificName: 'Rattus argentiventer',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Herbivora)',
        habitat: 'Lubang pematang sawah',
        diet: 'Biji gabah dan batang padi muda.',
        predators: ['Ular Sawah', 'Burung Hantu'],
        energySource: 'Bulir padi',
        funFact: 'Tikus memiliki gigi seri yang terus bertumbuh sehingga ia harus rajin mengerat biji padi!',
        thinkingQuestion: 'Mengapa jumlah tikus bisa meledak sangat cepat jika ular sawah diburu habis?',
        icon: '🐭',
        x: 42,
        y: 68,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'ular-padi',
        name: 'Ular Sawah',
        localName: 'Ular Sawah Penjaga',
        scientificName: 'Ptyas korros',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II (Karnivora)',
        habitat: 'Pematang sawah',
        diet: 'Tikus sawah dan katak.',
        predators: ['Burung Elang'],
        energySource: 'Tikus sawah',
        funFact: 'Satu ekor ular sawah bisa memangsa puluhan tikus setiap bulan, sangat berjasa bagi petani!',
        thinkingQuestion: 'Mengapa membunuh ular sawah justru membuat petani gagal panen?',
        icon: '🐍',
        x: 64,
        y: 62,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'elang-puncak',
        name: 'Elang Ular Bido',
        localName: 'Elang Puncak',
        scientificName: 'Spilornis cheela',
        role: 'konsumen-3',
        trophicLevelName: 'Konsumen Tingkat III / Puncak',
        habitat: 'Pohon beringin tinggi',
        diet: 'Ular sawah dan mamalia kecil.',
        predators: ['Tidak ada predator alami'],
        energySource: 'Ular dan hewan darat',
        funFact: 'Elang adalah konsumen puncak yang menjaga keseimbangan rantai makanan! Kerabatnya, elang jawa, adalah satwa langka nasional yang dianggap mirip burung Garuda.',
        thinkingQuestion: 'Apa yang terjadi pada tubuh elang saat ia mati? Siapa yang menguraikannya?',
        icon: '🦅',
        x: 82,
        y: 25,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'energi-matahari-makanan',
        name: 'Matahari Sumber Energi',
        role: 'Energi utama seluruh rantai makanan',
        effectOnEcosystem: 'Semua energi pada hewan karnivora berasal dari energi matahari yang pertama kali ditangkap oleh tumbuhan.',
        thinkingQuestion: 'Dapatkah karnivora bertahan hidup tanpa adanya tumbuhan dan matahari?',
        icon: '☀️',
        x: 18,
        y: 18
      }
    ]
  },

  // 6. Keseimbangan Ekosistem
  {
    id: 'keseimbangan-ekosistem',
    zoneNumber: 6,
    title: 'Keseimbangan Ekosistem',
    theme: 'Harmoni & Dinamika Populasi',
    tagline: 'Melihat interaksi sebab-akibat ketika satu populasi bertambah atau berkurang.',
    curriculumTopic: 'Simulasi Keseimbangan Alam, Dampak Perburuan Predator, dan Pemulihan Ekosistem',
    bgImage: img_zone_keseimbangan_ekosistem,
    accentColor: '#1B5E3F',
    portalGlow: 'from-green-600 to-emerald-800',
    portalIcon: '⚖️',
    ambientType: 'alam',
    welcomeSpeech: 'Selamat datang di Zona Keseimbangan Ekosistem! Di sini kamu bisa menjalankan simulasi sains: lihat apa yang terjadi saat ekosistem seimbang, dan coba perbaiki jika terjadi gangguan!',
    guidingQuestion: 'Mengapa hilangnya satu jenis hewan predator dapat merusak seisi ekosistem?',
    learningObjectives: [
      'Memahami konsep keseimbangan alam dalam ekosistem.',
      'Mengamati dampak jika predator diburu atau tumbuhan berkurang.',
      'Melakukan aksi pelestarian untuk mengembalikan ekosistem ke titik seimbang.'
    ],
    zoneMissions: [
      { id: 'm-seimbang-1', text: 'Jalankan simulasi hingga mencapai status Seimbang', type: 'activity', targetCount: 1 },
      { id: 'm-seimbang-2', text: 'Uji coba skenario gangguan: ular diburu manusia', type: 'activity', targetCount: 1 },
      { id: 'm-seimbang-3', text: 'Lakukan perbaikan ekosistem dan catat di Jurnal', type: 'journal', targetCount: 1 }
    ],
    organisms: [
      {
        id: 'tumbuhan-seimbang',
        name: 'Komunitas Tumbuhan Hijau',
        localName: 'Produsen Alam',
        scientificName: 'Flora autotrof',
        role: 'produsen',
        trophicLevelName: 'Produsen Utama',
        habitat: 'Seluruh penjuru ekosistem',
        diet: 'Membuat makanan sendiri.',
        predators: ['Hewan Herbivora'],
        energySource: 'Matahari',
        funFact: 'Jumlah tumbuhan dibatasi oleh daya dukung lingkungan, seperti ketersediaan air, cahaya, dan unsur hara di dalam tanah.',
        thinkingQuestion: 'Jika musim kemarau sangat panjang, bagaimana populasi tumbuhan memengaruhi hewan lain?',
        icon: '🌳',
        x: 25,
        y: 60,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'herbivora-seimbang',
        name: 'Kawanan Herbivora',
        localName: 'Hewan Pemakan Tumbuhan',
        scientificName: 'Fauna herbivora',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I',
        habitat: 'Padang dan tepi hutan',
        diet: 'Tumbuhan hijau.',
        predators: ['Karnivora Pemangsa'],
        energySource: 'Tumbuhan',
        funFact: 'Jumlah herbivora dikendalikan oleh ketersediaan makanan dan kehadiran pemangsa.',
        thinkingQuestion: 'Apa yang terjadi jika jumlah herbivora terlalu banyak dibandingkan tumbuhan yang tersedia?',
        icon: '🦌',
        x: 48,
        y: 65,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'karnivora-seimbang',
        name: 'Predator Pengontrol',
        localName: 'Hewan Pemangsa Puncak',
        scientificName: 'Fauna karnivora',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II (Pemangsa)',
        habitat: 'Wilayah jelajah rimba',
        diet: 'Hewan herbivora.',
        predators: ['Tidak ada predator'],
        energySource: 'Daging herbivora',
        funFact: 'Predator adalah dokter alam yang memangsa hewan sakit dan lemah agar populasi tetap sehat!',
        thinkingQuestion: 'Mengapa predator tidak menghabiskan seluruh mangsanya sampai punah di alam?',
        icon: '🦅',
        x: 75,
        y: 45,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'daya-dukung-alam',
        name: 'Daya Dukung Lingkungan',
        role: 'Kapasitas maksimal ekosistem',
        effectOnEcosystem: 'Air, ruang hidup, dan unsur hara tanah membatasi jumlah populasi yang bisa bertahan hidup.',
        thinkingQuestion: 'Apa arti daya dukung lingkungan bagi kelangsungan makhluk hidup?',
        icon: '🌍',
        x: 50,
        y: 20
      }
    ]
  },

  // 7. Ekosistem Buatan (Sawah & Kebun)
  {
    id: 'ekosistem-buatan',
    zoneNumber: 7,
    title: 'Ekosistem Buatan',
    theme: 'Sawah, Kebun, dan Kolam',
    tagline: 'Harmoni ekosistem pertanian yang dirawat oleh manusia untuk kebutuhan pangan.',
    curriculumTopic: 'Perbedaan Ekosistem Alami dan Buatan, Hama Sawah, dan Predator Pembasmi Alami',
    bgImage: img_room_sawah_kebun,
    accentColor: '#D45014',
    portalGlow: 'from-orange-500 to-amber-700',
    portalIcon: '🏡',
    ambientType: 'sawah',
    welcomeSpeech: 'Selamat datang di Ekosistem Buatan! Sawah, kebun sayur, dan kolam ikan dibuat manusia untuk menghasilkan pangan. Petani yang bijak tidak memakai racun kimia berlebihan, melainkan mengajak burung hantu dan katak menjaga sawah!',
    guidingQuestion: 'Apa perbedaan mendasar antara hutan alami dengan sawah buatan manusia?',
    learningObjectives: [
      'Membedakan ekosistem alami (hutan, laut) dengan ekosistem buatan (sawah, tambak, kebun).',
      'Mengenal rantai makanan sawah: Padi → Belalang → Katak → Ular, dan Padi → Tikus → Burung Hantu.',
      'Memahami bahaya pestisida berlebihan dan manfaat musuh alami hama.'
    ],
    zoneMissions: [
      { id: 'm-buatan-1', text: 'Amati tanaman pangan dan hewan di sawah', type: 'biotik', targetCount: 3 },
      { id: 'm-buatan-2', text: 'Amati air irigasi parit dan lumpur', type: 'abiotik', targetCount: 2 },
      { id: 'm-buatan-3', text: 'Catat kesimpulan ke Jurnal', type: 'journal', targetCount: 1 }
    ],
    organisms: [
      {
        id: 'tanaman-padi-sawah',
        name: 'Tanaman Padi Sawah',
        localName: 'Padi Siap Panen',
        scientificName: 'Oryza sativa',
        role: 'produsen',
        trophicLevelName: 'Produsen Pangan',
        habitat: 'Petak sawah berteras',
        diet: 'Membuat makanan sendiri melalui fotosintesis; akarnya menyerap air irigasi dan zat hara dari pupuk organik.',
        predators: ['Wereng cokelat', 'Tikus'],
        energySource: 'Cahaya Matahari',
        funFact: 'Sistem irigasi, seperti subak di Bali, mengalirkan air dari sungai dan bendungan ke petak-petak sawah!',
        thinkingQuestion: 'Mengapa sawah membutuhkan campur tangan petani agar tanamannya tidak mati?',
        icon: '🌾',
        x: 18,
        y: 65,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'burung-hantu-sawah',
        name: 'Burung Hantu Serak Jawa',
        localName: 'Burung Hantu Sahabat Petani',
        scientificName: 'Tyto alba',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II (Pembasmi Hama Alami)',
        habitat: 'Rumah burung hantu (rubuha) di tengah sawah',
        diet: 'Tikus sawah pada malam hari.',
        predators: ['Tidak ada predator'],
        energySource: 'Tikus sawah',
        funFact: 'Satu pasang burung hantu Tyto alba bisa memangsa lebih dari 1.000 tikus sawah dalam setahun!',
        thinkingQuestion: 'Mengapa petani modern memasang tiang rumah burung hantu di tengah sawah?',
        icon: '🦉',
        x: 72,
        y: 35,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'ikan-mujair-kolam',
        name: 'Ikan Mujair Kolam',
        localName: 'Ikan Air Tawar Kolam',
        scientificName: 'Oreochromis mossambicus',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Omnivora Kolam)',
        habitat: 'Kolam dan petak sawah mina padi',
        diet: 'Lumut sawah dan serangga air.',
        predators: ['Burung Bangau', 'Manusia'],
        energySource: 'Lumut dan serangga air',
        funFact: 'Sistem mina padi memelihara ikan bersama padi, sehingga kotoran ikan menyuburkan tanah dan ikan memakan hama serangga!',
        thinkingQuestion: 'Bagaimana padi dan ikan di sistem mina padi saling menguntungkan?',
        icon: '🐟',
        x: 45,
        y: 78,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'saluran-irigasi',
        name: 'Air Saluran Irigasi',
        role: 'Mengairi seluruh tanaman padi',
        effectOnEcosystem: 'Aliran air dari bendungan desa menjaga petak sawah tetap basah dan subur.',
        thinkingQuestion: 'Mengapa parit irigasi harus dijaga agar tidak tersumbat sampah plastik?',
        icon: '💧',
        x: 52,
        y: 72
      },
      {
        id: 'lumpur-sawah',
        name: 'Lumpur Tanah Sawah',
        role: 'Media perakaran padi',
        effectOnEcosystem: 'Lumpur gembur menjadi tempat hidup cacing tanah yang ikut menggemburkan tanah sawah.',
        thinkingQuestion: 'Mengapa tanah sawah harus dibajak sebelum ditanami bibit padi?',
        icon: '🌾',
        x: 28,
        y: 82
      }
    ]
  },

  // 8. Pelestarian Lingkungan
  {
    id: 'pelestarian-lingkungan',
    zoneNumber: 8,
    title: 'Pelestarian Lingkungan',
    theme: 'Aksi Nyata Sahabat Bumi',
    tagline: 'Memilah sampah, menanam pohon penghijauan, dan merawat kelestarian alam.',
    curriculumTopic: 'Upaya Manusia Menjaga Keseimbangan Ekosistem: Pemilahan Sampah, Reboisasi, Hemat Air',
    bgImage: img_zone_pelestarian_lingkungan,
    accentColor: '#1B5E3F',
    portalGlow: 'from-emerald-500 to-teal-700',
    portalIcon: '🌱',
    ambientType: 'alam',
    welcomeSpeech: 'Selamat datang di Zona Pelestarian Lingkungan! Manusia memiliki tanggung jawab besar menjaga bumi. Di sini kita belajar memilah sampah sesuai jenisnya, menanam pohon, dan menghemat air!',
    guidingQuestion: 'Aksi nyata apa yang bisa kamu lakukan hari ini di rumah dan sekolah untuk merawat bumi?',
    learningObjectives: [
      'Memilah sampah berdasarkan jenisnya: organik, anorganik, dan limbah B3 (bahan berbahaya dan beracun).',
      'Memahami manfaat menanam pohon (reboisasi) untuk mencegah erosi dan menghasilkan oksigen.',
      'Menilai dampak aksi baik versus aksi buruk manusia terhadap keseimbangan ekosistem.'
    ],
    zoneMissions: [
      { id: 'm-lestarikan-1', text: 'Pilah sampah ke tempat sampah yang benar', type: 'activity', targetCount: 1 },
      { id: 'm-lestarikan-2', text: 'Amati bibit pohon penghijauan', type: 'biotik', targetCount: 1 },
      { id: 'm-lestarikan-3', text: 'Simpan janji sahabat bumi ke Jurnal', type: 'journal', targetCount: 1 }
    ],
    organisms: [
      {
        id: 'bibit-pohon-penghijauan',
        name: 'Bibit Pohon Penghijauan',
        localName: 'Tunas Pohon Reboisasi',
        scientificName: 'Bibit Tanaman Asli',
        role: 'produsen',
        trophicLevelName: 'Produsen Masa Depan',
        habitat: 'Taman pelestarian dan lereng bukit',
        diet: 'Menyerap air tanah dan sinar matahari.',
        predators: ['Ulat daun'],
        energySource: 'Cahaya Matahari',
        funFact: 'Saat sudah tumbuh besar, sebatang pohon dapat menyerap karbon dioksida dan menghasilkan oksigen yang kita butuhkan untuk bernapas!',
        thinkingQuestion: 'Mengapa lereng bukit yang gundul harus segera ditanami pohon kembali?',
        icon: '🌱',
        x: 32,
        y: 68,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'kupu-kupu-taman',
        name: 'Kupu-kupu Sayap Renda',
        localName: 'Kupu-kupu Penyerbuk',
        scientificName: 'Cethosia biblis',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Sahabat Bunga)',
        habitat: 'Bunga taman pelestarian',
        diet: 'Nektar bunga mekar.',
        predators: ['Burung Gereja'],
        energySource: 'Nektar bunga',
        funFact: 'Kupu-kupu membantu bunga menghasilkan biji dan buah melalui proses penyerbukan!',
        thinkingQuestion: 'Apa akibatnya jika taman bunga disemprot racun pembasmi serangga?',
        icon: '🦋',
        x: 54,
        y: 52,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'tempat-sampah-organik',
        name: 'Tempat Sampah Organik (Hijau)',
        role: 'Wadah sisa makanan dan daun kering',
        effectOnEcosystem: 'Sampah organik diolah menjadi pupuk kompos alami untuk menyuburkan tanaman.',
        thinkingQuestion: 'Sebutkan 3 contoh sampah yang boleh dimasukkan ke tempat sampah hijau!',
        icon: '♻️',
        x: 20,
        y: 58
      },
      {
        id: 'tempat-sampah-plastik',
        name: 'Tempat Sampah Anorganik (Kuning)',
        role: 'Wadah botol plastik, kertas, dan kaleng',
        effectOnEcosystem: 'Mencegah sampah plastik terbuang ke sungai dan laut tempat penyu mencari makan.',
        thinkingQuestion: 'Mengapa botol plastik membutuhkan ratusan tahun untuk bisa hancur di alam?',
        icon: '🗑️',
        x: 24,
        y: 58
      },
      {
        id: 'air-bersih-konservasi',
        name: 'Mata Air Alami',
        role: 'Sumber air minum bersih',
        effectOnEcosystem: 'Hutan yang lebat menjaga air hujan tersimpan di dalam tanah sebagai mata air yang terus mengalir.',
        thinkingQuestion: 'Bagaimana akar pohon membantu menahan air di dalam tanah?',
        icon: '💧',
        x: 48,
        y: 78
      }
    ]
  }
];

export const MUSEUM_ROOMS: RoomData[] = MUSEUM_ZONES;

export const MUSEUM_BADGES: Badge[] = [
  {
    id: 'penjelajah-hutan',
    title: 'Sahabat Hutan',
    description: 'Menyelesaikan eksplorasi di ekosistem Hutan Tropis.',
    icon: '🌲',
    color: '#1B5E3F'
  },
  {
    id: 'penjelajah-sabana',
    title: 'Penjelajah Padang Rumput',
    description: 'Menjelajahi keanekaragaman padang rumput Sabana Baluran.',
    icon: '🌾',
    color: '#8BC34A'
  },
  {
    id: 'penjaga-sungai',
    title: 'Penjaga Sungai & Danau',
    description: 'Menemukan rahasia kejernihan air di Sungai & Danau.',
    icon: '💧',
    color: '#1C5FC4'
  },
  {
    id: 'sahabat-karang',
    title: 'Penyelamat Karang',
    description: 'Menjelajahi terumbu karang hidup di laut dan mengenal bahaya plastik.',
    icon: '🪸',
    color: '#0F766E'
  },
  {
    id: 'ahli-rantai-makanan',
    title: 'Ahli Rantai Makanan',
    description: 'Berhasil menyusun rantai makanan dan arah aliran energi.',
    icon: '🔗',
    color: '#E68A00'
  },
  {
    id: 'penjaga-keseimbangan',
    title: 'Penjaga Keseimbangan',
    description: 'Mencapai titik seimbang pada simulasi ekosistem tiga tingkat: tumbuhan, herbivora, dan pemangsa.',
    icon: '⚖️',
    color: '#1B5E3F'
  },
  {
    id: 'sahabat-tani',
    title: 'Sahabat Ekosistem Buatan',
    description: 'Menjaga harmoni sawah, kebun, dan predator pembasmi hama.',
    icon: '🏡',
    color: '#D45014'
  },
  {
    id: 'sahabat-bumi',
    title: 'Pahlawan Lingkungan',
    description: 'Melakukan pemilahan sampah dan penanaman pohon penghijauan.',
    icon: '🌱',
    color: '#1B5E3F'
  },
  {
    id: 'jurnal-lengkap',
    title: 'Jurnal Penjelajah Lengkap',
    description: 'Menyimpan lebih dari 10 catatan pengamatan di Jurnal.',
    icon: '📖',
    color: '#F5C518'
  },
  {
    id: 'detektif-ekosistem',
    title: 'Detektif Ekosistem Cilik',
    description: 'Menemukan objek tersembunyi dan menyelesaikan kuis akhir.',
    icon: '🔍',
    color: '#7C3AED'
  }
];
