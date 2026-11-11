import { Badge, QuizQuestion, RoomData, ZoneData } from '../types';
import img_room_hutan_harmoni from '../assets/images/room_hutan_harmoni_1794113870103.jpg';
import img_room_laut_karang from '../assets/images/room_laut_karang_1794113870846.jpg';
import img_room_sawah_kebun from '../assets/images/room_sawah_kebun_1794113871188.jpg';
import img_room_sungai_bersih from '../assets/images/room_sungai_bersih_1794113871226.jpg';
export { MUSEUM_ZONES, MUSEUM_ROOMS, MUSEUM_BADGES } from './museumZonesData';

const LEGACY_ROOMS: RoomData[] = [
  {
    id: 'hutan-harmoni',
    roomNumber: 1,
    title: 'Hutan',
    theme: 'Ekosistem Hutan',
    tagline: 'Pohon rimbun tempat tinggal satwa liar.',
    curriculumTopic: 'Tumbuhan, Hewan, dan Pengurai di Hutan',
    bgImage: img_room_hutan_harmoni,
    accentColor: '#1E7A50',
    ambientType: 'hutan',
    welcomeSpeech: 'Halo penjelajah! Selamat datang di Hutan. Di sini ada pohon tinggi, rusa, harimau, dan jamur. Yuk, cari tahu siapa yang membuat makanan dan siapa pemakannya!',
    guidingQuestion: 'Mengapa pohon di hutan disebut produsen, sedangkan rusa disebut herbivora?',
    learningObjectives: [
      'Mengenal produsen (tumbuhan pembuat makanan).',
      'Mengenal konsumen herbivora dan karnivora.',
      'Mengenal jamur sebagai pengurai sisa makhluk hidup.'
    ],
    organisms: [
      {
        id: 'pohon-hutan',
        name: 'Pohon Hutan',
        localName: 'Pohon Rimbun',
        scientificName: 'Pohon Tropis',
        role: 'produsen',
        trophicLevelName: 'Produsen (Pembuat Makanan)',
        habitat: 'Hutan lebat',
        diet: 'Membuat makanan sendiri dari air dan udara (karbon dioksida) dengan bantuan sinar matahari.',
        predators: ['Rusa (makan daun muda)', 'Ulat'],
        energySource: 'Cahaya Matahari',
        funFact: 'Pohon hutan menghasilkan oksigen segar yang kita hirup bersama hewan-hewan!',
        icon: '🌳',
        x: 28,
        y: 42,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'rusa-hutan',
        name: 'Rusa',
        localName: 'Rusa Pemakan Daun',
        scientificName: 'Rusa Sambar',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Herbivora)',
        habitat: 'Lantai hutan',
        diet: 'Rumput segar dan dedaunan muda.',
        predators: ['Harimau'],
        energySource: 'Tumbuhan produsen',
        funFact: 'Rusa memiliki telinga lebar dan dapat berlari cepat untuk menghindari pemangsa.',
        icon: '🦌',
        x: 48,
        y: 68,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'harimau-sumatra',
        name: 'Harimau Sumatra',
        localName: 'Harimau Pemangsa',
        scientificName: 'Harimau',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Puncak (Karnivora)',
        habitat: 'Hutan lebat',
        diet: 'Daging rusa dan hewan liar lain.',
        predators: ['Tidak ada pemangsa alami'],
        energySource: 'Konsumen herbivora',
        funFact: 'Harimau menjaga agar jumlah rusa di hutan tidak terlalu banyak sehingga rumput tidak habis.',
        icon: '🐅',
        x: 82,
        y: 56,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'jamur-hutan',
        name: 'Jamur Payung Hutan',
        localName: 'Jamur Pengurai',
        scientificName: 'Fungi',
        role: 'pengurai',
        trophicLevelName: 'Pengurai (Dekomposer)',
        habitat: 'Batang kayu lapuk dan tanah basah',
        diet: 'Menguraikan daun gugur dan kayu mati.',
        predators: ['Siput', 'Kumbang'],
        energySource: 'Sisa makhluk hidup mati',
        funFact: 'Jamur mengubah kayu dan daun kering menjadi tanah humus yang sangat subur!',
        icon: '🍄',
        x: 18,
        y: 78,
        isBiotic: true,
        category: 'fungi'
      }
    ],
    abioticFactors: [
      {
        id: 'sinar-matahari',
        name: 'Sinar Matahari',
        role: 'Sumber energi utama',
        effectOnEcosystem: 'Membantu daun pohon membuat makanan melalui fotosintesis.',
        icon: '☀️',
        x: 52,
        y: 12
      },
      {
        id: 'tanah-humus',
        name: 'Tanah Humus',
        role: 'Tempat akar tumbuh dan mencengkeram',
        effectOnEcosystem: 'Menyediakan air dan zat hara untuk pertumbuhan pohon.',
        icon: '🪨',
        x: 36,
        y: 84
      }
    ],
    hiddenItem: {
      id: 'kumbang-tersembunyi',
      name: 'Kumbang Daun Hijau',
      hint: 'Cari di dekat lumut hijau pada batu di tepi sungai...',
      discoveryFact: 'Hebat! Kamu menemukan Kumbang Daun. Warna hijaunya mirip daun sehingga ia aman dari burung pemangsa.',
      xp: 50,
      x: 39,
      y: 74
    }
  },
  {
    id: 'sungai-bersih',
    roomNumber: 2,
    title: 'Sungai',
    theme: 'Ekosistem Air Tawar',
    tagline: 'Air jernih tempat ikan dan capung bermain.',
    curriculumTopic: 'Rantai Makanan Sungai dan Kebersihan Air',
    bgImage: img_room_sungai_bersih,
    accentColor: '#1C5FC4',
    ambientType: 'sungai',
    welcomeSpeech: 'Dengarkan suara gemericik air! Ini adalah ekosistem Sungai. Air yang jernih disukai ikan nila, capung, dan tumbuhan air.',
    guidingQuestion: 'Mengapa banyak capung beterbangan di atas sungai yang bersih?',
    learningObjectives: [
      'Mengetahui lumut dan ganggang sebagai produsen di sungai.',
      'Memahami rantai makanan di sungai: Lumut → Ikan Kecil → Katak → Ikan Besar.',
      'Memahami pentingnya tidak membuang sampah ke sungai.'
    ],
    organisms: [
      {
        id: 'ganggang-air',
        name: 'Lumut dan Ganggang Air',
        localName: 'Lumut Air',
        scientificName: 'Alga Air Tawar',
        role: 'produsen',
        trophicLevelName: 'Produsen (Tumbuhan Air)',
        habitat: 'Bebatuan sungai yang terkena sinar matahari',
        diet: 'Membuat makanan sendiri dengan sinar matahari dan air.',
        predators: ['Ikan Wader Kecil', 'Keong Air'],
        energySource: 'Sinar Matahari',
        funFact: 'Lumut air melepaskan gelembung oksigen ke dalam air sehingga ikan bisa bernapas!',
        icon: '🌿',
        x: 22,
        y: 65,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'ikan-wader',
        name: 'Ikan Wader',
        localName: 'Ikan Sungai Kecil',
        scientificName: 'Ikan Air Tawar',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Pemakan Lumut)',
        habitat: 'Sungai air tawar yang jernih',
        diet: 'Lumut air dan jentik-jentik nyamuk.',
        predators: ['Katak', 'Ikan Gabus'],
        energySource: 'Lumut air',
        funFact: 'Ikan wader suka makan jentik nyamuk sehingga membantu mengurangi jumlah nyamuk di sekitar sungai!',
        icon: '🐟',
        x: 45,
        y: 58,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'capung-sungai',
        name: 'Capung',
        localName: 'Capung Air',
        scientificName: 'Capung',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II (Karnivora Kecil)',
        habitat: 'Pinggir sungai yang bersih',
        diet: 'Nyamuk dan lalat kecil.',
        predators: ['Katak'],
        energySource: 'Nyamuk dan serangga kecil',
        funFact: 'Capung suka bertelur di air sungai yang jernih dan bebas dari limbah detergen.',
        icon: '🦗',
        x: 32,
        y: 28,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'katak-sungai',
        name: 'Katak Sungai',
        localName: 'Katak Hijau',
        scientificName: 'Amfibi',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II atau III (Karnivora)',
        habitat: 'Bebatuan basah tepi sungai',
        diet: 'Capung, lalat, cacing, dan ikan kecil.',
        predators: ['Ular Air', 'Ikan Besar'],
        energySource: 'Serangga',
        funFact: 'Katak bisa melompat jauh dan menangkap serangga yang terbang dengan lidahnya yang lengket!',
        icon: '🐸',
        x: 16,
        y: 45,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'air-sungai',
        name: 'Air Sungai Jernih',
        role: 'Tempat hidup ikan',
        effectOnEcosystem: 'Air jernih mengandung banyak oksigen untuk insang ikan.',
        icon: '💧',
        x: 60,
        y: 42
      },
      {
        id: 'batu-sungai',
        name: 'Batu Kerikil Sungai',
        role: 'Tempat bersembunyi anak ikan',
        effectOnEcosystem: 'Batu sungai adalah benda mati (abiotik) tempat lumut menempel.',
        icon: '🪨',
        x: 82,
        y: 78
      }
    ],
    hiddenItem: {
      id: 'kepiting-sungai',
      name: 'Kepiting Air Tawar',
      hint: 'Lihat celah batu di bawah air yang jernih...',
      discoveryFact: 'Bagus sekali! Kepiting sungai bersembunyi di balik batu kerikil dan hanya hidup di air yang bersih.',
      xp: 50,
      x: 72,
      y: 75
    }
  },
  {
    id: 'laut-karang',
    roomNumber: 3,
    title: 'Laut',
    theme: 'Ekosistem Terumbu Karang',
    tagline: 'Warna-warni terumbu karang dan ikan hias.',
    curriculumTopic: 'Terumbu Karang (Hewan) dan Hewan Laut',
    bgImage: img_room_laut_karang,
    accentColor: '#0D7377',
    ambientType: 'laut',
    welcomeSpeech: 'Ayo menyelam ke Laut! Tahukah kamu, terumbu karang yang indah ini sebenarnya dibentuk oleh hewan karang yang hidup berkelompok, bukan batu atau tumbuhan.',
    guidingQuestion: 'Mengapa ikan badut suka tinggal di dekat anemon laut yang beracun?',
    learningObjectives: [
      'Mengetahui bahwa terumbu karang adalah hewan hidup (komponen biotik).',
      'Memahami simbiosis saling menguntungkan ikan badut dan anemon laut.',
      'Memahami bahaya sampah plastik yang termakan oleh penyu laut.'
    ],
    organisms: [
      {
        id: 'terumbu-karang',
        name: 'Terumbu Karang',
        localName: 'Hewan Karang Hidup',
        scientificName: 'Hewan Karang',
        role: 'produsen', // functioned ecologically as base habitat & symbiotic alga host
        trophicLevelName: 'Hewan Karang (Rumah Laut)',
        habitat: 'Dasar laut dangkal yang hangat',
        diet: 'Mendapat makanan dari alga kecil di tubuhnya dan menangkap plankton.',
        predators: ['Bintang Laut Berduri'],
        energySource: 'Alga kecil dan plankton',
        funFact: 'Terumbu karang adalah hewan! Karang yang hidup adalah biotik, sedangkan batu karang mati adalah benda abiotik.',
        icon: '🪸',
        x: 24,
        y: 62,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'ikan-badut',
        name: 'Ikan Badut',
        localName: 'Ikan Badut (Nemo)',
        scientificName: 'Ikan Badut',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Pemakan Alga)',
        habitat: 'Anemon laut di terumbu karang',
        diet: 'Alga kecil dan sisa makanan.',
        predators: ['Ikan Kerapu Besar'],
        energySource: 'Alga kecil dan plankton',
        funFact: 'Ikan badut dan anemon saling membantu! Anemon melindungi ikan badut dan ikan badut membersihkan anemon.',
        icon: '🐠',
        x: 48,
        y: 60,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'penyu-hijau',
        name: 'Penyu Hijau',
        localName: 'Penyu Laut',
        scientificName: 'Penyu Laut',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat I (Herbivora Pemakan Lamun dan Alga)',
        habitat: 'Laut lepas dan padang lamun',
        diet: 'Lamun laut dan alga hijau.',
        predators: ['Hiu macan'],
        energySource: 'Lamun dan alga',
        funFact: 'Penyu sering mengira kantong plastik adalah ubur-ubur, salah satu makanannya. Sampah plastik sangat berbahaya jika tertelan penyu!',
        icon: '🐢',
        x: 72,
        y: 42,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'ikan-hiu',
        name: 'Hiu Karang',
        localName: 'Hiu Penjaga Laut',
        scientificName: 'Hiu Karang',
        role: 'konsumen-3',
        trophicLevelName: 'Konsumen Puncak Laut',
        habitat: 'Perairan terumbu karang',
        diet: 'Ikan karang, termasuk ikan pemangsa seperti kerapu.',
        predators: ['Tidak ada pemangsa alami di karang'],
        energySource: 'Ikan laut',
        funFact: 'Hiu sering memangsa ikan yang sakit atau lemah sehingga penyakit tidak mudah menular ke ikan lain.',
        icon: '🦈',
        x: 84,
        y: 22,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'air-laut',
        name: 'Air Laut Asin',
        role: 'Tempat hidup hewan laut',
        effectOnEcosystem: 'Air laut yang hangat dan jernih membuat karang bisa tumbuh sehat.',
        icon: '🌊',
        x: 52,
        y: 18
      },
      {
        id: 'pasir-laut',
        name: 'Pasir Laut',
        role: 'Dasar laut',
        effectOnEcosystem: 'Pasir adalah benda mati (abiotik) tempat teripang dan kerang bersembunyi.',
        icon: '🏖️',
        x: 15,
        y: 24
      }
    ],
    hiddenItem: {
      id: 'kuda-laut',
      name: 'Kuda Laut Kecil',
      hint: 'Cari di antara cabang karang merah muda...',
      discoveryFact: 'Hebat! Kuda laut kecil pandai menyamar seperti cabang karang agar tidak dimangsa ikan lain.',
      xp: 50,
      x: 18,
      y: 72
    }
  },
  {
    id: 'sawah-kebun',
    roomNumber: 4,
    title: 'Sawah dan Kebun',
    theme: 'Ekosistem Sawah',
    tagline: 'Hamparan padi hijau yang ditanam petani untuk menghasilkan beras.',
    curriculumTopic: 'Rantai Makanan Sawah dan Pembasmi Hama Alami',
    bgImage: img_room_sawah_kebun,
    accentColor: '#D45014',
    ambientType: 'sawah',
    welcomeSpeech: 'Selamat datang di Sawah dan Kebun! Padi menghasilkan beras yang kita makan setiap hari. Di sini ada belalang, katak, ular, dan burung hantu.',
    guidingQuestion: 'Mengapa ular sawah dan burung hantu sangat membantu petani?',
    learningObjectives: [
      'Menyusun rantai makanan sawah: Padi → Belalang → Katak → Ular → Elang.',
      'Memahami ular sawah dan burung hantu sebagai pemangsa alami tikus perusak padi.',
      'Mengetahui peran cacing tanah dalam menggemburkan lumpur sawah.'
    ],
    organisms: [
      {
        id: 'tanaman-padi',
        name: 'Tanaman Padi',
        localName: 'Padi Beras',
        scientificName: 'Padi',
        role: 'produsen',
        trophicLevelName: 'Produsen (Pembuat Makanan)',
        habitat: 'Lumpur sawah basah',
        diet: 'Membuat makanan sendiri dari air dan udara (karbon dioksida) dengan bantuan sinar matahari, dibantu zat hara dari tanah.',
        predators: ['Belalang', 'Tikus'],
        energySource: 'Sinar Matahari',
        funFact: 'Satu batang padi bisa menghasilkan ratusan butir gabah yang digiling menjadi beras untuk nasi kita!',
        icon: '🌾',
        x: 16,
        y: 65,
        isBiotic: true,
        category: 'flora'
      },
      {
        id: 'belalang-hijau',
        name: 'Belalang Hijau',
        localName: 'Belalang Pemakan Daun',
        scientificName: 'Belalang',
        role: 'konsumen-1',
        trophicLevelName: 'Konsumen Tingkat I (Herbivora)',
        habitat: 'Batang dan daun padi',
        diet: 'Daun padi segar.',
        predators: ['Katak Sawah', 'Burung'],
        energySource: 'Daun padi',
        funFact: 'Warna hijau belalang membantunya menyamar agar tidak terlihat oleh katak pemangsa!',
        icon: '🦗',
        x: 26,
        y: 52,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'katak-sawah',
        name: 'Katak Sawah',
        localName: 'Katak Pemburu Hama',
        scientificName: 'Katak',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II (Karnivora Kecil)',
        habitat: 'Genangan air lumpur sawah',
        diet: 'Belalang dan serangga hama.',
        predators: ['Ular Sawah'],
        energySource: 'Serangga',
        funFact: 'Katak sawah memakan banyak belalang setiap hari sehingga daun padi tidak rusak.',
        icon: '🐸',
        x: 14,
        y: 72,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'ular-sawah',
        name: 'Ular Sawah',
        localName: 'Ular Pemburu Tikus',
        scientificName: 'Ular Sawah',
        role: 'konsumen-2',
        trophicLevelName: 'Konsumen Tingkat II atau III (Karnivora)',
        habitat: 'Pematang sawah dan lubang tanah',
        diet: 'Tikus sawah dan katak.',
        predators: ['Burung Elang'],
        energySource: 'Tikus dan katak',
        funFact: 'Ular sawah sangat berjasa memangsa tikus! Jika ular diburu habis, tikus akan merusak tanaman padi.',
        icon: '🐍',
        x: 82,
        y: 48,
        isBiotic: true,
        category: 'fauna'
      },
      {
        id: 'burung-elang',
        name: 'Burung Elang',
        localName: 'Elang Pemangsa Puncak',
        scientificName: 'Burung Elang',
        role: 'konsumen-3',
        trophicLevelName: 'Konsumen Puncak',
        habitat: 'Pohon tinggi dekat sawah',
        diet: 'Ular dan tikus.',
        predators: ['Tidak ada pemangsa alami'],
        energySource: 'Ular dan tikus',
        funFact: 'Burung elang punya mata tajam yang bisa melihat ular merayap dari langit yang tinggi!',
        icon: '🦅',
        x: 65,
        y: 25,
        isBiotic: true,
        category: 'fauna'
      }
    ],
    abioticFactors: [
      {
        id: 'air-irigasi',
        name: 'Air Parit Sawah',
        role: 'Mengairi tanaman padi',
        effectOnEcosystem: 'Aliran air yang cukup menjaga padi agar tidak layu.',
        icon: '💧',
        x: 54,
        y: 68
      },
      {
        id: 'lumpur-subur',
        name: 'Lumpur Tanah Sawah',
        role: 'Media tanam padi',
        effectOnEcosystem: 'Tanah lumpur adalah benda abiotik tempat cacing tanah hidup dan menggemburkan tanah.',
        icon: '🌾',
        x: 34,
        y: 80
      }
    ],
    hiddenItem: {
      id: 'cacing-tanah-sembunyi',
      name: 'Cacing Tanah',
      hint: 'Periksa lumpur basah di bawah rumpun padi...',
      discoveryFact: 'Pengamatan yang jeli! Cacing tanah menggali lorong di dalam lumpur sehingga akar padi mudah bernapas dan tanah jadi subur.',
      xp: 50,
      x: 29,
      y: 61
    }
  }
];

const LEGACY_BADGES: Badge[] = [
  {
    id: 'penjelajah-hutan',
    title: 'Sahabat Hutan',
    description: 'Menyelesaikan petualangan di ekosistem Hutan.',
    icon: '🌲',
    color: '#1E7A50'
  },
  {
    id: 'penjaga-sungai',
    title: 'Penjaga Sungai',
    description: 'Menemukan rahasia air bersih di Sungai.',
    icon: '💧',
    color: '#1C5FC4'
  },
  {
    id: 'sahabat-karang',
    title: 'Penyelamat Karang',
    description: 'Menjelajahi terumbu karang hidup di Laut.',
    icon: '🪸',
    color: '#0D7377'
  },
  {
    id: 'sahabat-tani',
    title: 'Sahabat Petani',
    description: 'Menjaga rantai makanan di Sawah dan Kebun.',
    icon: '🌾',
    color: '#D45014'
  },
  {
    id: 'ahli-rantai-makanan',
    title: 'Pakar Rantai Makanan',
    description: 'Berhasil menyusun urutan rantai makanan yang benar.',
    icon: '🔗',
    color: '#E68A00'
  },
  {
    id: 'detektif-ekosistem',
    title: 'Detektif Ekosistem Cilik',
    description: 'Menemukan hewan tersembunyi dan lulus evaluasi akhir.',
    icon: '🔍',
    color: '#6B21A8'
  }
];

export const PRETEST_QUESTIONS: QuizQuestion[] = [
  // 1. Biotik vs Abiotik (Memahami - C2)
  {
    id: 'pre-1',
    question: 'Di ekosistem hutan, manakah di bawah ini yang semuanya termasuk komponen hidup (BIOTIK)?',
    options: [
      'Pohon jati, rusa, dan jamur tiram',
      'Batu kerikil, tanah humus, dan air hujan',
      'Sinar matahari, angin sejuk, dan udara',
      'Air sungai, lumpur basah, dan pasir'
    ],
    correctIndex: 0,
    explanation: 'Komponen biotik adalah semua makhluk hidup seperti tumbuhan, hewan, dan jamur.',
    concept: 'Komponen Biotik'
  },
  // 2. Peran Faktor Abiotik (Menerapkan - C3)
  {
    id: 'pre-2',
    question: 'Tumbuhan hijau di hutan membutuhkan cahaya matahari dan air hujan untuk...',
    options: [
      'Membuat makanannya sendiri (fotosintesis)',
      'Tidur dan beristirahat di malam hari',
      'Menghangatkan tubuh pemangsa',
      'Mengurangi jumlah oksigen di udara'
    ],
    correctIndex: 0,
    explanation: 'Sinar matahari dan air (abiotik) sangat penting bagi produsen untuk membuat sari makanan.',
    concept: 'Peran Komponen Abiotik'
  },
  // 3. Produsen (Memahami - C2)
  {
    id: 'pre-3',
    question: 'Mengapa tumbuhan hijau disebut sebagai PRODUSEN dalam sebuah ekosistem?',
    options: [
      'Karena mampu menghasilkan makanan sendiri lewat fotosintesis',
      'Karena selalu memakan hewan-hewan kecil di tanah',
      'Karena membeli makanan dari makhluk hidup lain',
      'Karena bergerak aktif mencari mangsa setiap hari'
    ],
    correctIndex: 0,
    explanation: 'Produsen adalah makhluk hidup yang dapat membuat makanan sendiri (autotrof) tanpa memangsa makhluk lain.',
    concept: 'Produsen'
  },
  // 4. Herbivora (Memahami - C1)
  {
    id: 'pre-4',
    question: 'Rusa dan kelinci di hutan hanya memakan rumput dan dedaunan. Hewan ini tergolong...',
    options: [
      'Herbivora (pemakan tumbuhan)',
      'Karnivora (pemakan daging)',
      'Omnivora (pemakan segala)',
      'Dekomposer (pengurai)'
    ],
    correctIndex: 0,
    explanation: 'Hewan pemakan tumbuhan disebut herbivora, biasanya berperan sebagai konsumen tingkat I.',
    concept: 'Herbivora'
  },
  // 5. Karnivora (Memahami - C1)
  {
    id: 'pre-5',
    question: 'Harimau Sumatra memburu dan memakan daging rusa di hutan. Harimau tergolong hewan...',
    options: [
      'Karnivora (pemakan daging)',
      'Herbivora (pemakan tumbuhan)',
      'Produsen (penghasil makanan)',
      'Detritivor (pemakan sisa daun dan bangkai)'
    ],
    correctIndex: 0,
    explanation: 'Hewan yang makanan utamanya adalah daging hewan lain disebut karnivora.',
    concept: 'Karnivora'
  },
  // 6. Omnivora (Memahami - C2)
  {
    id: 'pre-6',
    question: 'Hewan yang dapat memakan tumbuhan sekaligus memakan hewan lain (pemakan segala) disebut...',
    options: [
      'Omnivora (seperti monyet dan ayam)',
      'Herbivora murni',
      'Karnivora murni',
      'Bakteri tanah'
    ],
    correctIndex: 0,
    explanation: 'Omnivora adalah makhluk pemakan segala, bisa makan buah/biji maupun serangga/daging.',
    concept: 'Omnivora'
  },
  // 7. Pengurai Dekomposer (Memahami - C2)
  {
    id: 'pre-7',
    question: 'Apakah tugas utama jamur dan bakteri pengurai di lantai hutan?',
    options: [
      'Menguraikan daun kering dan bangkai menjadi zat hara tanah',
      'Memangsa hewan-hewan liar di hutan',
      'Menghalangi air hujan meresap ke dalam tanah',
      'Membuat pohon menjadi cepat tumbang'
    ],
    correctIndex: 0,
    explanation: 'Pengurai (jamur dan bakteri) menguraikan zat organik mati menjadi unsur hara yang menyuburkan tanah kembali.',
    concept: 'Pengurai (Dekomposer)'
  },
  // 8. Detritivor (Menerapkan - C3)
  {
    id: 'pre-8',
    question: 'Cacing tanah memakan dan menghancurkan sampah daun gugur di tanah. Peran cacing tanah adalah...',
    options: [
      'Detritivor (hewan pemakan dan penghancur sisa makhluk hidup)',
      'Produsen utama pembuat energi',
      'Konsumen puncak pemangsa elang',
      'Benda abiotik tak hidup'
    ],
    correctIndex: 0,
    explanation: 'Cacing tanah, rayap, dan kaki seribu adalah detritivor yang menghancurkan sampah daun menjadi potongan kecil sebelum diuraikan oleh bakteri dan jamur.',
    concept: 'Detritivor'
  },
  // 9. Rantai Makanan & Arah Panah (Memahami - C2)
  {
    id: 'pre-9',
    question: 'Pada rantai makanan: Padi → Tikus → Ular. Tanda panah (→) memiliki arti...',
    options: [
      'Dimakan oleh (energi berpindah ke pemakan)',
      'Menyerang tanpa memakan',
      'Sama kuat dan bersahabat',
      'Berasal dari jenis yang sama'
    ],
    correctIndex: 0,
    explanation: 'Arah panah selalu menunjuk dari makhluk hidup yang dimakan menuju pemakannya sebagai jalur aliran energi.',
    concept: 'Aliran Energi Rantai Makanan'
  },
  // 10. Urutan Rantai Makanan (Menerapkan - C3)
  {
    id: 'pre-10',
    question: 'Manakah urutan rantai makanan yang tepat dan logis di ekosistem hutan?',
    options: [
      'Rumput hijau → Rusa → Harimau → Jamur pengurai',
      'Harimau → Rusa → Rumput hijau → Jamur',
      'Rumput hijau → Harimau → Rusa → Jamur',
      'Jamur pengurai → Rusa → Harimau → Rumput'
    ],
    correctIndex: 0,
    explanation: 'Rantai makanan selalu diawali oleh produsen (rumput hijau), lalu herbivora (rusa), karnivora (harimau), dan pengurai.',
    concept: 'Urutan Rantai Makanan'
  },
  // 11. Jaring-Jaring Makanan (Menerapkan - C3)
  {
    id: 'pre-11',
    question: 'Kumpulan dari beberapa rantai makanan yang saling berhubungan di alam disebut...',
    options: [
      'Jaring-jaring makanan',
      'Siklus air hujan',
      'Daftar belanjaan hutan',
      'Kandang hewan bersama'
    ],
    correctIndex: 0,
    explanation: 'Di alam nyata, rantai makanan saling terhubung menjadi jaring-jaring makanan yang rumit dan seimbang.',
    concept: 'Jaring-Jaring Makanan'
  },
  // 12. Keseimbangan Terganggu (Menalar - C4 HOTS)
  {
    id: 'pre-12',
    question: 'Jika ular di sawah diburu habis oleh manusia, apa dampak buruk yang akan terjadi?',
    options: [
      'Jumlah tikus meningkat pesat dan memakan habis tanaman padi petani',
      'Tanaman padi akan berbuah dua kali lebih lebat',
      'Jumlah elang bertambah banyak karena senang',
      'Tanah sawah langsung menjadi kering kerontang'
    ],
    correctIndex: 0,
    explanation: 'Ular adalah pemangsa alami tikus. Tanpa ular, tikus berkembang biak tanpa terkendali dan merusak panen padi.',
    concept: 'Dampak Hilangnya Makhluk Hidup'
  },
  // 13. Kerusakan Ekosistem Air (Menalar - C4 HOTS)
  {
    id: 'pre-13',
    question: 'Di sungai, jika lumut dan tumbuhan air mati karena limbah pabrik, nasib ikan pemakan lumut adalah...',
    options: [
      'Kelaparan dan populasinya akan menurun drastis',
      'Berubah menjadi pemakan batu kali',
      'Langsung bisa terbang ke daratan',
      'Populasinya semakin banyak dan gemuk'
    ],
    correctIndex: 0,
    explanation: 'Jika produsen mati, konsumen tingkat I kehilangan sumber energi utama dan populasinya akan turun drastis.',
    concept: 'Keseimbangan Ekosistem Air'
  },
  // 14. Simbiosis Mutualisme (Menerapkan - C3)
  {
    id: 'pre-14',
    question: 'Burung jalak hinggap dan memakan kutu di punggung kerbau. Hubungan saling menguntungkan ini disebut...',
    options: [
      'Simbiosis mutualisme',
      'Simbiosis parasitisme',
      'Simbiosis komensalisme',
      'Rantai pemangsa'
    ],
    correctIndex: 0,
    explanation: 'Simbiosis mutualisme adalah hubungan dua makhluk hidup yang saling menguntungkan satu sama lain.',
    concept: 'Simbiosis Mutualisme'
  },
  // 15. Simbiosis Komensalisme (Menerapkan - C3)
  {
    id: 'pre-15',
    question: 'Tanaman anggrek menempel di batang pohon mangga untuk mendapat cahaya tanpa merugikan inangnya. Ini disebut...',
    options: [
      'Simbiosis komensalisme',
      'Simbiosis parasitisme',
      'Simbiosis mutualisme',
      'Pemangsaan liar'
    ],
    correctIndex: 0,
    explanation: 'Komensalisme adalah hubungan satu pihak untung (anggrek dapat tempat tinggi) dan pihak lain tidak dirugikan.',
    concept: 'Simbiosis Komensalisme'
  },
  // 16. Simbiosis Parasitisme (Menerapkan - C3)
  {
    id: 'pre-16',
    question: 'Tanaman benalu menyerap air dan zat hara dari pohon inangnya hingga pohon itu layu. Hubungan ini disebut...',
    options: [
      'Simbiosis parasitisme',
      'Simbiosis mutualisme',
      'Simbiosis komensalisme',
      'Persahabatan alami'
    ],
    correctIndex: 0,
    explanation: 'Parasitisme terjadi jika satu pihak untung sementara pihak yang ditumpangi (inang) dirugikan atau sakit.',
    concept: 'Simbiosis Parasitisme'
  },
  // 17. Ekosistem Alami vs Buatan (Memahami - C2)
  {
    id: 'pre-17',
    question: 'Manakah di bawah ini yang merupakan contoh ekosistem BUATAN manusia?',
    options: [
      'Sawah berundak dan kolam ikan',
      'Hutan rimba perawan',
      'Samudra laut dalam',
      'Sungai alami berarus deras'
    ],
    correctIndex: 0,
    explanation: 'Sawah, kebun, kolam ikan, dan akuarium adalah contoh ekosistem buatan yang sengaja dirancang oleh manusia.',
    concept: 'Ekosistem Buatan'
  },
  // 18. Bahaya Sampah Plastik (Menalar - C4 HOTS)
  {
    id: 'pre-18',
    question: 'Mengapa kantong plastik yang hanyut ke laut sangat membahayakan penyu laut?',
    options: [
      'Penyu mengira plastik itu ubur-ubur lalu memakannya hingga pencernaannya terluka',
      'Plastik langsung mengubah air laut menjadi air tawar',
      'Plastik menyerap seluruh sinar matahari di laut',
      'Penyu akan membelah plastik menjadi perahu'
    ],
    correctIndex: 0,
    explanation: 'Banyak penyu memakan ubur-ubur di laut. Kantong plastik yang melayang di air mirip sekali dengan ubur-ubur.',
    concept: 'Bahaya Sampah Plastik'
  },
  // 19. Dampak Pestisida Kimia (Menalar - C4 HOTS)
  {
    id: 'pre-19',
    question: 'Jika petani menyemprotkan racun pestisida kimia secara berlebihan setiap hari, akibat buruknya adalah...',
    options: [
      'Membunuh serangga bermanfaat, seperti penyerbuk dan pemangsa hama, serta meracuni air tanah',
      'Padi langsung matang dalam waktu satu jam',
      'Tanah sawah menjadi semakin harum dan subur',
      'Burung elang akan semakin menyukai sawah'
    ],
    correctIndex: 0,
    explanation: 'Pestisida berlebihan merusak tanah, mencemari air parit, dan membunuh serangga penyerbuk yang bermanfaat.',
    concept: 'Pengaruh Pestisida'
  },
  // 20. Menjaga Keseimbangan Ekosistem (Menerapkan - C3)
  {
    id: 'pre-20',
    question: 'Tindakan sederhana yang bisa kita lakukan di sekolah untuk menjaga kelestarian lingkungan hidup adalah...',
    options: [
      'Membuang sampah ke tempatnya dan merawat tanaman di kebun sekolah',
      'Memetik bunga dan mematahkan dahan pohon sembarangan',
      'Membuang bungkus plastik makanan ke dalam selokan air',
      'Menangkap burung liar di pohon sekolah untuk dikurung'
    ],
    correctIndex: 0,
    explanation: 'Menjaga kebersihan dan merawat tumbuhan hijau adalah langkah nyata anak sekolah merawat harmoni ekosistem.',
    concept: 'Pelestarian Lingkungan'
  }
];

export const POSTTEST_QUESTIONS: QuizQuestion[] = [
  // 1. Biotik vs Abiotik (Memahami - C2)
  {
    id: 'post-1',
    question: 'Di ekosistem sungai, manakah di bawah ini yang seluruhnya merupakan komponen BIOTIK (makhluk hidup)?',
    options: [
      'Ikan wader, kangkung air, dan anak capung',
      'Batu kerikil kali, pasir sungai, dan air jernih',
      'Sinar matahari, suhu air, dan udara dingin',
      'Arus air, lumpur dasar kali, dan kerikil'
    ],
    correctIndex: 0,
    explanation: 'Komponen biotik sungai terdiri dari hewan air, tanaman air, dan serangga hidup.',
    concept: 'Komponen Biotik'
  },
  // 2. Peran Faktor Abiotik (Menerapkan - C3)
  {
    id: 'post-2',
    question: 'Di sawah, air parit irigasi dan lumpur tanah yang kaya hara sangat dibutuhkan oleh padi untuk...',
    options: [
      'Tumbuh subur dan menghasilkan butir gabah padi',
      'Bersembunyi dari pemburu burung liar',
      'Menghentikan proses fotosintesis',
      'Membuat air parit menjadi kering'
    ],
    correctIndex: 0,
    explanation: 'Air dan tanah lumpur (faktor abiotik) menyediakan hara dan cairan bagi tanaman padi agar berbuah lebat.',
    concept: 'Peran Komponen Abiotik'
  },
  // 3. Produsen (Memahami - C2)
  {
    id: 'post-3',
    question: 'Di lautan yang luas, fitoplankton (alga mikroskopis hijau) berperan sebagai produsen karena...',
    options: [
      'Mampu berfotosintesis menghasilkan makanan dari sinar matahari',
      'Memangsa ikan paus dan hiu yang sedang berenang',
      'Menyerap semua oksigen di lautan hingga habis',
      'Terbentuk dari sampah plastik yang terurai'
    ],
    correctIndex: 0,
    explanation: 'Fitoplankton adalah alga renik (sangat kecil) di laut yang berfotosintesis dan menjadi dasar rantai makanan laut.',
    concept: 'Produsen'
  },
  // 4. Herbivora (Memahami - C1)
  {
    id: 'post-4',
    question: 'Belalang hijau di sawah memakan daun padi muda setiap hari. Belalang hijau tergolong...',
    options: [
      'Herbivora (hewan pemakan tumbuhan)',
      'Karnivora (hewan pemakan daging)',
      'Pengurai (dekomposer tanah)',
      'Konsumen puncak pemangsa ular'
    ],
    correctIndex: 0,
    explanation: 'Hewan pemakan daun seperti belalang disebut herbivora dan berperan sebagai konsumen tingkat I.',
    concept: 'Herbivora'
  },
  // 5. Karnivora (Memahami - C1)
  {
    id: 'post-5',
    question: 'Burung elang menyambar dan memakan ular sawah serta tikus. Burung elang tergolong hewan...',
    options: [
      'Karnivora (pemakan daging)',
      'Herbivora (pemakan daun padi)',
      'Produsen mandiri',
      'Komponen abiotik tak hidup'
    ],
    correctIndex: 0,
    explanation: 'Burung elang adalah karnivora pemangsa daging dan sering menjadi konsumen puncak di alam.',
    concept: 'Karnivora'
  },
  // 6. Omnivora (Memahami - C2)
  {
    id: 'post-6',
    question: 'Ikan lele di kolam memakan lumut air, pelet dedak, dan cacing kecil. Ikan lele tergolong hewan...',
    options: [
      'Omnivora (pemakan tumbuhan dan hewan lain)',
      'Herbivora murni',
      'Karnivora murni',
      'Produsen utama'
    ],
    correctIndex: 0,
    explanation: 'Hewan pemakan serangga/cacing sekaligus pemakan tumbuhan/lumut adalah hewan omnivora.',
    concept: 'Omnivora'
  },
  // 7. Pengurai Dekomposer (Memahami - C2)
  {
    id: 'post-7',
    question: 'Ketika sebatang pohon tumbang dan mati di hutan, jamur kayu akan bertugas untuk...',
    options: [
      'Melapukkan dan menguraikan kayu menjadi zat hara penyubur tanah',
      'Membakar kayu itu menjadi abu panas',
      'Memindahkan batang pohon ke luar hutan',
      'Mengubah kayu itu menjadi batu karang'
    ],
    correctIndex: 0,
    explanation: 'Jamur dekomposer melepaskan enzim yang melunakkan dan mendaur ulang kayu lapuk menjadi unsur hara.',
    concept: 'Pengurai (Dekomposer)'
  },
  // 8. Detritivor (Menerapkan - C3)
  {
    id: 'post-8',
    question: 'Hewan kecil seperti kaki seribu dan rayap yang mencacah batang kayu lapuk di kebun tergolong...',
    options: [
      'Detritivor (hewan pemakan dan pencacah sisa makhluk hidup)',
      'Produsen pembuat gula',
      'Karnivora pemangsa elang',
      'Bakteri bersel satu'
    ],
    correctIndex: 0,
    explanation: 'Rayap dan kaki seribu mencacah serasah kayu lapuk menjadi serpihan kecil sehingga disebut detritivor.',
    concept: 'Detritivor'
  },
  // 9. Rantai Makanan & Arah Panah (Memahami - C2)
  {
    id: 'post-9',
    question: 'Pada rantai makanan laut: Alga → Ikan Kecil → Ikan Tuna → Ikan Hiu. Arah panah (→) menunjukkan...',
    options: [
      'Arah aliran perpindahan energi dari yang dimakan ke pemakan',
      'Arah hewan melarikan diri',
      'Nama jenis hewan yang lebih besar',
      'Bermusuhan di dalam air'
    ],
    correctIndex: 0,
    explanation: 'Tanda panah menggambarkan bahwa energi mengalir dari mangsa menuju ke tubuh hewan yang memakannya.',
    concept: 'Aliran Energi Rantai Makanan'
  },
  // 10. Urutan Rantai Makanan (Menerapkan - C3)
  {
    id: 'post-10',
    question: 'Manakah urutan rantai makanan yang benar di ekosistem laut?',
    options: [
      'Fitoplankton → Udang kecil → Ikan tongkol → Ikan hiu',
      'Ikan hiu → Ikan tongkol → Udang kecil → Fitoplankton',
      'Fitoplankton → Ikan hiu → Ikan tongkol → Udang kecil',
      'Udang kecil → Fitoplankton → Ikan hiu → Ikan tongkol'
    ],
    correctIndex: 0,
    explanation: 'Dimulai dari produsen (fitoplankton), lalu konsumen tingkat I (udang kecil), konsumen tingkat II (ikan tongkol), dan konsumen puncak (hiu).',
    concept: 'Urutan Rantai Makanan'
  },
  // 11. Jaring-Jaring Makanan (Menerapkan - C3)
  {
    id: 'post-11',
    question: 'Mengapa jaring-jaring makanan membuat sebuah ekosistem lebih kuat dan stabil dibanding rantai makanan tunggal?',
    options: [
      'Karena hewan pemangsa memiliki beberapa pilihan jenis makanan lain',
      'Karena hewan tidak perlu makan lagi sama sekali',
      'Karena tumbuhan bisa berjalan sendiri menghindari pemangsa',
      'Karena jumlah matahari menjadi bertambah banyak'
    ],
    correctIndex: 0,
    explanation: 'Dalam jaring-jaring makanan, jika satu jenis mangsa berkurang, predator masih bisa memakan hewan alternatif lain.',
    concept: 'Jaring-Jaring Makanan'
  },
  // 12. Keseimbangan Terganggu (Menalar - C4 HOTS)
  {
    id: 'post-12',
    question: 'Jika burung hantu di kebun kelapa sawit ditembaki dan diburu habis, apa yang akan terjadi?',
    options: [
      'Hama tikus kebun membeludak dan merusak buah kelapa sawit',
      'Buah sawit tumbuh dua kali lebih besar dan manis',
      'Pohon kelapa sawit menjadi tahan terhadap hama',
      'Ular sawah akan ikut punah seketika'
    ],
    correctIndex: 0,
    explanation: 'Burung hantu adalah predator utama tikus di malam hari. Tanpa burung hantu, tikus merajalela merusak hasil panen.',
    concept: 'Dampak Hilangnya Makhluk Hidup'
  },
  // 13. Kerusakan Ekosistem Air (Menalar - C4 HOTS)
  {
    id: 'post-13',
    question: 'Jika air laut memanas sehingga terumbu karang memutih dan mati, apa akibat buruk bagi ikan-ikan karang kecil?',
    options: [
      'Kehilangan tempat berlindung dan persediaan makanan sehingga banyak yang mati',
      'Ikan karang langsung belajar hidup di darat',
      'Ikan karang akan memakan pasir laut sampai kenyang',
      'Ikan karang menjadi sangat besar seperti ikan paus'
    ],
    correctIndex: 0,
    explanation: 'Terumbu karang adalah rumah dan tempat mencari makan bagi ikan karang. Jika karang mati, ikan kehilangan rumah.',
    concept: 'Keseimbangan Ekosistem Air'
  },
  // 14. Simbiosis Mutualisme (Menerapkan - C3)
  {
    id: 'post-14',
    question: 'Ikan badut tinggal di antara tentakel anemon laut. Anemon melindungi ikan dan ikan membersihkan anemon. Ini adalah contoh...',
    options: [
      'Simbiosis mutualisme (kedua pihak saling untung)',
      'Simbiosis parasitisme (satu pihak rugi)',
      'Simbiosis komensalisme biasa',
      'Persaingan memperebutkan wilayah'
    ],
    correctIndex: 0,
    explanation: 'Hubungan ikan badut dan anemon laut saling menguntungkan sehingga merupakan simbiosis mutualisme.',
    concept: 'Simbiosis Mutualisme'
  },
  // 15. Simbiosis Komensalisme (Menerapkan - C3)
  {
    id: 'post-15',
    question: 'Ikan remora berenang di dekat ikan hiu untuk memakan remah makanan tanpa mengganggu hiu. Hubungan ini disebut...',
    options: [
      'Simbiosis komensalisme (satu untung, satu tidak dirugikan)',
      'Simbiosis mutualisme (keduanya untung)',
      'Simbiosis parasitisme (hiu dirugikan)',
      'Pemangsaan ikan hiu'
    ],
    correctIndex: 0,
    explanation: 'Ikan remora untung mendapat sisa makanan, sedangkan hiu tidak merasa terganggu atau dirugikan sama sekali.',
    concept: 'Simbiosis Komensalisme'
  },
  // 16. Simbiosis Parasitisme (Menerapkan - C3)
  {
    id: 'post-16',
    question: 'Kutu yang mengisap darah kucing hingga kucing gatal dan kurus tergolong hubungan...',
    options: [
      'Simbiosis parasitisme (kutu untung, kucing dirugikan)',
      'Simbiosis mutualisme (keduanya senang)',
      'Simbiosis komensalisme (kucing tidak apa-apa)',
      'Perkembangbiakan alami kucing'
    ],
    correctIndex: 0,
    explanation: 'Kutu mengisap darah inangnya dan menyebabkan gatal, luka, atau penyakit sehingga disebut parasit.',
    concept: 'Simbiosis Parasitisme'
  },
  // 17. Ekosistem Alami vs Buatan (Memahami - C2)
  {
    id: 'post-17',
    question: 'Manakah di bawah ini yang merupakan contoh ekosistem ALAMI yang terbentuk tanpa campur tangan manusia?',
    options: [
      'Hutan hujan tropis dan laut terumbu karang',
      'Kolam ikan lele di pekarangan rumah',
      'Sawah padi berpetak-petak',
      'Kebun sayur hidroponik'
    ],
    correctIndex: 0,
    explanation: 'Hutan alami dan laut lepas terbentuk secara alami, bukan buatan manusia.',
    concept: 'Ekosistem Alami'
  },
  // 18. Bahaya Sampah Plastik (Menalar - C4 HOTS)
  {
    id: 'post-18',
    question: 'Mengapa jaring nelayan bekas dan tali plastik yang tertinggal di laut sangat berbahaya bagi lumba-lumba?',
    options: [
      'Sirip lumba-lumba bisa terjerat sehingga tidak bisa berenang ke permukaan untuk bernapas',
      'Jaring plastik membuat air laut berubah menjadi air es beku',
      'Jaring plastik memancarkan suara bising di dalam air',
      'Lumba-lumba menggunakan jaring untuk membuat sarang'
    ],
    correctIndex: 0,
    explanation: 'Lumba-lumba adalah mamalia air yang butuh bernapas di permukaan. Jeratan jaring plastik membuatnya tenggelam.',
    concept: 'Bahaya Sampah Plastik'
  },
  // 19. Dampak Pestisida Kimia (Menalar - C4 HOTS)
  {
    id: 'post-19',
    question: 'Cara paling ramah lingkungan bagi petani untuk mengendalikan hama tikus tanpa merusak tanah dan air adalah...',
    options: [
      'Memasang rumah burung hantu (rubuha) di tengah sawah',
      'Membakar seluruh jerami padi dan menebang semua pohon',
      'Menyemprotkan racun kimia mematikan lima kali sehari',
      'Menutup seluruh parit sawah dengan aspal jalan'
    ],
    correctIndex: 0,
    explanation: 'Burung hantu dan ular sawah adalah musuh alami tikus yang mengendalikan hama tanpa mencemari tanah dan air.',
    concept: 'Pengendalian Hama Alami'
  },
  // 20. Menjaga Keseimbangan Ekosistem (Menerapkan - C3)
  {
    id: 'post-20',
    question: 'Aksi nyata yang bisa kita lakukan di rumah untuk mencegah pencemaran ekosistem sungai adalah...',
    options: [
      'Tidak membuang minyak goreng bekas dan sampah plastik ke selokan',
      'Membuang sisa detergen cucian sebanyak-banyaknya ke kali',
      'Menimbun sampah dapur di pinggir aliran sungai',
      'Menangkap semua anak ikan di sungai untuk hiasan'
    ],
    correctIndex: 0,
    explanation: 'Menjaga selokan rumah tetap bersih dari minyak dan sampah plastik akan mencegah racun mencemari sungai.',
    concept: 'Pelestarian Lingkungan'
  }
];

export const ROOM_QUIZZES: Record<string, QuizQuestion[]> = {
  'hutan': [
    {
      id: 'hh-1',
      question: 'Makhluk hidup di hutan yang bertugas membuat makanan sendiri adalah...',
      options: ['Pohon meranti rimbun', 'Rusa', 'Harimau', 'Batu'],
      correctIndex: 0,
      explanation: 'Pohon rimbun adalah produsen yang membuat makanan sendiri dengan bantuan sinar matahari.',
      concept: 'Produsen Hutan'
    },
    {
      id: 'hh-2',
      question: 'Rusa memakan daun pohon, lalu rusa dimakan harimau. Siapakah yang menjadi herbivora?',
      options: ['Rusa', 'Harimau', 'Pohon', 'Jamur'],
      correctIndex: 0,
      explanation: 'Rusa adalah herbivora karena memakan tumbuhan hijau.',
      concept: 'Herbivora'
    },
    {
      id: 'hh-3',
      question: 'Apa yang terjadi pada daun gugur dan ranting patah di lantai hutan?',
      options: [
        'Diuraikan oleh jamur dan bakteri menjadi tanah humus yang subur',
        'Menjadi batu keras selamanya',
        'Langsung menghilang terbawa angin ke luar angkasa',
        'Dimakan oleh harimau'
      ],
      correctIndex: 0,
      explanation: 'Jamur dan bakteri bertugas menguraikan daun gugur menjadi tanah humus yang subur.',
      concept: 'Pengurai Hutan'
    }
  ],
  'hutan-harmoni': [
    {
      id: 'hh-1',
      question: 'Makhluk hidup di hutan yang bertugas membuat makanan sendiri adalah...',
      options: ['Pohon rimbun', 'Rusa', 'Harimau', 'Batu'],
      correctIndex: 0,
      explanation: 'Pohon rimbun adalah produsen yang membuat makanan sendiri dengan sinar matahari.',
      concept: 'Produsen Hutan'
    },
    {
      id: 'hh-2',
      question: 'Rusa memakan daun pohon, lalu rusa dimakan harimau. Siapakah yang menjadi herbivora?',
      options: ['Rusa', 'Harimau', 'Pohon', 'Jamur'],
      correctIndex: 0,
      explanation: 'Rusa adalah herbivora karena memakan tumbuhan hijau.',
      concept: 'Herbivora'
    }
  ],
  'padang-rumput': [
    {
      id: 'pr-1',
      question: 'Di padang rumput sabana Baluran, Jawa Timur, siapakah yang berperan sebagai produsen utama?',
      options: ['Rumput gajah dan ilalang', 'Banteng', 'Ular weling', 'Burung elang'],
      correctIndex: 0,
      explanation: 'Rumput adalah produsen yang menangkap sinar matahari dan menyediakan energi bagi seluruh herbivora.',
      concept: 'Produsen Sabana'
    },
    {
      id: 'pr-2',
      question: 'Pada rantai makanan: Rumput → Belalang → Katak → Ular → Elang, ular berperan sebagai...',
      options: [
        'Konsumen tingkat III (karnivora pemakan katak)',
        'Produsen pembuat makanan',
        'Pengurai serasah',
        'Hewan pemakan rumput'
      ],
      correctIndex: 0,
      explanation: 'Belalang adalah konsumen tingkat I dan katak konsumen tingkat II. Ular memangsa katak sehingga menjadi konsumen tingkat III, lalu ular dimangsa elang.',
      concept: 'Rantai Makanan Sabana'
    }
  ],
  'sungai-danau': [
    {
      id: 'sb-1',
      question: 'Ikan wader kecil di sungai mendapatkan makanan dari...',
      options: ['Lumut air dan jentik nyamuk', 'Batu sungai', 'Bangkai harimau', 'Air saja'],
      correctIndex: 0,
      explanation: 'Ikan wader makan lumut air dan serangga air kecil.',
      concept: 'Makanan Ikan'
    },
    {
      id: 'sb-2',
      question: 'Jika banyak capung jarum terbang dan bertelur di tepi sungai, itu membuktikan bahwa...',
      options: [
        'Air sungai masih jernih, bersih, dan bebas racun detergen',
        'Air sungai mengandung banyak racun sabun',
        'Sungai sudah tidak ada ikannya lagi',
        'Air sungai sangat keruh dan kotor'
      ],
      correctIndex: 0,
      explanation: 'Anak capung (nimfa) tumbuh baik di air yang bersih dan kaya oksigen, jadi banyak capung menandakan sungai yang sehat.',
      concept: 'Bioindikator Air'
    }
  ],
  'sungai-bersih': [
    {
      id: 'sb-1',
      question: 'Ikan wader kecil di sungai mendapatkan makanan dari...',
      options: ['Lumut air dan jentik nyamuk', 'Batu sungai', 'Bangkai harimau', 'Air saja'],
      correctIndex: 0,
      explanation: 'Ikan wader makan lumut air dan serangga air kecil.',
      concept: 'Makanan Ikan'
    }
  ],
  'laut': [
    {
      id: 'lk-1',
      question: 'Ikan badut dan anemon laut saling membantu. Hubungan ini disebut...',
      options: [
        'Simbiosis mutualisme (saling menguntungkan)',
        'Simbiosis merugikan (parasitisme)',
        'Rantai makanan pemangsa',
        'Pencemaran laut'
      ],
      correctIndex: 0,
      explanation: 'Anemon melindungi ikan badut dari pemangsa dan ikan badut membersihkan anemon. Keduanya saling untung!',
      concept: 'Simbiosis'
    },
    {
      id: 'lk-2',
      question: 'Terumbu karang yang hidup berwarna-warni di laut termasuk komponen...',
      options: [
        'Biotik (hewan karang laut hidup)',
        'Abiotik (benda mati)',
        'Sampah plastik',
        'Logam buatan'
      ],
      correctIndex: 0,
      explanation: 'Karang yang hidup adalah kumpulan hewan laut mungil (komponen biotik).',
      concept: 'Biotik Laut'
    }
  ],
  'laut-karang': [
    {
      id: 'lk-1',
      question: 'Ikan badut dan anemon laut saling membantu. Ini disebut hubungan...',
      options: [
        'Simbiosis mutualisme (saling menguntungkan)',
        'Simbiosis merugikan',
        'Rantai makanan pemangsa',
        'Musuh bebuyutan'
      ],
      correctIndex: 0,
      explanation: 'Keduanya saling menguntungkan di dasar laut.',
      concept: 'Simbiosis'
    }
  ],
  'rantai-makanan': [
    {
      id: 'rm-1',
      question: 'Pada rantai makanan Padi → Tikus → Ular → Elang, tanda panah (→) memiliki arti...',
      options: [
        'Dimakan oleh, dan energinya berpindah ke pemakan',
        'Memburu bersama-sama',
        'Tidur di sarang yang sama',
        'Hewan yang lebih kecil ukurannya'
      ],
      correctIndex: 0,
      explanation: 'Tanda panah menunjukkan arah perpindahan energi makanan ke tubuh pemakannya.',
      concept: 'Arah Panah Rantai Makanan'
    },
    {
      id: 'rm-2',
      question: 'Jika dalam rantai makanan tersebut ular diburu habis oleh manusia, apa yang akan terjadi?',
      options: [
        'Populasi tikus akan meledak dan memakan habis tanaman padi',
        'Tanaman padi akan semakin subur dan banyak',
        'Burung elang akan menjadi pemakan padi',
        'Semua tikus akan mati kelaparan'
      ],
      correctIndex: 0,
      explanation: 'Tanpa adanya ular sebagai predator alami, populasi tikus sawah akan meledak tanpa terkendali.',
      concept: 'Dinamika Rantai Makanan'
    }
  ],
  'keseimbangan-ekosistem': [
    {
      id: 'ke-1',
      question: 'Suatu ekosistem dikatakan SEIMBANG (harmonis) jika...',
      options: [
        'Jumlah produsen cukup untuk herbivora dan jumlah hewan dijaga tetap stabil oleh pemangsa',
        'Semua hewan karnivora mati diburu manusia',
        'Hanya ada satu jenis hewan di seluruh hutan',
        'Tumbuhan habis dimakan oleh kawanan hama'
      ],
      correctIndex: 0,
      explanation: 'Pada ekosistem seimbang, energi mengalir dengan lancar di setiap tingkat rantai makanan dan jumlah tiap makhluk hidup tetap terjaga.',
      concept: 'Keseimbangan Ekosistem'
    }
  ],
  'ekosistem-buatan': [
    {
      id: 'eb-1',
      question: 'Manakah contoh di bawah ini yang merupakan ekosistem buatan manusia?',
      options: ['Sawah padi, tambak ikan, dan kebun sayur', 'Hutan hujan primer dan laut dalam', 'Kutub es utara', 'Palung samudra'],
      correctIndex: 0,
      explanation: 'Sawah, kolam, dan kebun dibuat dan dirawat oleh manusia untuk kebutuhan pangan.',
      concept: 'Ekosistem Buatan'
    },
    {
      id: 'eb-2',
      question: 'Mengapa burung hantu Tyto alba sangat dijaga oleh petani di sawah?',
      options: [
        'Karena burung hantu adalah pemburu alami tikus perusak padi',
        'Karena burung hantu memakan bulir padi petani',
        'Karena burung hantu membuat padi berbuah emas',
        'Karena burung hantu meminum air parit'
      ],
      correctIndex: 0,
      explanation: 'Burung hantu adalah sahabat petani yang memangsa tikus pada malam hari tanpa racun kimia.',
      concept: 'Musuh Alami Hama'
    }
  ],
  'sawah-kebun': [
    {
      id: 'sk-1',
      question: 'Di sawah, hewan yang sangat membantu petani memangsa tikus perusak padi adalah...',
      options: ['Ular sawah dan burung hantu', 'Belalang hijau', 'Katak kecil', 'Ikan mujair'],
      correctIndex: 0,
      explanation: 'Ular sawah dan burung hantu adalah pemburu tikus alami yang menjaga panen padi.',
      concept: 'Sahabat Petani'
    }
  ],
  'pelestarian-lingkungan': [
    {
      id: 'pl-1',
      question: 'Sampah sisa sayuran, kulit buah, dan daun gugur harus dimasukkan ke tempat sampah...',
      options: ['Organik (hijau)', 'Anorganik seperti botol plastik (kuning)', 'Limbah beracun B3 (merah)', 'Dibuang ke sungai'],
      correctIndex: 0,
      explanation: 'Sampah organik dapat membusuk secara alami dan diolah menjadi pupuk kompos penyubur tanaman.',
      concept: 'Pemilahan Sampah'
    },
    {
      id: 'pl-2',
      question: 'Aksi penghijauan (reboisasi) dengan menanam bibit pohon bermanfaat untuk...',
      options: [
        'Mencegah erosi tanah, menyerap air hujan, dan menghasilkan oksigen segar',
        'Membuat tanah menjadi tandus dan kering',
        'Menghabiskan persediaan air di bumi',
        'Menghalangi angin bertiup'
      ],
      correctIndex: 0,
      explanation: 'Pohon mengikat tanah dengan akarnya dan menghasilkan oksigen yang dihirup makhluk hidup.',
      concept: 'Penghijauan'
    }
  ]
};
