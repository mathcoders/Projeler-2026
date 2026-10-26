// src/constants/examEngines.js

export const EXAM_ENGINES = {
  LGS: {
    code: 'LGS',
    label: 'Ortaokul (5-6-7-8 & LGS)',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    wrongRatio: 3, // 3 Yanlış 1 Doğruyu götürür
    subjects: [
      { id: 'lgs_tr', group: 'LGS', name: 'LGS Türkçe', count: 20, topics: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragraf', 'Sözel Mantık', 'Fiilimsiler', 'Cümlenin Öğeleri', 'Cümle Türleri', 'Yazım ve Noktalama', 'Anlatım Bozuklukları'] },
      { id: 'lgs_mat', group: 'LGS', name: 'LGS Matematik', count: 20, topics: ['Çarpanlar ve Katlar', 'Üslü İfadeler', 'Kareköklü İfadeler', 'Veri Analizi', 'Basit Olasılık', 'Cebirsel İfadeler', 'Doğrusal Denklemler', 'Eşitsizlikler', 'Üçgenler', 'Dönüşüm Geometrisi', 'Geometrik Cisimler'] },
      { id: 'lgs_fen', group: 'LGS', name: 'LGS Fen Bilimleri', count: 20, topics: ['Mevsimler ve İklim', 'DNA ve Genetik Kod', 'Basınç', 'Madde ve Endüstri', 'Basit Makineler', 'Enerji Dönüşümleri', 'Elektrik Yükleri ve Elektrik Enerjisi'] },
      { id: 'lgs_ink', group: 'LGS', name: 'T.C. İnkılap Tarihi', count: 10, topics: ['Bir Kahraman Doğuyor', 'Milli Uyanış', 'Ya İstiklal Ya Ölüm', 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Demokratikleşme Çabaları'] },
      { id: 'lgs_din', group: 'LGS', name: 'Din Kültürü ve Ahlak Bilgisi', count: 10, topics: ['Kader İnancı', 'Zekat ve Sadaka', 'Din ve Hayat', 'Hz. Muhammed’in Örnekliği', 'Kuran-ı Kerim ve Özellikleri'] },
      { id: 'lgs_ing', group: 'LGS', name: 'LGS İngilizce', count: 10, topics: ['Friendship', 'Teen Life', 'In The Kitchen', 'On The Phone', 'The Internet', 'Adventures', 'Tourism', 'Chores', 'Science', 'Natural Forces'] }
    ]
  },
  YKS_SAY: {
    code: 'YKS_SAY',
    label: 'YKS Sayısal (9-10-11-12 & Mezun)',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    wrongRatio: 4, // 4 Yanlış 1 Doğruyu götürür
    subjects: [
      // TYT TAM KADRO
      { id: 'tyt_tr', group: 'TYT', name: 'TYT Türkçe', count: 40, topics: ['Sözcükte ve Cümlede Anlam', 'Paragraf', 'Ses Bilgisi', 'Yazım Kuralları', 'Noktalama İşaretleri', 'Sözcükte Yapı ve Ekler', 'Sözcük Türleri', 'Fiiller', 'Cümlenin Öğeleri', 'Cümle Türleri', 'Anlatım Bozukluğu'] },
      { id: 'tyt_mat', group: 'TYT', name: 'TYT Matematik', count: 30, topics: ['Temel Kavramlar', 'Sayı Basamakları', 'Bölme ve Bölünebilme', 'EBOB - EKOK', 'Rasyonel Sayılar', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma', 'Oran - Orantı', 'Denklem Çözme', 'Sayı-Kesir Problemleri', 'Yaş-İşçi-Hareket Problemleri', 'Yüzde-Kar-Zarar-Karışım Problemleri', 'Kümeler', 'Fonksiyonlar', 'Permütasyon-Kombinasyon-Binom-Olasılık', 'Veri ve İstatistik'] },
      { id: 'tyt_geo', group: 'TYT', name: 'TYT Geometri', count: 10, topics: ['Doğruda ve Üçgende Açılar', 'Özel Üçgenler (Dik, İkizkenar, Eşkenar)', 'Açıortay ve Kenarortay', 'Üçgende Alan ve Benzerlik', 'Çokgenler ve Dörtgenler', 'Yamuk, Paralelkenar, Eşkenar Dörtgen', 'Dikdörtgen ve Kare', 'Çember ve Daire', 'Katı Cisimler (Prizma, Piramit, Küre)'] },
      { id: 'tyt_fiz', group: 'TYT', name: 'TYT Fizik', count: 7, topics: ['Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Hareket ve Kuvvet', 'İş, Güç ve Enerji', 'Isı, Sıcaklık ve Genleşme', 'Elektrostatik ve Elektrik Akımı', 'Manyetizma', 'Basınç ve Kaldırma Kuvveti', 'Dalgalar', 'Optik'] },
      { id: 'tyt_kim', group: 'TYT', name: 'TYT Kimya', count: 7, topics: ['Kimya Bilimi', 'Atom ve Periyodik Sistem', 'Kimyasal Türler Arası Etkileşimler', 'Maddenin Halleri', 'Doğa ve Kimya', 'Kimyanın Temel Kanunları ve Mol', 'Kimyasal Hesaplamalar', 'Karışımlar', 'Asitler, Bazlar ve Tuzlar', 'Kimya Her Yerde'] },
      { id: 'tyt_biyo', group: 'TYT', name: 'TYT Biyoloji', count: 6, topics: ['Canlıların Ortak Özellikleri', 'Canlıların Temel Bileşenleri', 'Hücre ve Organeller', 'Hücre Zarından Madde Geçişleri', 'Canlıların Sınıflandırılması', 'Mitoz ve Eşeysiz Üreme', 'Mayoz ve Eşeyli Üreme', 'Kalıtım', 'Ekosistem Ekolojisi ve Güncel Çevre Sorunları'] },
      { id: 'tyt_tar', group: 'TYT', name: 'TYT Tarih', count: 5, topics: ['Tarih ve Zaman', 'İlk ve Orta Çağlarda Türk Dünyası', 'İslam Medeniyetinin Doğuşu ve Türkler', 'Osmanlı Kuruluş ve Yükseliş', 'Osmanlı Kültür ve Medeniyeti', 'XX. Yüzyıl Başlarında Osmanlı', 'Kurtuluş Savaşı ve İnkılaplar'] },
      { id: 'tyt_cog', group: 'TYT', name: 'TYT Coğrafya', count: 5, topics: ['Doğa ve İnsan', 'Dünya’nın Şekli ve Hareketleri', 'Coğrafi Konum ve Harita Bilgisi', 'İklim Bilgisi', 'İç ve Dış Kuvvetler', 'Nüfus ve Yerleşme', 'Türkiye Coğrafyası ve Doğal Afetler'] },
      { id: 'tyt_fel', group: 'TYT', name: 'TYT Felsefe', count: 5, topics: ['Felsefeyi Tanıma', 'Bilgi Felsefesi', 'Varlık Felsefesi', 'Ahlak Felsefesi', 'Sanat, Din, Siyaset ve Bilim Felsefesi'] },
      { id: 'tyt_din', group: 'TYT', name: 'TYT Din Kültürü', count: 5, topics: ['Bilgi ve İnanç', 'Din ve İslam', 'İslam ve İbadet', 'Ahlak ve Değerler', 'Allah-İnsan İlişkisi', 'Hz. Muhammed ve İslam Düşüncesinde Yorumlar'] },
      // AYT SAYISAL TAM KADRO
      { id: 'ayt_mat', group: 'AYT', name: 'AYT Matematik', count: 30, topics: ['Polinomlar', '2. Dereceden Denklemler ve Karmaşık Sayılar', 'Parabol', '2. Dereceden Eşitsizlikler', 'Trigonometri', 'Logaritma', 'Diziler', 'Limit ve Süreklilik', 'Türev ve Uygulamaları', 'Belirsiz ve Belirli İntegral'] },
      { id: 'ayt_geo', group: 'AYT', name: 'AYT Geometri', count: 10, topics: ['Çemberde Açı ve Uzunluk', 'Dairede Alan', 'Noktanın ve Doğrunun Analitiği', 'Dönüşüm Geometrisi', 'Çemberin Analitik İncelenmesi', 'Uzay Geometrisi ve Katı Cisimler'] },
      { id: 'ayt_fiz', group: 'AYT', name: 'AYT Fizik', count: 14, topics: ['Vektörler', 'Bağıl Hareket', 'Newton’un Hareket Yasaları', 'Bir ve İki Boyutta Sabit İvmeli Hareket (Atışlar)', 'İş, Güç ve Enerji', 'İtme ve Çizgisel Momentum', 'Tork, Denge ve Kütle Merkezi', 'Basit Makineler', 'Elektriksel Kuvvet, Alan ve Potansiyel', 'Manyetizma ve Elektromanyetik İndüklenme', 'Alternatif Akım ve Transformatörler', 'Çembersel Hareket ve Dönme', 'Basit Harmonik Hareket', 'Dalga Mekaniği', 'Atom Fiziğine Giriş ve Radyoaktivite', 'Modern Fizik ve Teknolojideki Uygulamaları'] },
      { id: 'ayt_kim', group: 'AYT', name: 'AYT Kimya', count: 13, topics: ['Modern Atom Teorisi', 'Gazlar', 'Sıvı Çözeltiler ve Çözünürlük', 'Kimyasal Tepkimelerde Enerji (Entalpi)', 'Kimyasal Tepkimelerde Hız', 'Kimyasal Denge', 'Asit-Baz Dengesi', 'Çözünürlük Dengesi (Kçç)', 'Kimya ve Elektrik (Redoks ve Piller)', 'Karbon Kimyasına Giriş', 'Organik Bileşikler'] },
      { id: 'ayt_biyo', group: 'AYT', name: 'AYT Biyoloji', count: 13, topics: ['Sinir Sistemi', 'Endokrin Sistem', 'Duyu Organları', 'Destek ve Hareket Sistemi', 'Sindirim Sistemi', 'Dolaşım ve Bağışıklık Sistemi', 'Solunum Sistemi', 'Üriner Sistem (Boşaltım)', 'Üreme Sistemi ve Embriyonik Gelişim', 'Komünite ve Popülasyon Ekolojisi', 'Nükleik Asitler ve Protein Sentezi (Genden Proteine)', 'Canlılarda Enerji Dönüşümleri (Fotosentez-Solunum)', 'Bitki Biyolojisi', 'Canlılar ve Çevre'] }
    ]
  },
  YKS_EA: {
    code: 'YKS_EA',
    label: 'YKS Eşit Ağırlık (9-10-11-12 & Mezun)',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    wrongRatio: 4,
    subjects: [
      { id: 'tyt_tr', group: 'TYT', name: 'TYT Türkçe', count: 40, topics: ['Paragraf', 'Sözcük ve Cümlede Anlam', 'Ses-Yazım-Noktalama', 'Dil Bilgisi'] },
      { id: 'tyt_mat', group: 'TYT', name: 'TYT Matematik', count: 30, topics: ['Temel Kavramlar', 'Problemler', 'Fonksiyonlar', 'Kümeler', 'PKOB'] },
      { id: 'tyt_geo', group: 'TYT', name: 'TYT Geometri', count: 10, topics: ['Üçgenler', 'Çokgenler ve Dörtgenler', 'Çember ve Daire', 'Katı Cisimler'] },
      { id: 'tyt_sos', group: 'TYT', name: 'TYT Sosyal Bilimler (Tarih-Coğ-Fel-Din)', count: 20, topics: ['TYT Tarih', 'TYT Coğrafya', 'TYT Felsefe', 'TYT Din Kültürü'] },
      { id: 'tyt_fen', group: 'TYT', name: 'TYT Fen Bilimleri (Fizik-Kimya-Biyo)', count: 20, topics: ['TYT Fizik', 'TYT Kimya', 'TYT Biyoloji'] },
      { id: 'ayt_mat', group: 'AYT', name: 'AYT Matematik & Geometri', count: 40, topics: ['Polinomlar', 'Parabol', 'Trigonometri', 'Logaritma', 'Diziler', 'Limit', 'Türev', 'İntegral', 'AYT Geometri'] },
      { id: 'ayt_edeb', group: 'AYT', name: 'AYT Türk Dili ve Edebiyatı', count: 24, topics: ['Anlam Bilgisi', 'Şiir Bilgisi ve Edebi Sanatlar', 'İslamiyet Öncesi ve Geçiş Dönemi', 'Halk Edebiyatı', 'Divan Edebiyatı', 'Tanzimat, Servetifünun ve Fecriati', 'Milli Edebiyat', 'Cumhuriyet Dönemi Şiir ve Roman'] },
      { id: 'ayt_tar1', group: 'AYT', name: 'AYT Tarih-1', count: 10, topics: ['İlk ve Orta Çağlarda Türk Dünyası', 'İslam Tarihi', 'Osmanlı Tarihi', 'Milli Mücadele ve İnkılap Tarihi'] },
      { id: 'ayt_cog1', group: 'AYT', name: 'AYT Coğrafya-1', count: 6, topics: ['Ekosistem ve Biyoçeşitlilik', 'Nüfus Politikaları ve Şehirler', 'Türkiye Ekonomisi, Tarım, Maden ve Sanayi', 'Küresel Ortam ve Bölgeler'] }
    ]
  },
  KPSS_ALES_DGS: {
    code: 'KPSS_ALES_DGS',
    label: 'KPSS / ALES / DGS',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    wrongRatio: 4,
    subjects: [
      { id: 'kpss_mat', group: 'GY', name: 'Matematik & Sayısal Mantık', count: 30, topics: ['Temel Kavramlar ve Çözümleme', 'Rasyonel, Üslü ve Köklü Sayılar', 'Denklem, Eşitsizlik ve Mutlak Değer', 'Oran-Orantı ve Tüm Problemler', 'Fonksiyon, İşlem, Kümeler, Olasılık', 'Tablo-Grafik ve Sayısal Mantık'] },
      { id: 'kpss_geo', group: 'GY', name: 'Geometri', count: 10, topics: ['Üçgenler', 'Dörtgenler ve Çokgenler', 'Çember ve Daire', 'Analitik Geometri'] },
      { id: 'kpss_tr', group: 'GY', name: 'Türkçe & Sözel Mantık', count: 30, topics: ['Sözcükte ve Cümlede Anlam', 'Paragraf Yorumlama', 'Ses, Yazım ve Noktalama', 'Dil Bilgisi ve Anlatım Bozukluğu', 'Sözel Mantık ve Muhakeme'] },
      { id: 'kpss_tar', group: 'GK', name: 'KPSS Tarih', count: 27, topics: ['İslamiyet Öncesi Türk Tarihi', 'Türk-İslam Tarihi', 'Osmanlı Kültür, Medeniyet ve Siyasi Tarihi', 'Kurtuluş Savaşı Hazırlık ve Cepheler', 'Atatürk İlkeleri ve İnkılapları', 'Çağdaş Türk ve Dünya Tarihi'] },
      { id: 'kpss_cog', group: 'GK', name: 'KPSS Coğrafya', count: 18, topics: ['Türkiye Coğrafi Konumu ve Yer Şekilleri', 'Türkiye İklimi ve Bitki Örtüsü', 'Türkiye’de Nüfus, Tarım, Hayvancılık', 'Madenler, Enerji Kaynakları, Sanayi ve Ulaşım'] },
      { id: 'kpss_vat', group: 'GK', name: 'Vatandaşlık ve Güncel Bilgiler', count: 15, topics: ['Temel Hukuk Kavramları', 'Anayasa Tarihi', 'Yasama, Yürütme ve Yargı', 'İdare Hukuku ve Güncel Olaylar'] },
      { id: 'kpss_eb', group: 'EB', name: 'Eğitim Bilimleri (Varsa)', count: 80, topics: ['Öğretim İlke ve Yöntemleri', 'Sınıf Yönetimi ve Materyal Tasarımı', 'Program Geliştirme', 'Öğrenme Psikolojisi', 'Gelişim Psikolojisi', 'Ölçme ve Değerlendirme', 'Rehberlik ve Özel Eğitim'] }
    ]
  },
  OABT_AGS: {
    code: 'OABT_AGS',
    label: 'MEB AGS & ÖABT (Alan Bilgisi)',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    wrongRatio: 4,
    subjects: [
      { id: 'oabt_analiz', group: 'ÖABT', name: 'Analiz (Fonksiyon-Limit-Türev-İntegral-Dizi/Seri)', count: 21, topics: ['Fonksiyonlar ve Grafikleri', 'Limit ve Süreklilik', 'Türev ve Geometrik/Fiziksel Uygulamaları', 'Belirsiz ve Belirli İntegral, Alan-Hacim', 'Diziler ve Sonsuz Seriler', 'Çok Değişkenli Fonksiyonlar, Kısmi Türev ve Katlı İntegral'] },
      { id: 'oabt_cebir', group: 'ÖABT', name: 'Cebir ve Sayılar Teorisi', count: 15, topics: ['Bölünebilme, Kongrüanslar ve Sayılar Teorisi', 'Soyut Cebir (Gruplar, Halkalar, Cisimler)', 'Matrisler ve Determinant', 'Lineer Denklem Sistemleri', 'Vektör Uzayları ve Lineer Dönüşümler', 'Özdeğer ve Özvektörler'] },
      { id: 'oabt_geo', group: 'ÖABT', name: 'Geometri (Analitik ve Öklid)', count: 12, topics: ['Düzlemde Öklid Geometrisi', 'Düzlemde Analitik Geometri (Konikler)', 'Uzayda Analitik Geometri (Doğru, Düzlem, Yüzeyler)', 'Vektörel Geometri'] },
      { id: 'oabt_uyg', group: 'ÖABT', name: 'Uygulamalı Matematik (Dif. Denklem & Olasılık)', count: 12, topics: ['1. Mertebeden Diferansiyel Denklemler', 'Yüksek Mertebeden Lineer Diferansiyel Denklemler', 'Laplace Dönüşümleri', 'Olasılık Teorisi ve Dağılımlar', 'İstatistik'] },
      { id: 'oabt_egitim', group: 'AGS', name: 'Alan Eğitimi & Türkiye Yüzyılı Maarif Modeli', count: 15, topics: ['2025-2026 Maarif Modeli Matematik Öğretim Programı', 'Matematik Tarihi ve Felsefesi', 'Matematik Öğretim Yöntemleri ve Kavram Yanılgıları', 'MEB AGS Mevzuat ve Eğitim Temelleri'] }
    ]
  }
};

export const calculateNet = (correct, wrong, wrongRatio = 4) => {
  const d = Number(correct) || 0;
  const y = Number(wrong) || 0;
  const net = d - (y / Number(wrongRatio));
  return Number(Math.max(0, net).toFixed(2));
};