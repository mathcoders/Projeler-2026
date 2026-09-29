import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Plus, Trash2, CheckCircle2, 
  Clock, Award, BookOpen, AlertCircle, TrendingUp, 
  Send, Sparkles, User, Settings, Layers, Target, ChevronRight, Sliders
} from 'lucide-react';

const EXAM_PRESETS = [
  { id: 'lgs', name: '8. Sınıf LGS', netFormula: 3, defaultSubjects: ['Matematik', 'Fen Bilimleri', 'Türkçe', 'T.C. İnkılap', 'Din Kültürü', 'İngilizce'] },
  { id: 'yks_say', name: 'YKS - Sayısal (12 / Mezun)', netFormula: 4, defaultSubjects: ['TYT Matematik', 'AYT Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe'] },
  { id: 'yks_ea', name: 'YKS - Eşit Ağırlık (12 / Mezun)', netFormula: 4, defaultSubjects: ['TYT Matematik', 'AYT Matematik', 'Geometri', 'Edebiyat', 'Tarih', 'Coğrafya', 'Türkçe'] },
  { id: 'kpss', name: 'KPSS Lisans / Önlisans', netFormula: 4, defaultSubjects: ['Matematik (GY)', 'Sayısal Mantık', 'Türkçe', 'Tarih', 'Coğrafya', 'Vatandaşlık'] },
  { id: 'ales', name: 'ALES Sayısal / Eşit Ağırlık', netFormula: 4, defaultSubjects: ['Sayısal Mantık & Akıl Yürütme', 'Temel Matematik', 'Geometri', 'Sözel Mantık & Paragraf'] },
  { id: 'dgs', name: 'DGS Sayısal', netFormula: 4, defaultSubjects: ['Sayısal Mantık', 'Matematik 1', 'Geometri', 'Problem Rutinleri'] },
  { id: 'oabt_mat', name: 'ÖABT Matematik (Lise / İlköğretim)', netFormula: 4, defaultSubjects: ['Analiz (Kalkülüs)', 'Lineer Cebir', 'Soyut Cebir', 'Diferansiyel Denklemler', 'Alan Eğitimi'] },
  { id: 'yos', name: 'TR-YÖS / YÖS', netFormula: 4, defaultSubjects: ['YÖS Matematik 1', 'YÖS Matematik 2', 'YÖS Geometri', 'IQ & Mantık (Genel Yetenek)'] },
  { id: 'ozel_mat', name: 'Matematik Özel Yetenek & Olimpiyat', netFormula: 4, defaultSubjects: ['Sayılar Teorisi', 'Kombinatorik & Olasılık', 'İleri Geometri', 'Fonksiyonel Denklemler'] },
];

const TIMER_PRESETS = [
  { label: 'Pomodoro', mins: 25 },
  { label: 'Kısa Etüt', mins: 40 },
  { label: 'Derin Blok', mins: 60 },
  { label: 'LGS Sözel', mins: 75 },
  { label: 'LGS Sayısal', mins: 80 },
  { label: 'YÖS Deneme', mins: 100 },
  { label: 'ÖABT Deneme', mins: 120 },
  { label: 'KPSS GK-GY', mins: 130 },
  { label: 'DGS Deneme', mins: 135 },
  { label: 'ALES Deneme', mins: 150 },
  { label: 'TYT Deneme', mins: 165 },
  { label: 'AYT Deneme', mins: 180 },
];

export default function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('study_students');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Murat Yıldız', examId: 'lgs', weeklyGoal: 600, targetText: 'Galatasaray Lisesi' },
      { id: 2, name: 'Ahmet Sayısal', examId: 'yks_say', weeklyGoal: 850, targetText: 'İTÜ Bilgisayar Müh.' },
      { id: 3, name: 'Zeynep Öğretmen', examId: 'oabt_mat', weeklyGoal: 500, targetText: 'İlk Atama 90+ Puan' },
    ];
  });

  const [activeStudentId, setActiveStudentId] = useState(1);
  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];
  const currentExam = EXAM_PRESETS.find(e => e.id === currentStudent?.examId) || EXAM_PRESETS[0];

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('study_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  // Pomodoro / Sayaç State
  const [selectedMins, setSelectedMins] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [customInputMins, setCustomInputMins] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Form State
  const [subject, setSubject] = useState(currentExam.defaultSubjects[0]);
  const [topic, setTopic] = useState('');
  const [qType, setQType] = useState('Yeni Nesil / Beceri');
  const [correct, setCorrect] = useState('');
  const [wrong, setWrong] = useState('');
  const [empty, setEmpty] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('Orta');

  // Filtrelenmiş öğrenci kayıtları
  const studentSessions = sessions.filter(s => s.studentId === currentStudent.id);

  useEffect(() => {
    localStorage.setItem('study_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('study_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    setSubject(currentExam.defaultSubjects[0]);
  }, [currentExam]);

  // Sayaç Mantığı
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      alert(`Tebrikler! ${selectedMins} dakikalık oturum tamamlandı.`);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, selectedMins]);

  const selectPresetTime = (mins) => {
    setTimerRunning(false);
    setSelectedMins(mins);
    setTimeLeft(mins * 60);
  };

  const applyCustomTime = (e) => {
    e.preventDefault();
    const val = parseInt(customInputMins);
    if (!isNaN(val) && val > 0) {
      selectPresetTime(val);
      setShowCustomModal(false);
      setCustomInputMins('');
    }
  };

  const handleFinishAndTransfer = () => {
    const spentSecs = (selectedMins * 60) - timeLeft;
    const spentMins = Math.max(1, Math.round(spentSecs / 60));
    setDuration(spentMins.toString());
    setTimerRunning(false);
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    const c = parseInt(correct) || 0;
    const w = parseInt(wrong) || 0;
    const em = parseInt(empty) || 0;
    const net = Number((c - (w / currentExam.netFormula)).toFixed(2));

    const newSession = {
      id: Date.now(),
      studentId: currentStudent.id,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      subject,
      topic: topic || 'Genel Konu Testi',
      qType,
      correct: c,
      wrong: w,
      empty: em,
      net,
      duration: parseInt(duration) || 0,
      difficulty,
      wrongResolved: false
    };

    setSessions([newSession, ...sessions]);
    setTopic('');
    setCorrect('');
    setWrong('');
    setEmpty('');
    setDuration('');
  };

  const toggleResolveWrong = (id) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, wrongResolved: !s.wrongResolved } : s));
  };

  const deleteSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  // İstatistikler
  const totalQuestions = studentSessions.reduce((acc, s) => acc + (s.correct + s.wrong + s.empty), 0);
  const totalCorrect = studentSessions.reduce((acc, s) => acc + s.correct, 0);
  const totalWrong = studentSessions.reduce((acc, s) => acc + s.wrong, 0);
  const totalNet = Number(studentSessions.reduce((acc, s) => acc + s.net, 0).toFixed(1));
  const totalMinutes = studentSessions.reduce((acc, s) => acc + s.duration, 0);
  const pendingWrongs = studentSessions.filter(s => (s.wrong > 0 || s.empty > 0) && !s.wrongResolved);

  const formatTimer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const copyWhatsAppReport = () => {
    const text = `📊 *HAFTALIK ÇALIŞMA VE KOÇLUK RAPORU*
👤 *Öğrenci:* ${currentStudent.name} (${currentExam.name})
🎯 *Hedef:* ${currentStudent.targetText}
━━━━━━━━━━━━━━━━━━
⏱ *Toplam Masa Başı Süre:* ${Math.floor(totalMinutes / 60)} sa ${totalMinutes % 60} dk
📝 *Toplam Çözülen Soru:* ${totalQuestions}
✅ *Doğru:* ${totalCorrect} | ❌ *Yanlış:* ${totalWrong}
📈 *Hesaplanan Toplam Net:* ${totalNet} (${currentExam.netFormula} Yanlış 1 Doğru)
📌 *Telafi Bekleyen Soru Sayısı:* ${pendingWrongs.length} oturum
━━━━━━━━━━━━━━━━━━
Tebrikler, planlı çalışmaya devam! 🚀`;

    navigator.clipboard.writeText(text);
    alert('Rapor panoya kopyalandı! WhatsApp veya mesaj olarak yapıştırabilirsiniz.');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-3 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Üst Bar: Öğrenci Seçici & Sınav Bilgisi */}
        <header className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl backdrop-blur flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/30 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Akademik Takip Paneli</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  {currentExam.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Hedef: <span className="text-slate-200 font-medium">{currentStudent.targetText}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 w-full md:w-auto">
              <User className="w-4 h-4 text-indigo-400" />
              <select 
                value={activeStudentId} 
                onChange={(e) => setActiveStudentId(Number(e.target.value))}
                className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer pr-4"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-800 text-slate-100">
                    {s.name} ({EXAM_PRESETS.find(ep => ep.id === s.examId)?.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Kompakt Pomodoro & Deneme Sayaç Kartı */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/80 via-slate-800/90 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Sol: Sayaç ve Kontroller */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:text-left">
                <div className="text-4xl sm:text-5xl font-mono font-extrabold tracking-wider text-white drop-shadow">
                  {formatTimer(timeLeft)}
                </div>
                <div className="text-xs text-indigo-300/80 mt-1 font-medium">
                  {selectedMins} Dk Oturum • {timerRunning ? 'Odaklanılıyor...' : 'Beklemede'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-95 ${
                    timerRunning 
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {timerRunning ? 'Durdur' : 'Başlat'}
                </button>

                <button
                  onClick={handleFinishAndTransfer}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-medium transition"
                  title="Süreyi Soru Formuna Aktar"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Bitir & Aktar
                </button>

                <button
                  onClick={() => { setTimerRunning(false); setTimeLeft(selectedMins * 60); }}
                  className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sağ: Süre Hapları (Pill Presets) */}
            <div className="w-full md:w-auto">
              <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                <span>HIZLI SÜRE & DENEME MODLARI</span>
                <button 
                  onClick={() => setShowCustomModal(!showCustomModal)}
                  className="text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3" />
                  Özel Süre
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-w-md">
                {TIMER_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectPresetTime(p.mins)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      selectedMins === p.mins 
                        ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400' 
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                    }`}
                  >
                    {p.label} <span className="opacity-60 text-[10px]">({p.mins}')</span>
                  </button>
                ))}
              </div>

              {/* Özel Dakika Açılır Mini Formu */}
              {showCustomModal && (
                <form onSubmit={applyCustomTime} className="mt-3 flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-indigo-500/40">
                  <input
                    type="number"
                    placeholder="Dakika girin (örn: 45)"
                    value={customInputMins}
                    onChange={(e) => setCustomInputMins(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    Ayarla
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* Metrik Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Toplam Süre
            </div>
            <div className="text-2xl font-bold mt-1 text-white">
              {Math.floor(totalMinutes / 60)} <span className="text-sm font-normal text-slate-400">sa</span> {totalMinutes % 60} <span className="text-sm font-normal text-slate-400">dk</span>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-400" /> Çözülen Soru
            </div>
            <div className="text-2xl font-bold mt-1 text-white">
              {totalQuestions} <span className="text-xs font-normal text-slate-400">/ {currentStudent.weeklyGoal} Hedef</span>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Toplam Net
            </div>
            <div className="text-2xl font-bold mt-1 text-emerald-400">
              {totalNet} <span className="text-xs font-normal text-slate-400">({currentExam.netFormula} Y = 1 D)</span>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Telafi Bekleyen
            </div>
            <div className="text-2xl font-bold mt-1 text-amber-400">
              {pendingWrongs.length} <span className="text-xs font-normal text-slate-400">Oturum</span>
            </div>
          </div>
        </div>

        {/* İki Sütunlu Ana Gövde: Soru Giriş Formu & Geçmiş / Hata Kumbarası */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sol Kolon: Soru & Net Giriş Formu */}
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-5 shadow-lg">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-indigo-400" />
              Soru & Deneme Girişi
            </h2>

            <form onSubmit={handleAddSession} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Ders Seçimi</label>
                <select 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {currentExam.defaultSubjects.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Konu / Deneme Adı</label>
                <input 
                  type="text" 
                  placeholder="Örn: Çarpanlar ve Katlar / 1. Branş Denemesi" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Soru Türü</label>
                  <select 
                    value={qType} 
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Yeni Nesil / Beceri">Yeni Nesil / Beceri</option>
                    <option value="Kazanım Kavrama">Kazanım Kavrama</option>
                    <option value="ÖSYM Tarzı Sınav">ÖSYM Tarzı Sınav</option>
                    <option value="Deneme Sınavı">Tam Deneme</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Süre (Dk)</label>
                  <input 
                    type="number" 
                    placeholder="35" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* D / Y / B Kutuları */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="text-xs font-semibold text-emerald-400 block mb-1">Doğru</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                    className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none text-center"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-rose-400 block mb-1">Yanlış</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={wrong}
                    onChange={(e) => setWrong(e.target.value)}
                    className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-3 py-2 text-sm text-rose-400 font-bold focus:outline-none text-center"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Boş</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={empty}
                    onChange={(e) => setEmpty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 font-bold focus:outline-none text-center"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Kaydı Ekle & Net Hesapla
              </button>
            </form>
          </div>

          {/* Sağ Kolon: Oturum Listesi & Hata Kumbarası */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Çalışma Geçmişi & Hata Kumbarası
                </h2>
                <span className="text-xs text-slate-400">{studentSessions.length} Oturum Kayıtlı</span>
              </div>

              {studentSessions.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Henüz kaydedilmiş bir çalışma bulunmuyor. Soldaki formdan ilk kaydınızı ekleyebilirsiniz.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {studentSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        session.wrongResolved 
                          ? 'bg-slate-900/40 border-slate-800 text-slate-400' 
                          : 'bg-slate-900/90 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                            {session.subject}
                          </span>
                          <span className="text-xs text-slate-400">
                            {session.date} • {session.topic}
                          </span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {session.qType}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-emerald-400 font-semibold">{session.correct} Doğru</span>
                          <span className="text-rose-400 font-semibold">{session.wrong} Yanlış</span>
                          <span className="text-slate-400">{session.empty} Boş</span>
                          <span className="font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded">
                            {session.net} Net
                          </span>
                          {session.duration > 0 && (
                            <span className="text-slate-400">⏱ {session.duration} dk</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {(session.wrong > 0 || session.empty > 0) && (
                          <button
                            onClick={() => toggleResolveWrong(session.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                              session.wrongResolved
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-950/60 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {session.wrongResolved ? 'Telafi Edildi' : 'Yanlışları Çöz'}
                          </button>
                        )}

                        <button
                          onClick={() => deleteSession(session.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Veli / Koçluk WhatsApp Raporu Butonu */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-800 border border-emerald-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <Send className="w-4 h-4" /> Tek Tıkla Koçluk / Veli Raporu
                </h3>
                <p className="text-xs text-slate-400">Bu öğrencinin haftalık net ve süre özetini WhatsApp metni olarak panoya kopyalar.</p>
              </div>

              <button
                onClick={copyWhatsAppReport}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" /> WhatsApp Raporu Kopyala
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}