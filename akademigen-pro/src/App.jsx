// src/App.jsx
import React, { useState, useEffect } from 'react';
import { EXAM_ENGINES, calculateNet } from './constants/examEngines';
import { isSupabaseConfigured, fetchStudentsFromCloud, syncStudentsToCloud } from './lib/supabaseClient';
import { 
  GraduationCap, BookOpen, PlusCircle, CheckCircle2, 
  Printer, Database, Play, Pause, RotateCcw, Clock, 
  LogOut, Lock, User, BarChart3, Calendar, CheckSquare, 
  Bell, Share2, Copy, TrendingUp
} from 'lucide-react';

const INITIAL_STUDENTS = [
  {
    id: '1',
    name: 'Ayça Kaya',
    username: 'ayca',
    password: '123',
    category: 'YKS_SAY',
    createdAt: '2026-10-12T14:30',
    target: 'Ege Üniversitesi — 450 Puan',
    weeklyTarget: 1200,
    solvedThisWeek: 940,
    pomodoroMinutesTotal: 425,
    sleepAvg: 7.2,
    screenAvg: 2.1,
    streak: 6,
    book: { 
      title: 'Suç ve Ceza', 
      author: 'Fyodor Dostoyevski', 
      totalPages: 687, 
      currentPage: 420, 
      targetDays: 15, 
      startDate: '2026-10-15' 
    },
    bookHistory: [
      { title: 'Dönüşüm', totalPages: 110, completedDate: '10 Ekim 2026' }
    ],
    dailySubjectLogs: [
      { id: 'l1', isoDate: '2026-10-26', date: '26 Ekim 2026 21:15', subject: 'TYT Matematik', topic: 'Sayı-Kesir Problemleri', correct: 36, wrong: 4, blank: 0, net: 35 },
      { id: 'l2', isoDate: '2026-10-26', date: '26 Ekim 2026 19:40', subject: 'TYT Fizik', topic: 'Optik', correct: 22, wrong: 2, blank: 1, net: 21.5 },
      { id: 'l3', isoDate: '2026-10-25', date: '25 Ekim 2026 22:10', subject: 'AYT Matematik', topic: 'Türev ve Uygulamaları', correct: 45, wrong: 5, blank: 2, net: 43.75 },
      { id: 'l4', isoDate: '2026-10-24', date: '24 Ekim 2026 20:00', subject: 'TYT Türkçe', topic: 'Paragraf', correct: 35, wrong: 5, blank: 0, net: 33.75 },
      { id: 'l5', isoDate: '2026-10-23', date: '23 Ekim 2026 18:30', subject: 'AYT Kimya', topic: 'Gazlar', correct: 28, wrong: 2, blank: 0, net: 27.5 }
    ],
    recentActivities: [
      { id: 'a1', time: '26 Ekim 2026 • 21:45', type: 'reading', text: '"Suç ve Ceza" kitabından 38 sayfa okudu (420/687 syf).' },
      { id: 'a2', time: '26 Ekim 2026 • 21:15', type: 'question', text: 'TYT Matematik (Sayı-Kesir Problemleri) dersinden 40 soru çözdü (36D / 4Y = 35 Net).' },
      { id: 'a3', time: '26 Ekim 2026 • 19:40', type: 'question', text: 'TYT Fizik (Optik) dersinden 25 soru çözdü (22D / 2Y / 1B = 21.5 Net).' },
      { id: 'a4', time: '25 Ekim 2026 • 18:50', type: 'pomodoro', text: '50 dakikalık Pomodoro odak oturumunu tamamladı.' }
    ],
    assignedTasks: [
      { 
        id: 't1', 
        subject: 'TYT Fizik', 
        topic: 'Optik', 
        targetType: 'test', 
        targetAmount: 4, 
        questionEquivalent: 80,
        coachNote: 'Mercekler ve Aydınlanma alt başlıklarına özellikle dikkat edelim.', 
        dueDate: '28 Ekim Çarşamba', 
        assignedAt: '26 Ekim 2026 14:00',
        done: false 
      },
      { 
        id: 't2', 
        subject: 'AYT Matematik', 
        topic: 'Türev ve Uygulamaları', 
        targetType: 'question', 
        targetAmount: 120, 
        questionEquivalent: 120,
        coachNote: 'Maksimum-Minimum problemlerinden en az 3 farklı kaynaktan tarama yapalım.', 
        dueDate: '30 Ekim Cuma', 
        assignedAt: '26 Ekim 2026 14:05',
        done: false 
      },
      { 
        id: 't3', 
        subject: 'TYT Türkçe', 
        topic: 'Paragraf', 
        targetType: 'question', 
        targetAmount: 25, 
        questionEquivalent: 25,
        coachNote: 'Her sabah süre tutarak (maksimum 22 dk) çözülecek.', 
        dueDate: 'Her Gün Rutin', 
        assignedAt: '20 Ekim 2026 10:00',
        done: true 
      }
    ],
    exams: [
      {
        id: 'ex1',
        name: 'Özdebir Türkiye Geneli - 1',
        date: '2026-10-10',
        type: 'TYT Genel',
        totalCorrect: 82,
        totalWrong: 14,
        totalBlank: 24,
        totalNet: 78.5,
        coachNote: 'Türkçe süresini 50 dakikaya çekmeliyiz, Fen netleri gayet iyi başladı.',
        breakdown: [
          { subject: 'TYT Türkçe', count: 40, D: 31, Y: 6, B: 3, net: 29.5 },
          { subject: 'TYT Matematik', count: 30, D: 22, Y: 4, B: 4, net: 21.0 },
          { subject: 'TYT Geometri', count: 10, D: 6, Y: 0, B: 4, net: 6.0 },
          { subject: 'TYT Fizik', count: 7, D: 5, Y: 1, B: 1, net: 4.75 },
          { subject: 'TYT Kimya', count: 7, D: 6, Y: 1, B: 0, net: 5.75 },
          { subject: 'TYT Biyoloji', count: 6, D: 4, Y: 1, B: 1, net: 3.75 },
          { subject: 'TYT Tarih', count: 5, D: 4, Y: 0, B: 1, net: 4.0 },
          { subject: 'TYT Coğrafya', count: 5, D: 4, Y: 1, B: 0, net: 3.75 }
        ]
      },
      {
        id: 'ex2',
        name: '3D Türkiye Geneli Deneme - 2',
        date: '2026-10-18',
        type: 'TYT Genel',
        totalCorrect: 88,
        totalWrong: 12,
        totalBlank: 20,
        totalNet: 85.0,
        coachNote: 'Matematik ve Fizikte net artışı harika! Dikkat hatalarını azalttığımızda 95+ bandına çıkacağız.',
        breakdown: [
          { subject: 'TYT Türkçe', count: 40, D: 33, Y: 5, B: 2, net: 31.75 },
          { subject: 'TYT Matematik', count: 30, D: 25, Y: 3, B: 2, net: 24.25 },
          { subject: 'TYT Geometri', count: 10, D: 7, Y: 1, B: 2, net: 6.75 },
          { subject: 'TYT Fizik', count: 7, D: 6, Y: 1, B: 0, net: 5.75 },
          { subject: 'TYT Kimya', count: 7, D: 6, Y: 0, B: 1, net: 6.0 },
          { subject: 'TYT Biyoloji', count: 6, D: 5, Y: 1, B: 0, net: 4.75 },
          { subject: 'TYT Tarih', count: 5, D: 3, Y: 1, B: 1, net: 2.75 },
          { subject: 'TYT Coğrafya', count: 5, D: 3, Y: 0, B: 2, net: 3.0 }
        ]
      },
      {
        id: 'ex3',
        name: 'Bilgi Sarmal TG - 3',
        date: '2026-10-25',
        type: 'TYT Genel',
        totalCorrect: 93,
        totalWrong: 10,
        totalBlank: 17,
        totalNet: 90.5,
        coachNote: '90 Net barajı kırıldı! Geometri ve Problemler netleri istikrarlı yükseliyor.',
        breakdown: [
          { subject: 'TYT Türkçe', count: 40, D: 35, Y: 4, B: 1, net: 34.0 },
          { subject: 'TYT Matematik', count: 30, D: 26, Y: 2, B: 2, net: 25.5 },
          { subject: 'TYT Geometri', count: 10, D: 8, Y: 1, B: 1, net: 7.75 },
          { subject: 'TYT Fizik', count: 7, D: 6, Y: 1, B: 0, net: 5.75 },
          { subject: 'TYT Kimya', count: 7, D: 7, Y: 0, B: 0, net: 7.0 },
          { subject: 'TYT Biyoloji', count: 6, D: 5, Y: 1, B: 0, net: 4.75 },
          { subject: 'TYT Tarih', count: 5, D: 3, Y: 1, B: 1, net: 2.75 },
          { subject: 'TYT Coğrafya', count: 5, D: 3, Y: 0, B: 2, net: 3.0 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Ömer Demir',
    username: 'omer',
    password: '123',
    category: 'LGS',
    createdAt: '2026-10-14T16:15',
    target: 'İzmir Atatürk Lisesi (%0.45)',
    weeklyTarget: 850,
    solvedThisWeek: 510,
    pomodoroMinutesTotal: 210,
    sleepAvg: 6.5,
    screenAvg: 3.4,
    streak: 3,
    book: { 
      title: 'Simyacı', 
      author: 'Paulo Coelho', 
      totalPages: 188, 
      currentPage: 92, 
      targetDays: 10, 
      startDate: '2026-10-20' 
    },
    bookHistory: [],
    dailySubjectLogs: [
      { id: 'ol1', isoDate: '2026-10-26', date: '26 Ekim 2026 18:20', subject: 'LGS Matematik', topic: 'Üslü İfadeler', correct: 34, wrong: 6, blank: 0, net: 32 }
    ],
    recentActivities: [
      { id: 'oa1', time: '26 Ekim 2026 • 18:20', type: 'question', text: 'LGS Matematik (Üslü İfadeler) dersinden 40 soru çözdü (34D / 6Y = 32 Net).' }
    ],
    assignedTasks: [
      { 
        id: 'ot1', 
        subject: 'LGS Fen Bilimleri', 
        topic: 'DNA ve Genetik Kod', 
        targetType: 'test', 
        targetAmount: 5, 
        questionEquivalent: 100,
        coachNote: 'Mutasyon ve Modifikasyon ayrımına dikkat ederek çöz.', 
        dueDate: '29 Ekim Perşembe', 
        assignedAt: '26 Ekim 2026 15:00',
        done: false 
      }
    ],
    exams: [
      {
        id: 'oex1',
        name: 'Mozaik LGS Deneme - 1',
        date: '2026-10-12',
        type: 'LGS Genel',
        totalCorrect: 75,
        totalWrong: 9,
        totalBlank: 6,
        totalNet: 72.0,
        coachNote: 'Matematik yeni nesil sorularda turlama tekniğini kullanmalıyız.',
        breakdown: [
          { subject: 'LGS Türkçe', count: 20, D: 17, Y: 3, B: 0, net: 16.0 },
          { subject: 'LGS Matematik', count: 20, D: 13, Y: 3, B: 4, net: 12.0 },
          { subject: 'LGS Fen Bilimleri', count: 20, D: 17, Y: 3, B: 0, net: 16.0 },
          { subject: 'T.C. İnkılap Tarihi', count: 10, D: 9, Y: 0, B: 1, net: 9.0 },
          { subject: 'Din Kültürü ve Ahlak Bilgisi', count: 10, D: 10, Y: 0, B: 0, net: 10.0 },
          { subject: 'LGS İngilizce', count: 10, D: 9, Y: 0, B: 1, net: 9.0 }
        ]
      },
      {
        id: 'oex2',
        name: 'Sinan Kuzucu LGS Deneme - 2',
        date: '2026-10-24',
        type: 'LGS Genel',
        totalCorrect: 80,
        totalWrong: 6,
        totalBlank: 4,
        totalNet: 78.0,
        coachNote: 'Matematik neti +4 arttı! Fen Bilimlerinde dikkat hatalarına odaklanacağız.',
        breakdown: [
          { subject: 'LGS Türkçe', count: 20, D: 18, Y: 2, B: 0, net: 17.33 },
          { subject: 'LGS Matematik', count: 20, D: 16, Y: 1, B: 3, net: 15.67 },
          { subject: 'LGS Fen Bilimleri', count: 20, D: 18, Y: 2, B: 0, net: 17.33 },
          { subject: 'T.C. İnkılap Tarihi', count: 10, D: 9, Y: 1, B: 0, net: 8.67 },
          { subject: 'Din Kültürü ve Ahlak Bilgisi', count: 10, D: 10, Y: 0, B: 0, net: 10.0 },
          { subject: 'LGS İngilizce', count: 10, D: 9, Y: 0, B: 1, net: 9.0 }
        ]
      }
    ]
  }
];

const getNowDateTimeString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const formatReadableDateTime = (isoStr) => {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleString('tr-TR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

export default function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('akademigen_v2_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [cloudLoaded, setCloudLoaded] = useState(false);

  // İlk açılışta Supabase'den güncel verileri çek
  useEffect(() => {
    let mounted = true;
    if (isSupabaseConfigured) {
      fetchStudentsFromCloud(INITIAL_STUDENTS).then(cloudData => {
        if (mounted && cloudData && cloudData.length > 0) {
          setStudents(cloudData);
        }
        if (mounted) setCloudLoaded(true);
      });
    } else {
      setCloudLoaded(true);
    }
    return () => { mounted = false; };
  }, []);

  // Her veri değişiminde hem LocalStorage'a hem Supabase Bulut'a kaydet
  useEffect(() => {
    localStorage.setItem('akademigen_v2_students', JSON.stringify(students));
    if (isSupabaseConfigured && cloudLoaded) {
      syncStudentsToCloud(students);
    }
  }, [students, cloudLoaded]);

  const [authSession, setAuthSession] = useState({ role: 'coach' });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('coach'); // 'coach' | 'student' | 'exams' | 'report'
  const [selectedStudentId, setSelectedStudentId] = useState('1');
  const [studentInnerTab, setStudentInnerTab] = useState('daily'); // 'daily' | 'tasks' | 'charts' | 'exam_entry' | 'exam_analytics' | 'book'
  const [chartPeriod, setChartPeriod] = useState('weekly'); // 'daily' | 'weekly' | 'monthly'
  const [reportPeriod, setReportPeriod] = useState('weekly'); // 'daily' | 'weekly' | 'monthly'

  const effectiveStudentId = authSession?.role === 'student' ? authSession.studentId : selectedStudentId;
  const activeStudent = students.find(s => s.id === effectiveStudentId) || students[0];
  const currentEngine = EXAM_ENGINES[activeStudent.category] || EXAM_ENGINES.YKS_SAY;

  // ================= KOÇ: DERS > KONU > SORU/TEST SEÇİMLİ ÖDEV ATAMA STATE =================
  const [taskSubjectName, setTaskSubjectName] = useState('');
  const [taskTopicName, setTaskTopicName] = useState('');
  const [taskTargetType, setTaskTargetType] = useState('question');
  const [taskTargetAmount, setTaskTargetAmount] = useState('60');
  const [taskDueDate, setTaskDueDate] = useState('Bu Hafta Cuma');
  const [taskCoachNote, setTaskCoachNote] = useState('');

  useEffect(() => {
    const firstSub = currentEngine.subjects[0];
    if (firstSub) {
      setTaskSubjectName(firstSub.name);
      setTaskTopicName(firstSub.topics[0] || '');
    }
  }, [activeStudent.id, activeStudent.category]);

  const handleTaskSubjectChange = (newSubName) => {
    setTaskSubjectName(newSubName);
    const foundSub = currentEngine.subjects.find(s => s.name === newSubName);
    if (foundSub && foundSub.topics.length > 0) {
      setTaskTopicName(foundSub.topics[0]);
    } else {
      setTaskTopicName('');
    }
  };

  const selectedTaskSubjectObj = currentEngine.subjects.find(s => s.name === taskSubjectName) || currentEngine.subjects[0];

  const handleAssignStructuredTask = (e) => {
    e.preventDefault();
    const amountNum = Number(taskTargetAmount);
    if (!taskSubjectName || !taskTopicName || !amountNum || amountNum <= 0) {
      alert('Lütfen Ders, Konu ve geçerli bir Soru/Test sayısı seçin!');
      return;
    }

    const nowReadable = formatReadableDateTime(getNowDateTimeString());
    const newTask = {
      id: `task_${Date.now()}`,
      subject: taskSubjectName,
      topic: taskTopicName,
      targetType: taskTargetType,
      targetAmount: amountNum,
      questionEquivalent: taskTargetType === 'test' ? amountNum * 20 : amountNum,
      coachNote: taskCoachNote.trim() || 'Koç tarafından konu pekiştirme görevi olarak atandı.',
      dueDate: taskDueDate || 'Bu Hafta',
      assignedAt: nowReadable,
      done: false
    };

    const summaryLabel = taskTargetType === 'test' 
      ? `${amountNum} Test (~${amountNum * 20} Soru)` 
      : `${amountNum} Soru`;

    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      return {
        ...s,
        assignedTasks: [newTask, ...(s.assignedTasks || [])],
        recentActivities: [
          { 
            id: `act_${Date.now()}`, 
            time: nowReadable, 
            type: 'task', 
            text: `👨‍🏫 Koç Yeni Ödev Atadı: ${taskSubjectName} ➔ ${taskTopicName} (${summaryLabel}).` 
          },
          ...(s.recentActivities || [])
        ]
      };
    }));

    setTaskCoachNote('');
    alert(`Ödev atandı! ${activeStudent.name} sisteme girdiğinde "${taskSubjectName} - ${taskTopicName} (${summaryLabel})" görevini mesaj olarak görecek.`);
  };

  const toggleTaskDone = (taskId) => {
    const nowReadable = formatReadableDateTime(getNowDateTimeString());
    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      const targetTask = (s.assignedTasks || []).find(t => t.id === taskId);
      const willBeDone = targetTask ? !targetTask.done : false;

      const updatedTasks = (s.assignedTasks || []).map(t => 
        t.id === taskId ? { ...t, done: willBeDone } : t
      );

      const newActivity = targetTask ? [{
        id: `act_done_${Date.now()}`,
        time: nowReadable,
        type: 'task',
        text: willBeDone 
          ? `✅ Ödev Tamamlandı: ${targetTask.subject} (${targetTask.topic}) — ${targetTask.targetAmount} ${targetTask.targetType === 'test' ? 'Test' : 'Soru'} bitti!`
          : `↩️ Ödev tekrar "Bekliyor" olarak işaretlendi: ${targetTask.subject} (${targetTask.topic}).`
      }] : [];

      return {
        ...s,
        assignedTasks: updatedTasks,
        recentActivities: [...newActivity, ...(s.recentActivities || [])]
      };
    }));
  };

  // ================= POMODORO SAYACI STATE =================
  const [pomoMode, setPomoMode] = useState('25');
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);

  useEffect(() => {
    if (!pomoRunning) return;
    const timer = setInterval(() => {
      setPomoSecondsLeft(prev => {
        if (prev <= 1) {
          setPomoRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pomoRunning]);

  const changePomoMode = (minutes) => {
    setPomoRunning(false);
    setPomoMode(String(minutes));
    setPomoSecondsLeft(minutes * 60);
  };

  const handleLogPomodoroSession = () => {
    const minutesAdded = Number(pomoMode);
    const nowReadable = formatReadableDateTime(getNowDateTimeString());
    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      return {
        ...s,
        pomodoroMinutesTotal: (s.pomodoroMinutesTotal || 0) + minutesAdded,
        recentActivities: [
          { id: Date.now().toString(), time: nowReadable, type: 'pomodoro', text: `${minutesAdded} dakikalık Pomodoro çalışma oturumunu tamamladı.` },
          ...s.recentActivities
        ]
      };
    }));
    changePomoMode(Number(pomoMode));
    alert(`Harika! +${minutesAdded} dakika Pomodoro çalışma süren profiline ve Koç ekranına kaydedildi.`);
  };

  // ================= ÖĞRENCİ TOPLU DERS SORU GİRİŞ STATE =================
  const [subjectInputs, setSubjectInputs] = useState({});

  const handleSubjectInputChange = (subjectId, field, value) => {
    setSubjectInputs(prev => ({
      ...prev,
      [subjectId]: {
        ...(prev[subjectId] || { topic: '', D: '', Y: '', B: '' }),
        [field]: value
      }
    }));
  };

  const handleSaveAllDailyQuestions = (e) => {
    e.preventDefault();
    const nowIso = getNowDateTimeString();
    const nowReadable = formatReadableDateTime(nowIso);
    let totalQuestionsAdded = 0;
    const newLogs = [];
    const newActs = [];

    currentEngine.subjects.forEach(sub => {
      const row = subjectInputs[sub.id];
      if (!row) return;
      const d = Number(row.D) || 0;
      const y = Number(row.Y) || 0;
      const b = Number(row.B) || 0;
      const sum = d + y + b;
      if (sum > 0) {
        const net = calculateNet(d, y, currentEngine.wrongRatio);
        totalQuestionsAdded += sum;
        const chosenTopic = row.topic || sub.topics[0] || 'Genel Çözüm';
        newLogs.push({
          id: `${Date.now()}_${sub.id}`,
          isoDate: nowIso.slice(0, 10),
          date: nowReadable,
          subject: sub.name,
          topic: chosenTopic,
          correct: d,
          wrong: y,
          blank: b,
          net
        });
        newActs.push({
          id: `${Date.now()}_act_${sub.id}`,
          time: nowReadable,
          type: 'question',
          text: `${sub.name} (${chosenTopic}) dersinden ${sum} soru çözdü (${d}D / ${y}Y / ${b}B = ${net} Net).`
        });
      }
    });

    if (totalQuestionsAdded === 0) {
      alert('Lütfen en az bir dersten çözdüğün Doğru/Yanlış soru sayısını gir!');
      return;
    }

    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      return {
        ...s,
        solvedThisWeek: s.solvedThisWeek + totalQuestionsAdded,
        dailySubjectLogs: [...newLogs, ...(s.dailySubjectLogs || [])],
        recentActivities: [...newActs, ...(s.recentActivities || [])]
      };
    }));

    setSubjectInputs({});
    alert(`Tebrikler! Toplam ${totalQuestionsAdded} soru ve net bilgilerin Supabase Bulut ve Koç Paneline kaydedildi.`);
  };

  // ================= KİTAP TANIMLAMA & SAYFA GİRİŞ STATE =================
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookTotalPages, setNewBookTotalPages] = useState('');
  const [newBookTargetDays, setNewBookTargetDays] = useState('15');
  const [dailyPagesRead, setDailyPagesRead] = useState('');

  const handleSetNewBook = (e) => {
    e.preventDefault();
    if (!newBookTitle || !newBookTotalPages) return;
    const nowReadable = formatReadableDateTime(getNowDateTimeString());

    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      const updatedHistory = s.book?.title && s.book.currentPage > 0
        ? [{ title: s.book.title, totalPages: s.book.totalPages, completedDate: nowReadable }, ...(s.bookHistory || [])]
        : (s.bookHistory || []);

      return {
        ...s,
        book: {
          title: newBookTitle,
          author: newBookAuthor || 'Belirtilmedi',
          totalPages: Number(newBookTotalPages),
          currentPage: 0,
          targetDays: Number(newBookTargetDays) || 15,
          startDate: getNowDateTimeString().slice(0, 10)
        },
        bookHistory: updatedHistory,
        recentActivities: [
          { id: Date.now().toString(), time: nowReadable, type: 'reading', text: `Yeni okuma kitabı tanımladı: "${newBookTitle}" (${newBookTotalPages} Sayfa, Hedef: ${newBookTargetDays} Gün).` },
          ...(s.recentActivities || [])
        ]
      };
    }));

    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookTotalPages('');
    alert(`"${newBookTitle}" (${newBookTotalPages} sayfa) yeni okuma kitabın olarak kaydedildi!`);
  };

  const handleAddDailyReadingPages = (e) => {
    e.preventDefault();
    const pages = Number(dailyPagesRead);
    if (!pages || pages <= 0) return;
    const nowReadable = formatReadableDateTime(getNowDateTimeString());

    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      const newCurr = Math.min(s.book.totalPages, s.book.currentPage + pages);
      return {
        ...s,
        book: { ...s.book, currentPage: newCurr },
        recentActivities: [
          { id: Date.now().toString(), time: nowReadable, type: 'reading', text: `"${s.book.title}" kitabından +${pages} sayfa okudu (Güncel: ${newCurr}/${s.book.totalPages} syf).` },
          ...(s.recentActivities || [])
        ]
      };
    }));
    setDailyPagesRead('');
  };

  // ================= YENİ DENEME SINAVI GİRİŞ STATE =================
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState(getNowDateTimeString().slice(0, 10));
  const [examGroupFilter, setExamGroupFilter] = useState('ALL');
  const [examRows, setExamRows] = useState({});
  const [selectedExamForDetail, setSelectedExamForDetail] = useState(null);

  const filteredExamSubjects = currentEngine.subjects.filter(sub => {
    if (examGroupFilter === 'ALL') return true;
    return sub.group === examGroupFilter;
  });

  const handleExamRowChange = (subjectName, field, val) => {
    setExamRows(prev => ({
      ...prev,
      [subjectName]: {
        ...(prev[subjectName] || { D: '', Y: '', B: '' }),
        [field]: val
      }
    }));
  };

  const handleSaveFullExam = (e) => {
    e.preventDefault();
    if (!examTitle) {
      alert('Lütfen girdiğin deneme sınavının adını yaz (Örn: Özdebir TG-4)');
      return;
    }

    let totD = 0, totY = 0, totB = 0, totNet = 0;
    const breakdown = [];

    filteredExamSubjects.forEach(sub => {
      const r = examRows[sub.name] || { D: 0, Y: 0, B: 0 };
      const d = Number(r.D) || 0;
      const y = Number(r.Y) || 0;
      const b = r.B !== '' ? Number(r.B) : Math.max(0, sub.count - (d + y));
      const net = calculateNet(d, y, currentEngine.wrongRatio);
      totD += d;
      totY += y;
      totB += b;
      totNet += net;
      breakdown.push({ subject: sub.name, count: sub.count, D: d, Y: y, B: b, net });
    });

    totNet = Number(totNet.toFixed(2));
    const nowReadable = formatReadableDateTime(getNowDateTimeString());
    const newExamObj = {
      id: `ex_${Date.now()}`,
      name: examTitle,
      date: examDate,
      type: examGroupFilter === 'ALL' ? `${currentEngine.code} Genel` : `${examGroupFilter} Denemesi`,
      totalCorrect: totD,
      totalWrong: totY,
      totalBlank: totB,
      totalNet: totNet,
      coachNote: 'Koç değerlendirmesi bekleniyor.',
      breakdown
    };

    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      return {
        ...s,
        exams: [...(s.exams || []), newExamObj],
        recentActivities: [
          { id: Date.now().toString(), time: nowReadable, type: 'exam', text: `"${examTitle}" deneme sonucunu girdi: ${totD}D / ${totY}Y / ${totB}B = ${totNet} Net.` },
          ...(s.recentActivities || [])
        ]
      };
    }));

    setExamTitle('');
    setExamRows({});
    setSelectedExamForDetail(newExamObj.id);
    setStudentInnerTab('exam_analytics');
    alert(`"${examTitle}" denemen (${totNet} Net) başarıyla kaydedildi!`);
  };

  // ================= KOÇ: YENİ ÖĞRENCİ EKLEME =================
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    username: '',
    password: '',
    category: 'YKS_SAY',
    target: '',
    weeklyTarget: 1000,
    createdAt: getNowDateTimeString(),
    initialBookTitle: '',
    initialBookPages: 250
  });

  const handleOpenAddStudentModal = () => {
    setNewStudentForm(prev => ({ ...prev, createdAt: getNowDateTimeString() }));
    setShowAddStudentModal(true);
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.username || !newStudentForm.password) return;
    const created = {
      id: Date.now().toString(),
      name: newStudentForm.name,
      username: newStudentForm.username.trim().toLowerCase(),
      password: newStudentForm.password,
      category: newStudentForm.category,
      createdAt: newStudentForm.createdAt || getNowDateTimeString(),
      target: newStudentForm.target || 'Hedef Belirlenmedi',
      weeklyTarget: Number(newStudentForm.weeklyTarget) || 1000,
      solvedThisWeek: 0,
      pomodoroMinutesTotal: 0,
      sleepAvg: 7.5,
      screenAvg: 2.0,
      streak: 1,
      book: {
        title: newStudentForm.initialBookTitle || 'Henüz Kitap Girilmedi',
        author: '-',
        totalPages: Number(newStudentForm.initialBookPages) || 200,
        currentPage: 0,
        targetDays: 15,
        startDate: getNowDateTimeString().slice(0, 10)
      },
      bookHistory: [],
      dailySubjectLogs: [],
      recentActivities: [
        { id: Date.now().toString(), time: formatReadableDateTime(newStudentForm.createdAt), type: 'system', text: 'Öğrenci kaydı Koç tarafından oluşturuldu.' }
      ],
      assignedTasks: [],
      exams: []
    };

    setStudents([...students, created]);
    setSelectedStudentId(created.id);
    setShowAddStudentModal(false);
  };

  // ================= GİRİŞ (LOGIN) İŞLEMİ =================
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword.trim();

    if ((u === 'koc' || u === 'murat' || u === 'admin') && (p === '1234' || p === '123')) {
      setAuthSession({ role: 'coach' });
      setActiveTab('coach');
      setLoginError('');
      return;
    }

    const foundStudent = students.find(st => st.username.toLowerCase() === u && st.password === p);
    if (foundStudent) {
      setAuthSession({ role: 'student', studentId: foundStudent.id });
      setSelectedStudentId(foundStudent.id);
      setActiveTab('student');
      setLoginError('');
      return;
    }

    setLoginError('Kullanıcı adı veya şifre hatalı! (Koç için: koc / 1234 — Öğrenci için: ayca / 123)');
  };

  // ================= WHATSAPP VELİ RAPORU KOPYALAMA =================
  const handleCopyWhatsAppReport = () => {
    const periodLabel = reportPeriod === 'daily' ? 'GÜNLÜK' : reportPeriod === 'weekly' ? 'HAFTALIK' : 'AYLIK';
    const lastEx = (activeStudent.exams || [])[(activeStudent.exams || []).length - 1];
    const doneCount = (activeStudent.assignedTasks || []).filter(t => t.done).length;
    const totalTaskCount = (activeStudent.assignedTasks || []).length;

    const text = `📊 *AKADEMİGEN PRO v1 — ${periodLabel} VELİ BİLGİLENDİRME RAPORU*
👤 *Öğrenci:* ${activeStudent.name} (${currentEngine.label})
🎯 *Hedef:* ${activeStudent.target}

✅ *Çözülen Soru:* ${activeStudent.solvedThisWeek} / ${activeStudent.weeklyTarget} Soru
📚 *Okunan Kitap:* ${activeStudent.book.title} (${activeStudent.book.currentPage}/${activeStudent.book.totalPages} syf)
⏱️ *Pomodoro Odak Süresi:* ${activeStudent.pomodoroMinutesTotal || 0} dk
📌 *Ödev Tamamlama:* ${doneCount} / ${totalTaskCount} Görev Tamamlandı
📈 *Son Deneme Neti:* ${lastEx ? `${lastEx.name} ➔ ${lastEx.totalNet} Net` : 'Henüz girilmedi'}

👨‍🏫 *Koç Değerlendirmesi:* Öğrencimizin çalışma temposu ve ders bazlı soru çözümleri sistemimiz üzerinden günlük olarak takip edilmektedir.`;

    navigator.clipboard.writeText(text);
    alert('WhatsApp Veli Bilgilendirme Raporu panoya kopyalandı! Doğrudan WhatsApp\'a yapıştırabilirsiniz.');
  };

  if (!authSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">AKADEMİGEN <span className="text-emerald-400">PRO v1</span></h1>
            <p className="text-xs text-slate-400 mt-1">Öğrenci ve Koç Kullanıcı Giriş Merkezi</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Kullanıcı Adı</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="text" required placeholder="Örn: ayca veya koc"
                  value={loginUsername} onChange={e => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Şifre</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="password" required placeholder="••••••"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">{loginError}</p>
            )}

            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition cursor-pointer">
              Sisteme Giriş Yap
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 block text-center">⚡ Hızlı Test Girişleri (Tek Tıkla Dene):</span>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => { setAuthSession({ role: 'coach' }); setActiveTab('coach'); }}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs py-2 px-2 rounded-lg font-semibold cursor-pointer"
              >
                👨‍🏫 Koç Girişi
              </button>
              {students.slice(0, 2).map(st => (
                <button 
                  key={st.id}
                  onClick={() => { setAuthSession({ role: 'student', studentId: st.id }); setSelectedStudentId(st.id); setActiveTab('student'); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-2 rounded-lg font-medium truncate cursor-pointer"
                >
                  🎓 {st.name.split(' ')[0]} ({st.username})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hesaplamalar
  const remainingBookPages = Math.max(0, activeStudent.book.totalPages - activeStudent.book.currentPage);
  const dailyBookQuota = Math.ceil(remainingBookPages / Math.max(1, activeStudent.book.targetDays));
  const bookProgressPct = Math.min(100, Math.round((activeStudent.book.currentPage / Math.max(1, activeStudent.book.totalPages)) * 100));

  const examsList = activeStudent.exams || [];
  const latestExam = examsList[examsList.length - 1] || null;
  const previousExam = examsList.length >= 2 ? examsList[examsList.length - 2] : null;
  const netDiffFromPrev = latestExam && previousExam ? Number((latestExam.totalNet - previousExam.totalNet).toFixed(2)) : null;
  const inspectedExam = examsList.find(e => e.id === selectedExamForDetail) || latestExam;

  const pendingTasks = (activeStudent.assignedTasks || []).filter(t => !t.done);
  const completedTasks = (activeStudent.assignedTasks || []).filter(t => t.done);

  // Günlük / Haftalık / Aylık Grafik Verisi Üretici
  const weeklyBars = [
    { label: 'Pzt', q: 140, pages: 30 },
    { label: 'Sal', q: 165, pages: 35 },
    { label: 'Çar', q: 120, pages: 25 },
    { label: 'Per', q: 190, pages: 40 },
    { label: 'Cum', q: 155, pages: 30 },
    { label: 'Cmt', q: 210, pages: 45 },
    { label: 'Bugün', q: Math.max(85, activeStudent.solvedThisWeek % 250), pages: dailyBookQuota }
  ];

  const monthlyBars = [
    { label: '1. Hafta', q: 890, pages: 180 },
    { label: '2. Hafta', q: 1040, pages: 210 },
    { label: '3. Hafta', q: 980, pages: 195 },
    { label: 'Bu Hafta', q: activeStudent.solvedThisWeek, pages: activeStudent.book.currentPage }
  ];

  const pomoMinStr = String(Math.floor(pomoSecondsLeft / 60)).padStart(2, '0');
  const pomoSecStr = String(pomoSecondsLeft % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* ================= ÜST BAR ================= */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">AKADEMİGEN <span className="text-emerald-400">PRO v1</span></h1>
                <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${isSupabaseConfigured ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                  <Database className="w-3 h-3" />
                  {isSupabaseConfigured ? 'Supabase Bulut Aktif' : 'Yerel Mod'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-slate-800 text-slate-300 border-slate-700">
                  {authSession.role === 'coach' ? '👨‍🏫 Koç Yetkisi' : `🎓 ${activeStudent.name}`}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {authSession.role === 'coach' 
                  ? 'Tüm Öğrenciler, Ders/Konu Bazlı Ödev Motoru ve Deneme Röntgeni' 
                  : `${currentEngine.label} • Hedef: ${activeStudent.target}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {authSession.role === 'coach' && (
              <>
                <select 
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs font-semibold rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      👤 {s.name} ({EXAM_ENGINES[s.category]?.code} • @{s.username})
                    </option>
                  ))}
                </select>

                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                  <button 
                    onClick={() => setActiveTab('coach')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${activeTab === 'coach' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                  >
                    Koç Paneli
                  </button>
                  <button 
                    onClick={() => setActiveTab('student')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${activeTab === 'student' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                  >
                    Öğrenci Ekranı
                  </button>
                  <button 
                    onClick={() => setActiveTab('exams')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${activeTab === 'exams' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                  >
                    Deneme Analizi
                  </button>
                  <button 
                    onClick={() => setActiveTab('report')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${activeTab === 'report' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                  >
                    Veli Karnesi (PDF)
                  </button>
                </div>
              </>
            )}

            <button 
              onClick={() => setAuthSession(null)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Kullanıcı Değiştir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* ===================================================================== */}
        {/* 1. KOÇ KOMUTA MERKEZİ                                                 */}
        {/* ===================================================================== */}
        {authSession.role === 'coach' && activeTab === 'coach' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div>
                <h2 className="text-xl font-bold text-white">Koç Komuta Merkezi & Öğrenci Takibi</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kayıtlı öğrencilerin kayıt tarih/saatleri, haftalık soru şeritleri, okudukları kitaplar ve ders/konu bazlı ödev atama sistemi
                </p>
              </div>
              <button 
                onClick={handleOpenAddStudentModal}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                + Yeni Öğrenci Kaydet (Tarih/Saat & Şifre)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {students.map(student => {
                const eng = EXAM_ENGINES[student.category];
                const progPct = Math.min(100, Math.round((student.solvedThisWeek / Math.max(1, student.weeklyTarget)) * 100));
                const sExams = student.exams || [];
                const lastEx = sExams[sExams.length - 1];
                const prevEx = sExams.length > 1 ? sExams[sExams.length - 2] : null;
                const diff = lastEx && prevEx ? Number((lastEx.totalNet - prevEx.totalNet).toFixed(2)) : null;
                const sPendingCount = (student.assignedTasks || []).filter(t => !t.done).length;

                return (
                  <div 
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${student.id === activeStudent.id ? 'bg-slate-900 border-emerald-500/70 shadow-lg shadow-emerald-500/10' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-white flex items-center gap-2">
                          {student.name}
                          <span className="text-xs font-normal text-slate-400">(@{student.username})</span>
                        </h3>
                        <p className="text-xs text-emerald-400 font-medium mt-0.5">{student.target}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" /> Kayıt: {formatReadableDateTime(student.createdAt)}
                        </p>
                      </div>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold ${eng?.badgeColor}`}>
                        {eng?.code}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Haftalık Soru Hedefi</span>
                        <span className="font-bold text-white">{student.solvedThisWeek} / {student.weeklyTarget} (%{progPct})</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${progPct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${progPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between bg-slate-950/70 p-2 rounded-xl border border-slate-800/60">
                        <span className="text-slate-400">📚 Okuduğu Kitap:</span>
                        <span className="font-semibold text-amber-300 truncate max-w-[165px]">
                          {student.book.title} ({student.book.currentPage}/{student.book.totalPages})
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-950/70 p-2 rounded-xl border border-slate-800/60">
                        <span className="text-slate-400">📌 Bekleyen Ödev:</span>
                        <span className={`font-bold ${sPendingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {sPendingCount > 0 ? `${sPendingCount} Aktif Görev` : 'Tüm Ödevler Bitti'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-950/70 p-2 rounded-xl border border-slate-800/60">
                        <span className="text-slate-400">📊 Son Deneme:</span>
                        {lastEx ? (
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {lastEx.totalNet} Net
                            {diff !== null && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${diff >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {diff >= 0 ? `+${diff}` : diff}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-500">Henüz girilmedi</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {activeStudent.name} — Son Girdiği Bilgiler ve Aktivite Akışı
                    </h3>
                    <p className="text-xs text-slate-400">Öğrencinin girdiği son sorular, tamamladığı ödevler, kitap sayfaları ve denemeler</p>
                  </div>
                  <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-emerald-400 font-semibold">
                    ⏱️ Pomodoro: {activeStudent.pomodoroMinutesTotal || 0} dk
                  </span>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {(activeStudent.recentActivities || []).map(act => (
                    <div key={act.id} className="flex items-start justify-between gap-3 bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5">
                          {act.type === 'question' ? '✏️' : act.type === 'reading' ? '📚' : act.type === 'exam' ? '📊' : act.type === 'task' ? '📌' : '⏱️'}
                        </span>
                        <span className="text-slate-200 font-medium">{act.text}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">{act.time}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ders Bazlı Son Soru Girişleri</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2">Tarih / Saat</th>
                          <th className="py-2">Ders</th>
                          <th className="py-2">Konu</th>
                          <th className="py-2 text-center">D / Y / B</th>
                          <th className="py-2 text-right">Net</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {(activeStudent.dailySubjectLogs || []).slice(0, 6).map(log => (
                          <tr key={log.id}>
                            <td className="py-2 text-slate-400">{log.date}</td>
                            <td className="py-2 font-semibold text-white">{log.subject}</td>
                            <td className="py-2 text-slate-300">{log.topic}</td>
                            <td className="py-2 text-center">
                              <span className="text-emerald-400 font-bold">{log.correct}D</span> / <span className="text-rose-400 font-bold">{log.wrong}Y</span> / <span className="text-slate-400">{log.blank}B</span>
                            </td>
                            <td className="py-2 text-right font-bold text-emerald-400">{log.net} Net</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-amber-400" />
                      Haftalık Görev & Ödev Ata
                    </h3>
                    <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${currentEngine.badgeColor}`}>
                      {currentEngine.code} Müfredatı
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    <strong>{activeStudent.name}</strong> için Ders ➔ Konu seçip Soru veya Test hedefi belirleyin.
                  </p>

                  <form onSubmit={handleAssignStructuredTask} className="space-y-3 bg-slate-950/90 border border-slate-800 p-4 rounded-2xl mb-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">1. Ders Seçin ({currentEngine.code})</label>
                      <select 
                        value={taskSubjectName}
                        onChange={(e) => handleTaskSubjectChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                      >
                        {currentEngine.subjects.map(sub => (
                          <option key={sub.id} value={sub.name}>
                            [{sub.group}] {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">2. Konu Seçin</label>
                      <select 
                        value={taskTopicName}
                        onChange={(e) => setTaskTopicName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-medium"
                      >
                        {(selectedTaskSubjectObj?.topics || []).map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">3. Hedef Türü</label>
                        <div className="grid grid-cols-2 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
                          <button 
                            type="button"
                            onClick={() => { setTaskTargetType('question'); setTaskTargetAmount('60'); }}
                            className={`py-1.5 rounded-lg font-bold transition cursor-pointer ${taskTargetType === 'question' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'}`}
                          >
                            Soru Sayısı
                          </button>
                          <button 
                            type="button"
                            onClick={() => { setTaskTargetType('test'); setTaskTargetAmount('4'); }}
                            className={`py-1.5 rounded-lg font-bold transition cursor-pointer ${taskTargetType === 'test' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'}`}
                          >
                            Test Sayısı
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          {taskTargetType === 'test' ? 'Kaç Test Çözülecek?' : 'Kaç Soru Çözülecek?'}
                        </label>
                        <input 
                          type="number" min="1" required
                          value={taskTargetAmount}
                          onChange={(e) => setTaskTargetAmount(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Teslim Zamanı / Gün</label>
                        <input 
                          type="text"
                          value={taskDueDate}
                          onChange={(e) => setTaskDueDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Öğrenciye Özel Koç Notu / Mesajı</label>
                        <input 
                          type="text"
                          value={taskCoachNote}
                          onChange={(e) => setTaskCoachNote(e.target.value)}
                          placeholder="Örn: Önce konu özetini oku, sonra 3D Soru Bankasından çöz."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs py-2.5 transition cursor-pointer">
                      📬 Öğrenciye Ödevi & Görev Mesajını Gönder
                    </button>
                  </form>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">
                      Atanan Görevler ({pendingTasks.length} Bekleyen / {completedTasks.length} Tamamlanan)
                    </span>
                    {(activeStudent.assignedTasks || []).map(task => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTaskDone(task.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition ${task.done ? 'bg-slate-950/40 border-slate-800/60 opacity-60' : 'bg-slate-950 border-amber-500/40 hover:border-amber-400'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white">
                            {task.done ? '✅' : '⏳'} {task.subject} ➔ <span className="text-amber-300">{task.topic}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                            {task.targetAmount} {task.targetType === 'test' ? 'Test' : 'Soru'}
                          </span>
                        </div>
                        {task.coachNote && (
                          <p className="text-[11px] text-slate-400 mt-1">💬 "{task.coachNote}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 2. ÖĞRENCİ KİŞİSEL ÜSSÜ                                               */}
        {/* ===================================================================== */}
        {(authSession.role === 'student' || activeTab === 'student') && (
          <div className="space-y-6">
            
            {/* KOÇTAN GELEN ÖDEV & GÖREV MESAJ KUTUSU */}
            <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-5 shadow-lg shadow-amber-500/5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-black text-white">📬 Koçundan Ödevlerin & Haftalık Görev Mesajların</h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                        {pendingTasks.length} Bekleyen Görev
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Koçunun senin için belirlediği ders/konu hedefleri aşağıdadır. Tamamladığın ödevin yanındaki butona tıkla!
                    </p>
                  </div>
                </div>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Harika! Koçunun verdiği tüm haftalık görev ve ödevleri tamamladın!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="bg-slate-950/90 border border-amber-500/40 p-4 rounded-xl flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-black text-amber-400 uppercase">{task.subject}</span>
                          <span className="text-[11px] bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full">
                            🎯 Hedef: {task.targetAmount} {task.targetType === 'test' ? 'Test' : 'Soru'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{task.topic}</h4>
                        {task.coachNote && (
                          <div className="mt-2 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300">
                            <span className="text-amber-400 font-bold block text-[10px] uppercase">💬 Koçunun Mesajı:</span>
                            "{task.coachNote}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-400">📅 Teslim: <strong className="text-slate-200">{task.dueDate}</strong></span>
                        <button 
                          onClick={() => toggleTaskDone(task.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                        >
                          ✓ Ödevi Tamamladım
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* POMODORO + HAFTALIK ŞERİT + OKUNAN KİTAP */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Pomodoro Çalışma Sayacı
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => changePomoMode(25)} className={`text-[11px] px-2 py-0.5 rounded cursor-pointer ${pomoMode === '25' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>25 dk</button>
                    <button onClick={() => changePomoMode(50)} className={`text-[11px] px-2 py-0.5 rounded cursor-pointer ${pomoMode === '50' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>50 dk</button>
                    <button onClick={() => changePomoMode(5)} className={`text-[11px] px-2 py-0.5 rounded cursor-pointer ${pomoMode === '5' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>5 dk Mola</button>
                  </div>
                </div>

                <div className="my-4 text-center">
                  <div className="text-4xl font-black tracking-widest text-white font-mono">
                    {pomoMinStr}:{pomoSecStr}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Derse başlarken sayacı başlat, bitince süreyi profiline kaydet!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPomoRunning(!pomoRunning)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${pomoRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'}`}
                  >
                    {pomoRunning ? <><Pause className="w-4 h-4" /> Duraklat</> : <><Play className="w-4 h-4" /> Başlat</>}
                  </button>
                  <button 
                    onClick={() => changePomoMode(Number(pomoMode))}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleLogPomodoroSession}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    + Süreyi Kaydet
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Haftalık Soru Hedefi</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      🔥 {activeStudent.streak} Gün Seri
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">
                    {activeStudent.solvedThisWeek} <span className="text-sm font-normal text-slate-400">/ {activeStudent.weeklyTarget} Soru</span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 border border-slate-800 rounded-full overflow-hidden my-3">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((activeStudent.solvedThisWeek / Math.max(1, activeStudent.weeklyTarget)) * 100))}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex justify-between pt-2 border-t border-slate-800">
                  <span>Toplam Odak Süresi: <strong className="text-white">{activeStudent.pomodoroMinutesTotal || 0} dk</strong></span>
                  <span>Kalan Hedef: <strong className="text-emerald-400">{Math.max(0, activeStudent.weeklyTarget - activeStudent.solvedThisWeek)} Soru</strong></span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Okuduğum Kitap
                    </span>
                    <button 
                      onClick={() => setStudentInnerTab('book')}
                      className="text-[11px] text-amber-400 underline hover:text-amber-300 cursor-pointer"
                    >
                      Kitap Değiştir / Yeni Ekle
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1 truncate">{activeStudent.book.title}</h3>
                  <p className="text-xs text-slate-400">
                    Okunan: <strong className="text-white">{activeStudent.book.currentPage}</strong> / {activeStudent.book.totalPages} Sayfa (%{bookProgressPct}) • Günlük Kota: <strong className="text-amber-400">{dailyBookQuota} syf</strong>
                  </p>
                  <div className="w-full h-2.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden my-2.5">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${bookProgressPct}%` }} />
                  </div>
                </div>

                <form onSubmit={handleAddDailyReadingPages} className="flex gap-2">
                  <input 
                    type="number" min="1" placeholder="Bugün kaç sayfa okudun?"
                    value={dailyPagesRead} onChange={e => setDailyPagesRead(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer">
                    + Sayfa Ekle
                  </button>
                </form>
              </div>
            </div>

            {/* ÖĞRENCİ İÇ SEKME MENÜSÜ */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              <button 
                onClick={() => setStudentInnerTab('daily')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${studentInnerTab === 'daily' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
              >
                ✏️ 1. Günlük Ders & Soru Girişi ({currentEngine.subjects.length} Ders)
              </button>
              <button 
                onClick={() => setStudentInnerTab('charts')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${studentInnerTab === 'charts' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
              >
                📈 2. Günlük / Haftalık / Aylık Çalışma Grafiğim
              </button>
              <button 
                onClick={() => setStudentInnerTab('exam_entry')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${studentInnerTab === 'exam_entry' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
              >
                📝 3. Yeni Deneme Sonucu Gir
              </button>
              <button 
                onClick={() => setStudentInnerTab('exam_analytics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${studentInnerTab === 'exam_analytics' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
              >
                📊 4. Deneme Analizlerim & Grafikler
              </button>
              <button 
                onClick={() => setStudentInnerTab('book')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${studentInnerTab === 'book' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
              >
                📚 5. Kitap Tanımla & Okuma Hedefi
              </button>
            </div>

            {/* SEKME 1: HER DERS İÇİN GÜNLÜK SORU GİRİŞ TABLOSU */}
            {studentInnerTab === 'daily' && (
              <form onSubmit={handleSaveAllDailyQuestions} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">Günlük Ders Bazlı Soru Çözüm Çizelgesi ({currentEngine.label})</h3>
                    <p className="text-xs text-slate-400">
                      Bugün hangi derslerden soru çözdüysen karşısına Konu, Doğru, Yanlış ve Boş sayılarını gir; sistem netini ({currentEngine.wrongRatio} Yanlış = 1 Doğru) otomatik hesaplar.
                    </p>
                  </div>
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer">
                    💾 Tüm Girilen Dersleri Kaydet
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                        <th className="p-3">Grup</th>
                        <th className="p-3">Ders Adı</th>
                        <th className="p-3">Çalışılan Konu Seçimi</th>
                        <th className="p-3 text-center w-24">Doğru</th>
                        <th className="p-3 text-center w-24">Yanlış</th>
                        <th className="p-3 text-center w-24">Boş</th>
                        <th className="p-3 text-center w-24">Toplam Soru</th>
                        <th className="p-3 text-right w-24">Net</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {currentEngine.subjects.map(sub => {
                        const row = subjectInputs[sub.id] || { topic: '', D: '', Y: '', B: '' };
                        const d = Number(row.D) || 0;
                        const y = Number(row.Y) || 0;
                        const b = Number(row.B) || 0;
                        const totalQ = d + y + b;
                        const netVal = calculateNet(d, y, currentEngine.wrongRatio);

                        return (
                          <tr key={sub.id} className={totalQ > 0 ? 'bg-emerald-500/5' : 'hover:bg-slate-950/40'}>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">{sub.group}</span>
                            </td>
                            <td className="p-2.5 font-bold text-white">{sub.name}</td>
                            <td className="p-2.5">
                              <select 
                                value={row.topic}
                                onChange={e => handleSubjectInputChange(sub.id, 'topic', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                              >
                                {sub.topics.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2.5">
                              <input 
                                type="number" min="0" placeholder="0"
                                value={row.D} onChange={e => handleSubjectInputChange(sub.id, 'D', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-center font-bold text-emerald-400"
                              />
                            </td>
                            <td className="p-2.5">
                              <input 
                                type="number" min="0" placeholder="0"
                                value={row.Y} onChange={e => handleSubjectInputChange(sub.id, 'Y', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-center font-bold text-rose-400"
                              />
                            </td>
                            <td className="p-2.5">
                              <input 
                                type="number" min="0" placeholder="0"
                                value={row.B} onChange={e => handleSubjectInputChange(sub.id, 'B', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-center text-slate-300"
                              />
                            </td>
                            <td className="p-2.5 text-center font-bold text-white">{totalQ > 0 ? `${totalQ} Soru` : '-'}</td>
                            <td className="p-2.5 text-right font-black text-emerald-400">{totalQ > 0 ? `${netVal} Net` : '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </form>
            )}

            {/* SEKME 2: GÜNLÜK / HAFTALIK / AYLIK ÇALIŞMA VE OKUMA GRAFİĞİ */}
            {studentInnerTab === 'charts' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      Günlük, Haftalık ve Aylık Çalışma Grafiğim
                    </h3>
                    <p className="text-xs text-slate-400">Çözdüğün soruların ve okuduğun kitap sayfalarının zamana göre dağılımı</p>
                  </div>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button onClick={() => setChartPeriod('daily')} className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${chartPeriod === 'daily' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'}`}>Günlük (Ders Dağılımı)</button>
                    <button onClick={() => setChartPeriod('weekly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${chartPeriod === 'weekly' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'}`}>Haftalık (Son 7 Gün)</button>
                    <button onClick={() => setChartPeriod('monthly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${chartPeriod === 'monthly' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'}`}>Aylık (4 Hafta)</button>
                  </div>
                </div>

                {chartPeriod === 'daily' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Son Çözülen Ders & Konu Dağılımı</h4>
                    {(activeStudent.dailySubjectLogs || []).map(log => {
                      const total = log.correct + log.wrong + log.blank;
                      const pct = Math.min(100, Math.round((total / 60) * 100));
                      return (
                        <div key={log.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-white">{log.subject} — <span className="text-emerald-400">{log.topic}</span></span>
                            <span className="text-slate-300 font-bold">{total} Soru ({log.net} Net) • <span className="text-slate-500">{log.date}</span></span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {(chartPeriod === 'weekly' || chartPeriod === 'monthly') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                      <h4 className="text-xs font-bold uppercase text-emerald-400 mb-4">
                        📊 {chartPeriod === 'weekly' ? 'Haftalık Gün Gün Soru Çözüm Grafiği' : 'Aylık Hafta Bazlı Soru Çözüm Grafiği'}
                      </h4>
                      <div className="flex items-end gap-3 h-48 pt-6">
                        {(chartPeriod === 'weekly' ? weeklyBars : monthlyBars).map((item, idx) => {
                          const maxVal = chartPeriod === 'weekly' ? 250 : 1200;
                          const hPct = Math.min(100, Math.max(15, Math.round((item.q / maxVal) * 100)));
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                              <span className="text-[11px] font-bold text-white mb-1">{item.q}</span>
                              <div className="w-full bg-emerald-500 rounded-t-xl transition-all" style={{ height: `${hPct}%` }} />
                              <span className="text-[11px] text-slate-400 mt-2">{item.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                      <h4 className="text-xs font-bold uppercase text-amber-400 mb-4">
                        📚 {chartPeriod === 'weekly' ? 'Haftalık Kitap Okuma Sayfa Grafiği' : 'Aylık Kitap Okuma Sayfa Grafiği'}
                      </h4>
                      <div className="flex items-end gap-3 h-48 pt-6">
                        {(chartPeriod === 'weekly' ? weeklyBars : monthlyBars).map((item, idx) => {
                          const maxVal = chartPeriod === 'weekly' ? 60 : 300;
                          const hPct = Math.min(100, Math.max(15, Math.round((item.pages / maxVal) * 100)));
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                              <span className="text-[11px] font-bold text-amber-300 mb-1">{item.pages} syf</span>
                              <div className="w-full bg-amber-400 rounded-t-xl transition-all" style={{ height: `${hPct}%` }} />
                              <span className="text-[11px] text-slate-400 mt-2">{item.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEKME 3: YENİ DENEME SINAVI GİRİŞİ */}
            {studentInnerTab === 'exam_entry' && (
              <form onSubmit={handleSaveFullExam} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Deneme Sınavı Sonucu Girişi (Ders Bazlı Analiz)</h3>
                    <p className="text-xs text-slate-400">Her dersin Doğru, Yanlış ve Boş sayılarını ayrı ayrı gir; deneme karnen ve karşılaştırma grafiğin otomatik oluşsun.</p>
                  </div>
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer">
                    📊 Denemeyi Kaydet ve Grafiği Oluştur
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Deneme Adı / Yayın</label>
                    <input 
                      type="text" required placeholder="Örn: 3D Türkiye Geneli Deneme - 4"
                      value={examTitle} onChange={e => setExamTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Deneme Tarihi</label>
                    <input 
                      type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Sınav Türü Filtresi</label>
                    <select 
                      value={examGroupFilter} onChange={e => setExamGroupFilter(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="ALL">Tüm Dersler ({currentEngine.code})</option>
                      {activeStudent.category.startsWith('YKS') && (
                        <>
                          <option value="TYT">Sadece TYT Denemesi (120 Soru)</option>
                          <option value="AYT">Sadece AYT Denemesi (80 Soru)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                        <th className="p-3">Ders Adı</th>
                        <th className="p-3 text-center">Soru Sayısı</th>
                        <th className="p-3 text-center w-28">Doğru</th>
                        <th className="p-3 text-center w-28">Yanlış</th>
                        <th className="p-3 text-center w-28">Boş</th>
                        <th className="p-3 text-right w-28">Hesaplanan Net</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {filteredExamSubjects.map(sub => {
                        const r = examRows[sub.name] || { D: '', Y: '', B: '' };
                        const d = Number(r.D) || 0;
                        const y = Number(r.Y) || 0;
                        const b = r.B !== '' ? Number(r.B) : Math.max(0, sub.count - (d + y));
                        const net = calculateNet(d, y, currentEngine.wrongRatio);

                        return (
                          <tr key={sub.id}>
                            <td className="p-2.5 font-bold text-white">{sub.name}</td>
                            <td className="p-2.5 text-center text-slate-400">{sub.count} Soru</td>
                            <td className="p-2.5">
                              <input 
                                type="number" min="0" max={sub.count} placeholder="0"
                                value={r.D} onChange={e => handleExamRowChange(sub.name, 'D', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-center font-bold text-emerald-400"
                              />
                            </td>
                            <td className="p-2.5">
                              <input 
                                type="number" min="0" max={sub.count} placeholder="0"
                                value={r.Y} onChange={e => handleExamRowChange(sub.name, 'Y', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-center font-bold text-rose-400"
                              />
                            </td>
                            <td className="p-2.5">
                              <input 
                                type="number" min="0" max={sub.count} placeholder={String(b)}
                                value={r.B} onChange={e => handleExamRowChange(sub.name, 'B', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-center text-slate-400"
                              />
                            </td>
                            <td className="p-2.5 text-right font-black text-emerald-400">{net} Net</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </form>
            )}

            {/* SEKME 5: ÖĞRENCİ KİTAP TANIMLAMA */}
            {studentInnerTab === 'book' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form onSubmit={handleSetNewBook} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    Yeni Okuma Kitabı Tanımla / Değiştir
                  </h3>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Kitap Adı</label>
                    <input 
                      type="text" required placeholder="Örn: Beyaz Zambaklar Ülkesinde"
                      value={newBookTitle} onChange={e => setNewBookTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Yazar (Opsiyonel)</label>
                    <input 
                      type="text" placeholder="Örn: Grigory Petrov"
                      value={newBookAuthor} onChange={e => setNewBookAuthor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Toplam Sayfa Sayısı</label>
                      <input 
                        type="number" required min="10" placeholder="Örn: 240"
                        value={newBookTotalPages} onChange={e => setNewBookTotalPages(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Hedef Bitirme Süresi (Gün)</label>
                      <input 
                        type="number" required min="1" value={newBookTargetDays} onChange={e => setNewBookTargetDays(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs cursor-pointer">
                    Kitabı Kaydet ve Hedefi Başlat
                  </button>
                </form>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-white">Mevcut Kitap Durumu & Bitirilen Kitaplar</h3>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Aktif Kitap:</span>
                      <span className="font-bold text-amber-400">{activeStudent.book.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">İlerleme:</span>
                      <span className="font-bold text-white">{activeStudent.book.currentPage} / {activeStudent.book.totalPages} Sayfa (%{bookProgressPct})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Günlük Okuma Hedefi:</span>
                      <span className="font-bold text-emerald-400">{dailyBookQuota} Sayfa / Gün</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* 3. DENEME ANALİZİ, GRAFİKLER VE ÖNCEKİ/SONRAKİ KARŞILAŞTIRMA MERKEZİ    */}
        {/* ===================================================================== */}
        {(activeTab === 'exams' || ((authSession.role === 'student' || activeTab === 'student') && studentInnerTab === 'exam_analytics')) && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-400" />
                      {activeStudent.name} — Genel Deneme Net Gelişim Grafiği
                    </h3>
                    <p className="text-xs text-slate-400">Her bir sütuna tıklayarak o denemenin kendi ders bazlı grafiğini aşağıda inceleyebilirsin</p>
                  </div>
                  {netDiffFromPrev !== null && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${netDiffFromPrev >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                      Son Deneme Farkı: {netDiffFromPrev >= 0 ? `+${netDiffFromPrev} Net Artış 📈` : `${netDiffFromPrev} Net Düşüş 📉`}
                    </span>
                  )}
                </div>

                {examsList.length === 0 ? (
                  <p className="text-xs text-slate-500 py-8 text-center">Henüz kayıtlı deneme sınavı bulunmuyor.</p>
                ) : (
                  <div className="flex items-end gap-4 h-52 pt-6 px-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                    {examsList.map((ex, i) => {
                      const maxPossible = activeStudent.category === 'LGS' ? 90 : 120;
                      const heightPct = Math.min(100, Math.max(15, Math.round((ex.totalNet / maxPossible) * 100)));
                      const prevNet = i > 0 ? examsList[i - 1].totalNet : null;
                      const stepDiff = prevNet !== null ? Number((ex.totalNet - prevNet).toFixed(2)) : null;
                      const isSelected = inspectedExam?.id === ex.id;

                      return (
                        <div 
                          key={ex.id} 
                          onClick={() => setSelectedExamForDetail(ex.id)}
                          className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                        >
                          {stepDiff !== null && (
                            <span className={`text-[10px] font-bold mb-1 ${stepDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {stepDiff >= 0 ? `+${stepDiff}` : stepDiff}
                            </span>
                          )}
                          <span className="text-xs font-black text-white mb-1">{ex.totalNet} Net</span>
                          <div 
                            className={`w-full max-w-[64px] rounded-t-xl transition-all ${isSelected ? 'bg-emerald-400 shadow-lg shadow-emerald-500/30' : 'bg-emerald-600/60 group-hover:bg-emerald-500'}`}
                            style={{ height: `${heightPct}%` }}
                          />
                          <span className="text-[11px] font-semibold text-slate-300 mt-2 truncate max-w-[110px]">{ex.name}</span>
                          <span className="text-[10px] text-slate-500 pb-2">{ex.date}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-1">Önceki vs. Son Deneme Kıyaslaması</h3>
                <p className="text-xs text-slate-400 mb-4">
                  {previousExam && latestExam ? `${previousExam.name} ➔ ${latestExam.name}` : 'En az 2 deneme girildiğinde ders bazlı +/- farklar burada görünür'}
                </p>

                {previousExam && latestExam ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {latestExam.breakdown.map((item, idx) => {
                      const prevItem = previousExam.breakdown.find(p => p.subject === item.subject);
                      const dNet = prevItem ? Number((item.net - prevItem.net).toFixed(2)) : 0;
                      return (
                        <div key={idx} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                          <span className="font-semibold text-slate-200">{item.subject}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">{prevItem?.net ?? 0} ➔ <strong className="text-white">{item.net}</strong></span>
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${dNet > 0 ? 'bg-emerald-500/20 text-emerald-400' : dNet < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                              {dNet > 0 ? `+${dNet}` : dNet}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    Karşılaştırma için en az 2 deneme sonucu gereklidir.
                  </div>
                )}
              </div>
            </div>

            {inspectedExam && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-400">Seçili Deneme Röntgeni</span>
                    <h3 className="text-lg font-bold text-white">{inspectedExam.name} ({inspectedExam.date})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {examsList.map(ex => (
                      <button 
                        key={ex.id}
                        onClick={() => setSelectedExamForDetail(ex.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${inspectedExam.id === ex.id ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                      >
                        {ex.name} ({ex.totalNet} Net)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ders Bazlı Net ve Başarı Oranı Grafiği</h4>
                    {inspectedExam.breakdown.map((b, i) => {
                      const pct = Math.min(100, Math.max(0, Math.round((b.net / Math.max(1, b.count)) * 100)));
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-200">{b.subject}</span>
                            <span className="text-slate-400">
                              <strong className="text-emerald-400">{b.D}D</strong> / <strong className="text-rose-400">{b.Y}Y</strong> / {b.B}B ➔ <strong className="text-white">{b.net} Net</strong> (%{pct})
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-rose-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Deneme Özet Metrikleri</h4>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] text-slate-400 block">Doğru</span>
                          <span className="text-lg font-black text-emerald-400">{inspectedExam.totalCorrect}</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] text-slate-400 block">Yanlış</span>
                          <span className="text-lg font-black text-rose-400">{inspectedExam.totalWrong}</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] text-slate-400 block">Boş</span>
                          <span className="text-lg font-black text-slate-300">{inspectedExam.totalBlank}</span>
                        </div>
                        <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                          <span className="text-[11px] text-emerald-300 block">Toplam Net</span>
                          <span className="text-lg font-black text-emerald-400">{inspectedExam.totalNet}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
                      <span className="font-bold text-amber-400 block mb-1">👨‍🏫 Koçun Deneme Yorumu:</span>
                      <p className="text-slate-300 leading-relaxed">{inspectedExam.coachNote}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* 4. VELİ KARNESİ VE A4 PDF / WHATSAPP RAPOR MERKEZİ                    */}
        {/* ===================================================================== */}
        {activeTab === 'report' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Üst Kontrol Çubuğu (Yazdırırken Gizlenir) */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Rapor Periyodu:</span>
                <button onClick={() => setReportPeriod('daily')} className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${reportPeriod === 'daily' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Günlük Çıktı</button>
                <button onClick={() => setReportPeriod('weekly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${reportPeriod === 'weekly' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Haftalık Çıktı</button>
                <button onClick={() => setReportPeriod('monthly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${reportPeriod === 'monthly' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Aylık Çıktı</button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyWhatsAppReport}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  WhatsApp Veli Metnini Kopyala
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-white text-slate-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  A4 PDF Olarak Yazdır / İndir
                </button>
              </div>
            </div>

            {/* A4 Kağıdı Görünümü */}
            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl space-y-6">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                    AKADEMİGEN PRO v1 • {reportPeriod === 'daily' ? 'GÜNLÜK' : reportPeriod === 'weekly' ? 'HAFTALIK' : 'AYLIK'} RESMİ VELİ & ÖĞRENCİ KARNESİ
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">{activeStudent.name} — Akademik Takip Raporu</h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Sınav Grubu: {currentEngine.label} | Hedef: {activeStudent.target} | Kayıt Tarihi: {formatReadableDateTime(activeStudent.createdAt)}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>Rapor Tarihi</div>
                  <div className="font-bold text-slate-900">{formatReadableDateTime(getNowDateTimeString())}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="border border-slate-200 p-3.5 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-500 block">
                    {reportPeriod === 'daily' ? 'Bugün Çözülen Soru' : reportPeriod === 'weekly' ? 'Haftalık Soru' : 'Aylık Toplam Soru'}
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {reportPeriod === 'daily' ? `${Math.max(85, activeStudent.solvedThisWeek % 200)} Soru` : reportPeriod === 'weekly' ? `${activeStudent.solvedThisWeek} / ${activeStudent.weeklyTarget}` : `${activeStudent.solvedThisWeek * 4} Soru`}
                  </span>
                </div>
                <div className="border border-slate-200 p-3.5 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-500 block">Okunan Kitap ({activeStudent.book.title})</span>
                  <span className="text-lg font-black text-slate-900">{activeStudent.book.currentPage} / {activeStudent.book.totalPages} syf</span>
                </div>
                <div className="border border-slate-200 p-3.5 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-500 block">Ödev Tamamlama</span>
                  <span className="text-lg font-black text-slate-900">{completedTasks.length} / {(activeStudent.assignedTasks || []).length} Görev</span>
                </div>
                <div className="border border-slate-200 p-3.5 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-500 block">Son Deneme Neti</span>
                  <span className="text-lg font-black text-emerald-700">{latestExam ? `${latestExam.totalNet} Net` : '-'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Atanan Ders/Konu Ödevleri ve Tamamlanma Durumu</h4>
                <table className="w-full text-xs border border-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2 text-left">Ders & Konu</th>
                      <th className="p-2 text-center">Hedef Miktar</th>
                      <th className="p-2 text-left">Koç Notu</th>
                      <th className="p-2 text-right">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(activeStudent.assignedTasks || []).map(t => (
                      <tr key={t.id}>
                        <td className="p-2 font-semibold">{t.subject} — {t.topic}</td>
                        <td className="p-2 text-center font-bold">{t.targetAmount} {t.targetType === 'test' ? 'Test' : 'Soru'}</td>
                        <td className="p-2 text-slate-600">{t.coachNote}</td>
                        <td className="p-2 text-right font-bold">{t.done ? '✅ Tamamlandı' : '⏳ Devam Ediyor'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {latestExam && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Son Deneme Sınavı ({latestExam.name}) Ders Karnesi</h4>
                  <table className="w-full text-xs border border-slate-200">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 text-left">Ders</th>
                        <th className="p-2 text-center">Doğru</th>
                        <th className="p-2 text-center">Yanlış</th>
                        <th className="p-2 text-center">Boş</th>
                        <th className="p-2 text-right">Net</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {latestExam.breakdown.map((b, i) => (
                        <tr key={i}>
                          <td className="p-2 font-semibold">{b.subject}</td>
                          <td className="p-2 text-center text-emerald-700 font-bold">{b.D}</td>
                          <td className="p-2 text-center text-rose-600 font-bold">{b.Y}</td>
                          <td className="p-2 text-center">{b.B}</td>
                          <td className="p-2 text-right font-black">{b.net}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* YENİ ÖĞRENCİ KAYIT MODALI */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Yeni Öğrenci Kaydı & Şifre Tanımlama</h3>
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Öğrenci Adı Soyadı</label>
                <input 
                  type="text" required placeholder="Örn: Burak Yılmaz"
                  value={newStudentForm.name} onChange={e => setNewStudentForm({...newStudentForm, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Giriş Kullanıcı Adı</label>
                  <input 
                    type="text" required placeholder="Örn: burak"
                    value={newStudentForm.username} onChange={e => setNewStudentForm({...newStudentForm, username: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Giriş Şifresi</label>
                  <input 
                    type="text" required placeholder="Örn: 1234"
                    value={newStudentForm.password} onChange={e => setNewStudentForm({...newStudentForm, password: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Sınav / Sınıf Grubu</label>
                  <select 
                    value={newStudentForm.category} onChange={e => setNewStudentForm({...newStudentForm, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {Object.values(EXAM_ENGINES).map(eng => (
                      <option key={eng.code} value={eng.code}>{eng.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Kayıt Tarihi ve Saati (Otomatik/Manuel)</label>
                  <input 
                    type="datetime-local"
                    value={newStudentForm.createdAt}
                    onChange={e => setNewStudentForm({...newStudentForm, createdAt: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Hedef Okul / Puan</label>
                  <input 
                    type="text" placeholder="Örn: ODTÜ Bilgisayar / 510 Puan"
                    value={newStudentForm.target} onChange={e => setNewStudentForm({...newStudentForm, target: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Haftalık Soru Hedefi</label>
                  <input 
                    type="number" value={newStudentForm.weeklyTarget} onChange={e => setNewStudentForm({...newStudentForm, weeklyTarget: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddStudentModal(false)} className="px-4 py-2 text-slate-400">İptal</button>
                <button type="submit" className="bg-emerald-500 text-slate-950 font-bold px-5 py-2 rounded-xl cursor-pointer">Öğrenciyi Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}