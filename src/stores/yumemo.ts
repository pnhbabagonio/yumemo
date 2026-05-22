import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addDays, daysBetween, fromDateKey, toDateKey } from "@/lib/date";


type PersistStorage = {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
};

const memoryStorage = (): PersistStorage => {
  const values = new Map<string, string>();
  return {
    getItem: (name) => values.get(name) ?? null,
    setItem: (name, value) => values.set(name, value),
    removeItem: (name) => values.delete(name),
  };
};

const storage = createJSONStorage(() =>
  typeof window === "undefined" ? memoryStorage() : window.localStorage,
);

const makeId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export type Subject = {
  id: string;
  name: string;
  shortName: string;
  badgeClass: string;
  softClass: string;
  dotClass: string;
};

export type TaskType = "assignment" | "quiz" | "exam" | "project" | "study session";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "not-started" | "ongoing" | "completed";
export type ReminderTiming = "7d" | "3d" | "1d" | "same-day" | "overdue";
export type RecurringFrequency = "none" | "daily" | "weekly" | "monthly";

export type Subtask = {
  id: string;
  title: string;
  done: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  type: TaskType;
  dueDate: string;
  targetStudyDate: string;
  priority: TaskPriority;
  progress: number;
  status: TaskStatus;
  subtasks: Subtask[];
  estimatedHours: number;
  reminders: ReminderTiming[];
  recurring: {
    enabled: boolean;
    frequency: RecurringFrequency;
    interval: number;
  };
  attachments: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskDraft = Omit<Task, "id" | "createdAt" | "updatedAt">;

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  type: "class" | "study" | "deadline" | "personal";
  linkedTaskId?: string;
  recurring: {
    enabled: boolean;
    frequency: RecurringFrequency;
  };
  createdAt: string;
  updatedAt: string;
};

export type CalendarEventDraft = Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">;

export type StudySession = {
  id: string;
  taskId?: string;
  mode: "pomodoro" | "deep-focus" | "sprint" | "custom";
  phase: "work" | "short-break" | "long-break";
  durationMinutes: number;
  completedAt: string;
  xpEarned: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  condition: string;
  unlockedAt?: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  taskId?: string;
  eventId?: string;
  kind: "reminder" | "achievement" | "system";
};

export type MascotState = "idle" | "happy" | "sleepy" | "excited" | "studying";

export const defaultSubjects: Subject[] = [
  {
    id: "math",
    name: "Math",
    shortName: "Math",
    badgeClass: "bg-secondary/30 text-secondary-foreground",
    softClass: "bg-secondary/20",
    dotClass: "bg-secondary",
  },
  {
    id: "biology",
    name: "Biology",
    shortName: "Bio",
    badgeClass: "bg-primary/15 text-primary",
    softClass: "bg-primary/15",
    dotClass: "bg-primary",
  },
  {
    id: "literature",
    name: "Literature",
    shortName: "Lit",
    badgeClass: "bg-accent/30 text-accent-foreground",
    softClass: "bg-accent/20",
    dotClass: "bg-accent",
  },
  {
    id: "japanese",
    name: "Japanese",
    shortName: "JP",
    badgeClass: "bg-mint/30 text-mint-foreground",
    softClass: "bg-mint/20",
    dotClass: "bg-mint",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    shortName: "Chem",
    badgeClass: "bg-peach/40 text-foreground",
    softClass: "bg-peach/25",
    dotClass: "bg-peach",
  },
  {
    id: "history",
    name: "History",
    shortName: "Hist",
    badgeClass: "bg-secondary/25 text-secondary-foreground",
    softClass: "bg-secondary/15",
    dotClass: "bg-secondary",
  },
];

const today = toDateKey();

const createSeedTask = (
  id: string,
  task: Partial<Task> & Pick<Task, "title" | "subjectId" | "type" | "dueDate" | "targetStudyDate">,
): Task => {
  const now = new Date().toISOString();
  const subtasks = task.subtasks ?? [];
  return {
    id,
    title: task.title,
    description: task.description ?? "",
    subjectId: task.subjectId,
    type: task.type,
    dueDate: task.dueDate,
    targetStudyDate: task.targetStudyDate,
    priority: task.priority ?? "medium",
    progress: task.progress ?? 0,
    status: task.status ?? "not-started",
    subtasks,
    estimatedHours: task.estimatedHours ?? 1,
    reminders: task.reminders ?? ["7d", "3d", "1d", "same-day", "overdue"],
    recurring: task.recurring ?? { enabled: false, frequency: "none", interval: 1 },
    attachments: task.attachments ?? [],
    completedAt: task.completedAt,
    createdAt: now,
    updatedAt: now,
  };
};

export const defaultTasks: Task[] = [
  createSeedTask("task-biology-ch4", {
    title: "Read Chapter 4: Cellular Biology",
    description: "Annotate the cell cycle section and add three questions for lab.",
    subjectId: "biology",
    type: "assignment",
    dueDate: today,
    targetStudyDate: today,
    priority: "high",
    progress: 33,
    status: "ongoing",
    estimatedHours: 1.5,
    subtasks: [
      { id: "sub-bio-1", title: "Read pages 82-94", done: true },
      { id: "sub-bio-2", title: "Make diagram notes", done: false },
      { id: "sub-bio-3", title: "Write review questions", done: false },
    ],
  }),
  createSeedTask("task-calculus-set", {
    title: "Finish calculus problem set",
    description: "Problems 12-28, show work for derivatives.",
    subjectId: "math",
    type: "assignment",
    dueDate: addDays(today, 1),
    targetStudyDate: today,
    priority: "high",
    progress: 0,
    status: "not-started",
    estimatedHours: 2,
    subtasks: [
      { id: "sub-math-1", title: "Complete odd problems", done: false },
      { id: "sub-math-2", title: "Check answers", done: false },
    ],
  }),
  createSeedTask("task-lit-outline", {
    title: "Essay outline: Murakami",
    description: "Draft thesis, three arguments, and quote list.",
    subjectId: "literature",
    type: "project",
    dueDate: addDays(today, 3),
    targetStudyDate: addDays(today, 1),
    priority: "medium",
    progress: 50,
    status: "ongoing",
    estimatedHours: 2.5,
    subtasks: [
      { id: "sub-lit-1", title: "Pick thesis", done: true },
      { id: "sub-lit-2", title: "Collect quotes", done: false },
    ],
  }),
  createSeedTask("task-jp-flashcards", {
    title: "Flashcards review",
    description: "Vocabulary set 12 and kanji recall.",
    subjectId: "japanese",
    type: "study session",
    dueDate: today,
    targetStudyDate: today,
    priority: "low",
    progress: 100,
    status: "completed",
    completedAt: new Date().toISOString(),
    estimatedHours: 0.5,
    subtasks: [
      { id: "sub-jp-1", title: "Review vocabulary", done: true },
      { id: "sub-jp-2", title: "Practice kanji", done: true },
    ],
  }),
  createSeedTask("task-chem-lab", {
    title: "Lab report draft",
    description: "Write methods and results for titration lab.",
    subjectId: "chemistry",
    type: "assignment",
    dueDate: addDays(today, 6),
    targetStudyDate: addDays(today, 2),
    priority: "medium",
    progress: 10,
    status: "not-started",
    estimatedHours: 3,
  }),
  createSeedTask("task-history-timeline", {
    title: "History timeline",
    description: "Create visual timeline for module 6.",
    subjectId: "history",
    type: "project",
    dueDate: addDays(today, 2),
    targetStudyDate: addDays(today, 1),
    priority: "medium",
    progress: 70,
    status: "ongoing",
    estimatedHours: 1,
  }),
  createSeedTask("task-mock-calculus", {
    title: "Mock exam: Calculus",
    description: "Timed practice test and corrections.",
    subjectId: "math",
    type: "exam",
    dueDate: addDays(today, 4),
    targetStudyDate: addDays(today, 3),
    priority: "critical",
    progress: 0,
    status: "not-started",
    estimatedHours: 2,
  }),
];

const defaultEvents: CalendarEvent[] = [
  {
    id: "event-calculus-lecture",
    title: "Calculus lecture",
    description: "Limits and derivative applications.",
    date: today,
    startTime: "10:00",
    endTime: "11:15",
    subjectId: "math",
    type: "class",
    recurring: { enabled: true, frequency: "weekly" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "event-biology-lab",
    title: "Biology lab",
    description: "Microscope lab and worksheet.",
    date: today,
    startTime: "13:30",
    endTime: "15:00",
    subjectId: "biology",
    type: "class",
    recurring: { enabled: false, frequency: "none" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "event-study-group",
    title: "Study group",
    description: "Japanese vocab review.",
    date: today,
    startTime: "16:00",
    endTime: "17:00",
    subjectId: "japanese",
    type: "study",
    recurring: { enabled: false, frequency: "none" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultSessions: StudySession[] = [
  {
    id: "session-bio",
    taskId: "task-biology-ch4",
    mode: "pomodoro",
    phase: "work",
    durationMinutes: 45,
    completedAt: new Date().toISOString(),
    xpEarned: 45,
  },
  {
    id: "session-math",
    taskId: "task-calculus-set",
    mode: "pomodoro",
    phase: "work",
    durationMinutes: 25,
    completedAt: new Date().toISOString(),
    xpEarned: 25,
  },
  {
    id: "session-jp",
    taskId: "task-jp-flashcards",
    mode: "sprint",
    phase: "work",
    durationMinutes: 30,
    completedAt: new Date().toISOString(),
    xpEarned: 30,
  },
];

const achievementCatalog: Achievement[] = [
  {
    id: "streak-starter",
    name: "Streak starter",
    description: "Keep a 3-day streak.",
    condition: "Reach a 3-day streak.",
  },
  {
    id: "focused-mind",
    name: "Focused mind",
    description: "Finish 10 study sessions.",
    condition: "Complete 10 study sessions.",
  },
  {
    id: "early-bird",
    name: "Early bird",
    description: "Complete 5 tasks before the due date.",
    condition: "Finish 5 tasks early.",
  },
  {
    id: "first-spark",
    name: "First spark",
    description: "Complete your first task.",
    condition: "Complete 1 task.",
  },
  {
    id: "task-tamer",
    name: "Task tamer",
    description: "Complete 10 tasks.",
    condition: "Complete 10 tasks.",
  },
  {
    id: "exam-ready",
    name: "Exam ready",
    description: "Complete an exam prep task.",
    condition: "Complete 1 exam task.",
  },
  {
    id: "deep-work",
    name: "Deep work",
    description: "Study for 120 minutes total.",
    condition: "Log 120 focus minutes.",
  },
  {
    id: "level-five",
    name: "Level five",
    description: "Reach level 5.",
    condition: "Earn enough XP for level 5.",
  },
  {
    id: "coin-keeper",
    name: "Coin keeper",
    description: "Collect 500 coins.",
    condition: "Hold 500 coins.",
  },
  {
    id: "planner-pro",
    name: "Planner pro",
    description: "Create 15 tasks.",
    condition: "Have 15 tasks in your planner.",
  },
];

function normalizeTaskProgress(task: Task): Task {
  if (task.subtasks.length === 0) {
    const status = task.progress >= 100 ? "completed" : task.progress > 0 ? "ongoing" : task.status;
    return { ...task, progress: Math.min(100, Math.max(0, task.progress)), status };
  }

  const done = task.subtasks.filter((subtask) => subtask.done).length;
  const progress = Math.round((done / task.subtasks.length) * 100);
  return {
    ...task,
    progress,
    status: progress >= 100 ? "completed" : progress > 0 ? "ongoing" : "not-started",
  };
}

function levelFromXp(totalXp: number) {
  return Math.max(1, Math.floor(totalXp / 500) + 1);
}

function xpIntoLevel(totalXp: number) {
  return totalXp % 500;
}

function taskCompletionXp(task: Task) {
  const base = {
    low: 20,
    medium: 35,
    high: 50,
    critical: 75,
  } satisfies Record<TaskPriority, number>;
  const earlyBonus = daysBetween(toDateKey(), task.dueDate) > 0 ? 15 : 0;
  return base[task.priority] + earlyBonus;
}

function evaluateAchievementIds() {
  const tasks = useTasksStore.getState().tasks;
  const sessions = useStudySessionsStore.getState().sessions;
  const streak = useStreakStore.getState().currentStreak;
  const xp = useXpStore.getState();
  const completed = tasks.filter((task) => task.status === "completed");
  const earlyCompleted = completed.filter(
    (task) =>
      task.completedAt && daysBetween(toDateKey(new Date(task.completedAt)), task.dueDate) > 0,
  );
  const focusMinutes = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);

  const unlocked = new Set<string>();
  if (streak >= 3) unlocked.add("streak-starter");
  if (sessions.length >= 10) unlocked.add("focused-mind");
  if (earlyCompleted.length >= 5) unlocked.add("early-bird");
  if (completed.length >= 1) unlocked.add("first-spark");
  if (completed.length >= 10) unlocked.add("task-tamer");
  if (completed.some((task) => task.type === "exam")) unlocked.add("exam-ready");
  if (focusMinutes >= 120) unlocked.add("deep-work");
  if (xp.level >= 5) unlocked.add("level-five");
  if (xp.coins >= 500) unlocked.add("coin-keeper");
  if (tasks.length >= 15) unlocked.add("planner-pro");
  return unlocked;
}

function runGamificationCheck() {
  const newlyUnlocked = useRewardsStore.getState().evaluateAchievements();
  newlyUnlocked.forEach((achievement) => {
    useNotificationsStore.getState().addNotification({
      title: `Achievement unlocked: ${achievement.name}`,
      message: achievement.description,
      kind: "achievement",
    });
    useMascotStore.getState().setState("excited");
  });
}

type SubjectsState = {
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, "id">) => void;
  updateSubject: (id: string, updates: Partial<Omit<Subject, "id">>) => void;
  deleteSubject: (id: string) => void;
  getSubject: (id?: string) => Subject;
};

export const useSubjectsStore = create<SubjectsState>()(
  persist(
    (set, get) => ({
      subjects: defaultSubjects,
      addSubject: (subject) =>
        set((state) => ({
          subjects: [...state.subjects, { ...subject, id: makeId("subject") }],
        })),
      updateSubject: (id, updates) =>
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id ? { ...subject, ...updates } : subject,
          ),
        })),
      deleteSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((subject) => subject.id !== id),
        })),
      getSubject: (id) =>
        get().subjects.find((subject) => subject.id === id) ??
        get().subjects[0] ??
        defaultSubjects[0],
    }),
    { name: "yumemo:subjects", storage },
  ),
);

type XpState = {
  totalXp: number;
  xpToday: number;
  level: number;
  coins: number;
  lastXpDate: string;
  history: Array<{ id: string; amount: number; reason: string; createdAt: string }>;
  addXp: (amount: number, reason: string) => void;
  xpIntoLevel: () => number;
  xpForNextLevel: () => number;
};

export const useXpStore = create<XpState>()(
  persist(
    (set, get) => ({
      totalXp: 1740,
      xpToday: 100,
      level: 1,
      coins: 320,
      lastXpDate: today,
      history: [
        {
          id: "xp-seed-1",
          amount: 45,
          reason: "Biology focus session",
          createdAt: new Date().toISOString(),
        },
        {
          id: "xp-seed-2",
          amount: 55,
          reason: "Task completion",
          createdAt: new Date().toISOString(),
        },
      ],
      addXp: (amount, reason) =>
        set((state) => {
          const date = toDateKey();
          const totalXp = state.totalXp + amount;
          const leveledUp = levelFromXp(totalXp) > state.level;
          return {
            totalXp,
            xpToday: state.lastXpDate === date ? state.xpToday + amount : amount,
            lastXpDate: date,
            level: levelFromXp(totalXp),
            coins: state.coins + Math.floor(amount / 5) + (leveledUp ? 50 : 0),
            history: [
              { id: makeId("xp"), amount, reason, createdAt: new Date().toISOString() },
              ...state.history,
            ].slice(0, 50),
          };
        }),
      xpIntoLevel: () => xpIntoLevel(get().totalXp),
      xpForNextLevel: () => 500,
    }),
    {
      name: "yumemo:xp",
      storage,
      onRehydrateStorage: () => (state) => {
        if (state) state.level = levelFromXp(state.totalXp);
      },
    },
  ),
);

type StreakState = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  completedDates: string[];
  recordActivity: (date?: string) => void;
  getDisplayStreak: () => number;
};

function computeStreaksFromDates(completedDates: string[]) {
  const uniqueSorted = Array.from(new Set(completedDates))
    .filter(Boolean)
    .sort((a, b) => fromDateKey(a).getTime() - fromDateKey(b).getTime());

  if (uniqueSorted.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActivityDate: undefined as string | undefined };
  }

  // longest streak: count consecutive runs across all dates
  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < uniqueSorted.length; i += 1) {
    const diff = daysBetween(uniqueSorted[i - 1], uniqueSorted[i]);
    if (diff === 1) {
      run += 1;
      longestStreak = Math.max(longestStreak, run);
    } else if (diff === 0) {
      // duplicates already removed, but keep safe
    } else {
      run = 1;
    }
  }

  const lastActivityDate = uniqueSorted[uniqueSorted.length - 1];

  // current streak: must end at today or yesterday
  const dayDiff = daysBetween(lastActivityDate, toDateKey());
  if (dayDiff > 1) {
    return { currentStreak: 0, longestStreak, lastActivityDate };
  }

  // count consecutive backwards ending at lastActivityDate
  let currentStreak = 1;
  for (let i = uniqueSorted.length - 1; i > 0; i -= 1) {
    const diff = daysBetween(uniqueSorted[i - 1], uniqueSorted[i]);
    if (diff === 1) currentStreak += 1;
    else break;
  }

  return { currentStreak, longestStreak, lastActivityDate };
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: undefined,
      completedDates: [],
      recordActivity: (date = toDateKey()) =>
        set((state) => {
          if (state.completedDates.includes(date)) {
            const computed = computeStreaksFromDates(state.completedDates);
            return {
              ...state,
              currentStreak: computed.currentStreak,
              longestStreak: computed.longestStreak,
              lastActivityDate: computed.lastActivityDate,
            };
          }

          const nextCompleted = [...state.completedDates, date].slice(-90);
          const computed = computeStreaksFromDates(nextCompleted);
          return {
            ...state,
            ...computed,
            completedDates: nextCompleted,
          };
        }),
      getDisplayStreak: () => {
        const state = get();
        if (!state.lastActivityDate) return 0;
        return daysBetween(state.lastActivityDate, toDateKey()) > 1 ? 0 : state.currentStreak;
      },
    }),
    {
      name: "yumemo:streaks",
      storage,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const computed = computeStreaksFromDates(state.completedDates);
        state.currentStreak = computed.currentStreak;
        state.longestStreak = computed.longestStreak;
        state.lastActivityDate = computed.lastActivityDate;
      },
      // Seed initial data only for first run; avoids hardcoded fake streaks.
      // Zustand persist supports `merge` behavior; we keep defaults minimal and rely on recordActivity.
    },
  ),
);


type RewardsState = {
  achievements: Achievement[];
  recentUnlockId?: string;
  evaluateAchievements: () => Achievement[];
  clearRecentUnlock: () => void;
};

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      achievements: achievementCatalog.map((achievement) =>
        ["streak-starter", "first-spark"].includes(achievement.id)
          ? { ...achievement, unlockedAt: new Date().toISOString() }
          : achievement,
      ),
      recentUnlockId: undefined,
      evaluateAchievements: () => {
        const eligible = evaluateAchievementIds();
        const now = new Date().toISOString();
        const newlyUnlocked: Achievement[] = [];
        set((state) => {
          const achievements = state.achievements.map((achievement) => {
            if (eligible.has(achievement.id) && !achievement.unlockedAt) {
              const unlocked = { ...achievement, unlockedAt: now };
              newlyUnlocked.push(unlocked);
              return unlocked;
            }
            return achievement;
          });
          return {
            achievements,
            recentUnlockId: newlyUnlocked[0]?.id ?? state.recentUnlockId,
          };
        });
        return newlyUnlocked;
      },
      clearRecentUnlock: () => set({ recentUnlockId: undefined }),
    }),
    { name: "yumemo:rewards", storage },
  ),
);

type MascotStateStore = {
  state: MascotState;
  colorVariant: "original" | "sakura" | "mint" | "lavender" | "sunset";
  accessory: "ribbon" | "glasses" | "scarf" | "none";
  lastInteractionAt: string;
  setState: (state: MascotState) => void;
  setAppearance: (
    appearance: Partial<Pick<MascotStateStore, "colorVariant" | "accessory">>,
  ) => void;
};

export const useMascotStore = create<MascotStateStore>()(
  persist(
    (set) => ({
      state: "idle",
      colorVariant: "original",
      accessory: "ribbon",
      lastInteractionAt: new Date().toISOString(),
      setState: (state) => set({ state, lastInteractionAt: new Date().toISOString() }),
      setAppearance: (appearance) => set(appearance),
    }),
    { name: "yumemo:mascot", storage },
  ),
);

type NotificationPrefs = Record<ReminderTiming, boolean> & {
  push: boolean;
  email: boolean;
};

type NotificationsState = {
  notifications: Notification[];
  preferences: NotificationPrefs;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  setPreference: (key: keyof NotificationPrefs, value: boolean) => void;
  generateTaskReminders: (tasks: Task[]) => void;
};

const reminderMessages: Record<ReminderTiming, string> = {
  "7d": "A soft start now will make deadline week feel lighter.",
  "3d": "Three days left. A small study block today counts.",
  "1d": "Tomorrow is the day. You can still make this gentle.",
  "same-day": "Due today. Take one calm step at a time.",
  overdue: "This is overdue, but not hopeless. Start with the smallest piece.",
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "notification-welcome",
          title: "Welcome back",
          message: "Your cozy planner is ready for today's tiny wins.",
          createdAt: new Date().toISOString(),
          read: false,
          kind: "system",
        },
      ],
      preferences: {
        "7d": true,
        "3d": true,
        "1d": true,
        "same-day": true,
        overdue: true,
        push: true,
        email: true,
      },
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: makeId("notification"),
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 40),
        })),
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
        })),
      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),
      generateTaskReminders: (tasks) => {
        const prefs = get().preferences;
        const existingKeys = new Set(
          get().notifications.map((notification) => `${notification.taskId}:${notification.title}`),
        );
        tasks.forEach((task) => {
          const diff = daysBetween(toDateKey(), task.dueDate);
          const timing: ReminderTiming | undefined =
            diff < 0
              ? "overdue"
              : diff === 0
                ? "same-day"
                : diff === 1
                  ? "1d"
                  : diff === 3
                    ? "3d"
                    : diff === 7
                      ? "7d"
                      : undefined;
          if (!timing || !prefs[timing] || task.status === "completed") return;
          const title =
            timing === "overdue"
              ? `Overdue: ${task.title}`
              : `Due ${timing === "same-day" ? "today" : `in ${diff} days`}: ${task.title}`;
          const key = `${task.id}:${title}`;
          if (existingKeys.has(key)) return;
          get().addNotification({
            title,
            message: reminderMessages[timing],
            kind: "reminder",
            taskId: task.id,
          });
        });
      },
    }),
    { name: "yumemo:notifications", storage },
  ),
);

type TasksState = {
  tasks: Task[];
  addTask: (draft: TaskDraft) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  updateTaskProgress: (id: string, progress: number) => void;
  getTask: (id?: string) => Task | undefined;
};

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: defaultTasks,
      addTask: (draft) => {
        const now = new Date().toISOString();
        const task = normalizeTaskProgress({
          ...draft,
          id: makeId("task"),
          createdAt: now,
          updatedAt: now,
        });
        set((state) => ({ tasks: [task, ...state.tasks] }));
        useNotificationsStore.getState().generateTaskReminders([task]);
        runGamificationCheck();
        return task;
      },
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            const next = normalizeTaskProgress({
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            });
            if (task.status !== "completed" && next.status === "completed") {
              const xp = taskCompletionXp(next);
              useXpStore.getState().addXp(xp, `Completed ${next.title}`);
              useStreakStore.getState().recordActivity();
              useMascotStore.getState().setState("happy");
              useNotificationsStore.getState().addNotification({
                title: "Task completed",
                message: `You earned ${xp} XP for ${next.title}.`,
                taskId: next.id,
                kind: "system",
              });
              next.completedAt = new Date().toISOString();
            }
            return next;
          }),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleSubtask: (taskId, subtaskId) => {
        get().updateTask(taskId, {
          subtasks: get()
            .tasks.find((task) => task.id === taskId)
            ?.subtasks.map((subtask) =>
              subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask,
            ),
        });
        runGamificationCheck();
      },
      setTaskStatus: (id, status) => {
        const progress = status === "completed" ? 100 : status === "not-started" ? 0 : undefined;
        get().updateTask(id, {
          status,
          progress: progress ?? get().tasks.find((task) => task.id === id)?.progress ?? 0,
          subtasks:
            status === "completed"
              ? get()
                  .tasks.find((task) => task.id === id)
                  ?.subtasks.map((subtask) => ({ ...subtask, done: true }))
              : get().tasks.find((task) => task.id === id)?.subtasks,
        });
        runGamificationCheck();
      },
      updateTaskProgress: (id, progress) => {
        get().updateTask(id, { progress: Math.min(100, Math.max(0, progress)) });
        runGamificationCheck();
      },
      getTask: (id) => get().tasks.find((task) => task.id === id),
    }),
    {
      name: "yumemo:tasks",
      storage,
      onRehydrateStorage: () => (state) => {
        state?.tasks.forEach((task) => normalizeTaskProgress(task));
      },
    },
  ),
);

type CalendarState = {
  events: CalendarEvent[];
  selectedDate: string;
  defaultView: "month" | "week";
  firstDayOfWeek: 0 | 1;
  addEvent: (draft: CalendarEventDraft) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: string) => void;
  setDefaultView: (view: "month" | "week") => void;
  setFirstDayOfWeek: (firstDayOfWeek: 0 | 1) => void;
};

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: defaultEvents,
      selectedDate: today,
      defaultView: "month",
      firstDayOfWeek: 1,
      addEvent: (draft) => {
        const now = new Date().toISOString();
        const event = { ...draft, id: makeId("event"), createdAt: now, updatedAt: now };
        set((state) => ({ events: [event, ...state.events] }));
        return event;
      },
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates, updatedAt: new Date().toISOString() } : event,
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({ events: state.events.filter((event) => event.id !== id) })),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setDefaultView: (defaultView) => set({ defaultView }),
      setFirstDayOfWeek: (firstDayOfWeek) => set({ firstDayOfWeek }),
    }),
    { name: "yumemo:calendar", storage },
  ),
);

type StudySessionsState = {
  sessions: StudySession[];
  addSession: (session: Omit<StudySession, "id" | "completedAt" | "xpEarned">) => StudySession;
};

export const useStudySessionsStore = create<StudySessionsState>()(
  persist(
    (set) => ({
      sessions: defaultSessions,
      addSession: (session) => {
        const xpEarned = Math.max(5, Math.round(session.durationMinutes));
        const completed: StudySession = {
          ...session,
          id: makeId("session"),
          completedAt: new Date().toISOString(),
          xpEarned,
        };
        set((state) => ({ sessions: [completed, ...state.sessions].slice(0, 100) }));
        useXpStore.getState().addXp(xpEarned, "Completed focus session");
        useStreakStore.getState().recordActivity();
        useMascotStore.getState().setState("happy");
        if (session.taskId) {
          const task = useTasksStore.getState().getTask(session.taskId);
          if (task && task.status !== "completed") {
            useTasksStore.getState().updateTaskProgress(task.id, Math.min(100, task.progress + 15));
          }
        }
        runGamificationCheck();
        return completed;
      },
    }),
    { name: "yumemo:study-sessions", storage },
  ),
);

type TimerMode = "pomodoro" | "deep-focus" | "sprint" | "custom";
type TimerPhase = "work" | "short-break" | "long-break";

type TimerPreset = {
  mode: TimerMode;
  label: string;
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
};

export const timerPresets: TimerPreset[] = [
  {
    mode: "pomodoro",
    label: "Pomodoro",
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
  },
  {
    mode: "deep-focus",
    label: "Deep focus",
    workMinutes: 50,
    shortBreakMinutes: 10,
    longBreakMinutes: 20,
  },
  { mode: "sprint", label: "Sprint", workMinutes: 15, shortBreakMinutes: 3, longBreakMinutes: 10 },
  { mode: "custom", label: "Custom", workMinutes: 30, shortBreakMinutes: 5, longBreakMinutes: 15 },
];

type FocusTimerState = {
  mode: TimerMode;
  phase: TimerPhase;
  running: boolean;
  secondsLeft: number;
  completedCycles: number;
  selectedTaskId?: string;
  customWorkMinutes: number;
  alertMessage?: string;
  setMode: (mode: TimerMode) => void;
  setSelectedTask: (taskId?: string) => void;
  setCustomWorkMinutes: (minutes: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  clearAlert: () => void;
};

function getPreset(mode: TimerMode) {
  return timerPresets.find((preset) => preset.mode === mode) ?? timerPresets[0];
}

function secondsFor(mode: TimerMode, phase: TimerPhase, customWorkMinutes: number) {
  const preset = getPreset(mode);
  const minutes =
    phase === "work"
      ? mode === "custom"
        ? customWorkMinutes
        : preset.workMinutes
      : phase === "short-break"
        ? preset.shortBreakMinutes
        : preset.longBreakMinutes;
  return minutes * 60;
}

export const useFocusTimerStore = create<FocusTimerState>()(
  persist(
    (set, get) => ({
      mode: "pomodoro",
      phase: "work",
      running: false,
      secondsLeft: 25 * 60,
      completedCycles: 0,
      selectedTaskId: undefined,
      customWorkMinutes: 30,
      alertMessage: undefined,
      setMode: (mode) =>
        set((state) => ({
          mode,
          phase: "work",
          running: false,
          secondsLeft: secondsFor(mode, "work", state.customWorkMinutes),
          alertMessage: undefined,
        })),
      setSelectedTask: (selectedTaskId) => set({ selectedTaskId }),
      setCustomWorkMinutes: (customWorkMinutes) =>
        set((state) => ({
          customWorkMinutes,
          secondsLeft:
            state.mode === "custom" && state.phase === "work"
              ? customWorkMinutes * 60
              : state.secondsLeft,
        })),
      start: () => {
        set({ running: true, alertMessage: undefined });
        useMascotStore.getState().setState("studying");
      },
      pause: () => set({ running: false }),
      reset: () =>
        set((state) => ({
          running: false,
          phase: "work",
          secondsLeft: secondsFor(state.mode, "work", state.customWorkMinutes),
          alertMessage: undefined,
        })),
      tick: () =>
        set((state) => {
          if (!state.running) return state;
          if (state.secondsLeft > 1) return { secondsLeft: state.secondsLeft - 1 };

          if (state.phase === "work") {
            const workMinutes =
              state.mode === "custom" ? state.customWorkMinutes : getPreset(state.mode).workMinutes;
            useStudySessionsStore.getState().addSession({
              taskId: state.selectedTaskId,
              mode: state.mode,
              phase: "work",
              durationMinutes: workMinutes,
            });
            const completedCycles = state.completedCycles + 1;
            const nextPhase = completedCycles % 4 === 0 ? "long-break" : "short-break";
            return {
              running: false,
              phase: nextPhase,
              completedCycles,
              secondsLeft: secondsFor(state.mode, nextPhase, state.customWorkMinutes),
              alertMessage: "Focus session complete. XP added.",
            };
          }

          return {
            running: false,
            phase: "work",
            secondsLeft: secondsFor(state.mode, "work", state.customWorkMinutes),
            alertMessage: "Break complete. Ready for the next cozy round.",
          };
        }),
      clearAlert: () => set({ alertMessage: undefined }),
    }),
    {
      name: "yumemo:focus-timer",
      storage,
      partialize: (state) => ({
        mode: state.mode,
        phase: state.phase,
        running: false,
        secondsLeft: state.secondsLeft,
        completedCycles: state.completedCycles,
        selectedTaskId: state.selectedTaskId,
        customWorkMinutes: state.customWorkMinutes,
      }),
    },
  ),
);
