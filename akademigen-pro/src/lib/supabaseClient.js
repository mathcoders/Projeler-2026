// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Supabase'den öğrencileri çek
export const fetchStudentsFromCloud = async (initialStudents) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('students_data')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Supabase veri çekme hatası:', error.message);
    return null;
  }

  if (!data || data.length === 0) {
    await syncStudentsToCloud(initialStudents);
    return initialStudents;
  }

  return data.map(row => ({
    id: row.id,
    name: row.name,
    username: row.username,
    password: row.password,
    category: row.category,
    createdAt: row.created_at,
    target: row.target,
    weeklyTarget: row.weekly_target,
    solvedThisWeek: row.solved_this_week,
    pomodoroMinutesTotal: row.pomodoro_minutes_total,
    sleepAvg: Number(row.sleep_avg),
    screenAvg: Number(row.screen_avg),
    streak: row.streak,
    book: row.book || {},
    bookHistory: row.book_history || [],
    dailySubjectLogs: row.daily_subject_logs || [],
    recentActivities: row.recent_activities || [],
    assignedTasks: row.assigned_tasks || [],
    exams: row.exams || []
  }));
};

// Değişiklikleri Supabase buluta senkronize et
export const syncStudentsToCloud = async (studentsArray) => {
  if (!supabase || !studentsArray) return;

  const rows = studentsArray.map(s => ({
    id: String(s.id),
    name: s.name,
    username: s.username,
    password: s.password,
    category: s.category,
    created_at: s.createdAt,
    target: s.target,
    weekly_target: Number(s.weeklyTarget) || 1000,
    solved_this_week: Number(s.solvedThisWeek) || 0,
    pomodoro_minutes_total: Number(s.pomodoroMinutesTotal) || 0,
    sleep_avg: Number(s.sleepAvg) || 7.5,
    screen_avg: Number(s.screenAvg) || 2.0,
    streak: Number(s.streak) || 1,
    book: s.book || {},
    book_history: s.bookHistory || [],
    daily_subject_logs: s.dailySubjectLogs || [],
    recentActivities: s.recentActivities || [],
    assigned_tasks: s.assignedTasks || [],
    exams: s.exams || [],
    updated_at: new Date().toISOString()
  }));

  const { error } = await supabase
    .from('students_data')
    .upsert(rows, { onConflict: 'id' });

  if (error) {
    console.error('Supabase senkronizasyon hatası:', error.message);
  }
};