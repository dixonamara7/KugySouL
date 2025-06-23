'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Brain, Sparkles, Save, Download, Share2, Upload, 
  Play, Pause, Target,
  BarChart3, Clock, Award, Lightbulb, Palette, Volume2, VolumeX,
  Maximize, Minimize, Focus, Users,
  FileText, Search, Bookmark, Tag, Calendar,
  CheckCircle, Plus, ChevronLeft,
  MoreHorizontal, Layers, Grid,
  PenTool, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Underline, List, Quote, Link,
  Mic, Headphones, Timer, Flame, Zap as Lightning
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Enhanced Interfaces
interface NovelChapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  isComplete: boolean;
  completedAt?: Date;
  mood: 'light' | 'dark' | 'mysterious' | 'romantic' | 'action' | 'dramatic';
  tags: string[];
  notes: string;
  targetWords: number;
  estimatedReadTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  characters: string[];
  plotPoints: string[];
}

interface NovelProject {
  id: string;
  title: string;
  genre: string;
  description: string;
  chapters: NovelChapter[];
  currentChapterIndex: number;
  totalWords: number;
  targetWords: number;
  deadline?: Date;
  lastSaved: Date;
  createdAt: Date;
  tags: string[];
  characters: Character[];
  plotlines: Plotline[];
  worldBuilding: WorldBuilding;
  writingGoals: WritingGoal[];
  statistics: WritingStatistics;
}

interface Character {
  id: string;
  name: string;
  description: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  traits: string[];
  backstory: string;
  goals: string[];
  conflicts: string[];
  relationships: { characterId: string; relationship: string }[];
}

interface Plotline {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'active' | 'resolved';
  chapters: string[];
  importance: 'main' | 'subplot' | 'minor';
}

interface WorldBuilding {
  setting: string;
  timeperiod: string;
  locations: { name: string; description: string }[];
  rules: string[];
  cultures: string[];
  technologies: string[];
}

interface WritingGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'project';
  target: number;
  current: number;
  deadline: Date;
  achieved: boolean;
}

interface WritingStatistics {
  totalWords: number;
  wordsToday: number;
  wordsThisWeek: number;
  wordsThisMonth: number;
  averageWordsPerDay: number;
  writingStreak: number;
  longestStreak: number;
  sessionsToday: number;
  totalSessions: number;
  averageSessionLength: number;
  productiveHours: number[];
  moodDistribution: Record<string, number>;
  genreExperience: Record<string, number>;
}

interface WritingSession {
  startTime: Date;
  endTime?: Date;
  wordsWritten: number;
  mood: string;
  distractions: number;
  breaks: number;
  focus: number; // 1-10 scale
}

// Theme configurations
const themes = {
  midnight: {
    name: 'Midnight Writer',
    bg: 'from-slate-900 via-purple-900 to-slate-900',
    card: 'bg-slate-800/50 border-slate-700',
    text: 'text-slate-100',
    accent: 'text-purple-400',
    button: 'bg-purple-600 hover:bg-purple-700'
  },
  forest: {
    name: 'Forest Sanctuary',
    bg: 'from-emerald-900 via-green-800 to-emerald-900',
    card: 'bg-emerald-800/50 border-emerald-700',
    text: 'text-emerald-100',
    accent: 'text-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-700'
  },
  ocean: {
    name: 'Ocean Depths',
    bg: 'from-blue-900 via-cyan-900 to-blue-900',
    card: 'bg-blue-800/50 border-blue-700',
    text: 'text-blue-100',
    accent: 'text-cyan-400',
    button: 'bg-cyan-600 hover:bg-cyan-700'
  },
  sunset: {
    name: 'Golden Hour',
    bg: 'from-orange-900 via-red-900 to-pink-900',
    card: 'bg-orange-800/50 border-orange-700',
    text: 'text-orange-100',
    accent: 'text-orange-400',
    button: 'bg-orange-600 hover:bg-orange-700'
  },
  minimal: {
    name: 'Pure Focus',
    bg: 'from-gray-50 to-white',
    card: 'bg-white border-gray-200',
    text: 'text-gray-900',
    accent: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700'
  }
};

// Ambient sounds
const ambientSounds = [
  { id: 'rain', name: 'Rain', icon: '🌧️', url: '/sounds/rain.mp3' },
  { id: 'forest', name: 'Forest', icon: '🌲', url: '/sounds/forest.mp3' },
  { id: 'cafe', name: 'Café', icon: '☕', url: '/sounds/cafe.mp3' },
  { id: 'ocean', name: 'Ocean', icon: '🌊', url: '/sounds/ocean.mp3' },
  { id: 'fireplace', name: 'Fireplace', icon: '🔥', url: '/sounds/fireplace.mp3' },
  { id: 'library', name: 'Library', icon: '📚', url: '/sounds/library.mp3' }
];

export default function EnhancedNovelWriter() {
  // Core States
  const [currentProject, setCurrentProject] = useState<NovelProject | null>(null);
  const [currentChapter, setCurrentChapter] = useState<NovelChapter | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [projects, setProjects] = useState<NovelProject[]>([]);
  
  // UI States
  const [currentTheme, setCurrentTheme] = useState('midnight');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showStatistics, setShowStatistics] = useState(false);
  const [activeTab, setActiveTab] = useState('write');
  
  // Writing States
  const [isWriting, setIsWriting] = useState(false);
  const [currentSession, setCurrentSession] = useState<WritingSession | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [chapterWordCount, setChapterWordCount] = useState(0);
  const [writingGoal, setWritingGoal] = useState(500);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // AI States
  const [autoPilotMode, setAutoPilotMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [writingStyle, setWritingStyle] = useState('narrative');
  
  // Audio States
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  
  // Timer States
  const [pomodoroTimer, setPomodoroTimer] = useState(25 * 60); // 25 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  
  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current theme
  const theme = themes[currentTheme as keyof typeof themes];

  // Word counting function
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Session management (auto-start when writing begins)
  useEffect(() => {
    if (isWriting && !currentSession) {
      const session: WritingSession = {
        startTime: new Date(),
        wordsWritten: 0,
        mood: 'focused',
        distractions: 0,
        breaks: 0,
        focus: 8
      };
      setCurrentSession(session);
    }
  }, [isWriting, currentSession]);

  // Pomodoro timer functions
  const startTimer = () => {
    setIsTimerActive(true);
    timerRef.current = setInterval(() => {
      setPomodoroTimer(prev => {
        if (prev <= 1) {
          // Timer finished
          setIsTimerActive(false);
          if (timerMode === 'work') {
            setTimerMode('break');
            setPomodoroTimer(5 * 60); // 5 minute break
          } else {
            setTimerMode('work');
            setPomodoroTimer(25 * 60); // 25 minute work
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Timer cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Create new project
  const createNewProject = () => {
    const newProject: NovelProject = {
      id: Date.now().toString(),
      title: 'Untitled Novel',
      genre: 'fiction',
      description: '',
      chapters: [],
      currentChapterIndex: 0,
      totalWords: 0,
      targetWords: 50000,
      lastSaved: new Date(),
      createdAt: new Date(),
      tags: [],
      characters: [],
      plotlines: [],
      worldBuilding: {
        setting: '',
        timeperiod: '',
        locations: [],
        rules: [],
        cultures: [],
        technologies: []
      },
      writingGoals: [],
      statistics: {
        totalWords: 0,
        wordsToday: 0,
        wordsThisWeek: 0,
        wordsThisMonth: 0,
        averageWordsPerDay: 0,
        writingStreak: 0,
        longestStreak: 0,
        sessionsToday: 0,
        totalSessions: 0,
        averageSessionLength: 0,
        productiveHours: [],
        moodDistribution: {},
        genreExperience: {}
      }
    };

    // Add first chapter
    const firstChapter: NovelChapter = {
      id: Date.now().toString(),
      title: 'Chapter 1',
      content: '',
      wordCount: 0,
      isComplete: false,
      mood: 'light',
      tags: [],
      notes: '',
      targetWords: 2000,
      estimatedReadTime: 0,
      difficulty: 'medium',
      characters: [],
      plotPoints: []
    };

    newProject.chapters = [firstChapter];
    setCurrentProject(newProject);
    setCurrentChapter(firstChapter);
    setProjects(prev => [...prev, newProject]);
    setIsWriting(true);
  };

  // Auto-save functionality
  useEffect(() => {
    if (currentProject && currentChapter && editorContent) {
      const autoSaveTimer = setTimeout(() => {
        setIsAutoSaving(true);
        // Simulate auto-save
        setTimeout(() => {
          setIsAutoSaving(false);
        }, 1000);
      }, 3000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [editorContent, currentProject, currentChapter]);

  // Update word count
  useEffect(() => {
    const words = countWords(editorContent);
    setWordCount(words);
    setChapterWordCount(words);
  }, [editorContent]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            // Save function
            break;
          case 'f':
            e.preventDefault();
            setIsFocusMode(!isFocusMode);
            break;
          case 'b':
            e.preventDefault();
            setShowSidebar(!showSidebar);
            break;
          case 'Enter':
            if (e.shiftKey) {
              e.preventDefault();
              setIsFullscreen(!isFullscreen);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, showSidebar, isFullscreen]);

  if (!isWriting) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} p-6`}>
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <BookOpen className="w-16 h-16 text-purple-400" />
              </motion.div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Novel Writer Pro
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The ultimate AI-powered writing companion. Create, manage, and publish your novels with 
              intelligent assistance, beautiful themes, and professional tools.
            </p>
          </motion.div>

          {/* Quick Start Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`${theme.card} backdrop-blur-lg rounded-2xl p-8 border cursor-pointer`}
              onClick={createNewProject}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">New Novel</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Start a fresh story with AI assistance and smart chapter management.
              </p>
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI-Powered</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className={`${theme.card} backdrop-blur-lg rounded-2xl p-8 border cursor-pointer`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Continue Writing</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Resume your latest project and pick up where you left off.
              </p>
              <div className="flex items-center gap-2 text-blue-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Auto-Resume</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className={`${theme.card} backdrop-blur-lg rounded-2xl p-8 border cursor-pointer`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Import Project</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Import existing manuscripts and enhance them with AI tools.
              </p>
              <div className="flex items-center gap-2 text-green-400">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Multiple Formats</span>
              </div>
            </motion.div>
          </div>

          {/* Recent Projects */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Recent Projects</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 6).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className={`${theme.card} backdrop-blur-lg rounded-xl p-6 border cursor-pointer`}
                    onClick={() => {
                      setCurrentProject(project);
                      setCurrentChapter(project.chapters[project.currentChapterIndex]);
                      setEditorContent(project.chapters[project.currentChapterIndex]?.content || '');
                      setIsWriting(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {project.genre}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{project.totalWords} words</span>
                      <span className="text-gray-400">
                        {project.chapters.length} chapters
                      </span>
                    </div>
                    <div className="mt-3">
                      <Progress 
                        value={(project.totalWords / project.targetWords) * 100} 
                        className="h-2"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features Showcase */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Brain, title: 'AI Assistant', desc: 'Smart writing suggestions and auto-completion' },
              { icon: Target, title: 'Goal Tracking', desc: 'Set and achieve your writing targets' },
              { icon: Palette, title: 'Beautiful Themes', desc: 'Immersive writing environments' },
              { icon: BarChart3, title: 'Analytics', desc: 'Track your progress and productivity' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + 0.1 * index }}
                className={`${theme.card} backdrop-blur-lg rounded-xl p-6 border text-center`}
              >
                <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-all duration-500`}>
        {/* Top Navigation Bar */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className={`${theme.card} backdrop-blur-lg border-b sticky top-0 z-50`}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsWriting(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                  </Button>
                  
                  <div className="h-6 w-px bg-gray-600" />
                  
                  <h1 className="text-xl font-bold text-white">
                    {currentProject?.title || 'Untitled Novel'}
                  </h1>
                  
                  {isAutoSaving && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-blue-400 text-sm"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      Auto-saving...
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Theme Selector */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const themeKeys = Object.keys(themes);
                          const currentIndex = themeKeys.indexOf(currentTheme);
                          const nextIndex = (currentIndex + 1) % themeKeys.length;
                          setCurrentTheme(themeKeys[nextIndex]);
                        }}
                      >
                        <Palette className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Change Theme</TooltipContent>
                  </Tooltip>

                  {/* Focus Mode Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFocusMode(!isFocusMode)}
                      >
                        <Focus className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Focus Mode (Ctrl+F)</TooltipContent>
                  </Tooltip>

                  {/* Fullscreen Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                      >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fullscreen (Ctrl+Shift+Enter)</TooltipContent>
                  </Tooltip>

                  {/* Pomodoro Timer */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-lg">
                    <Timer className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-mono text-white">
                      {formatTime(pomodoroTimer)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={isTimerActive ? pauseTimer : startTimer}
                      className="p-1"
                    >
                      {isTimerActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                  </div>

                  {/* Word Count */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-lg">
                    <Type className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-mono text-white">
                      {chapterWordCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-screen">
          {/* Left Sidebar */}
          <AnimatePresence>
            {showSidebar && !isFocusMode && (
              <motion.div
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                className={`w-80 ${theme.card} backdrop-blur-lg border-r overflow-y-auto`}
              >
                <div className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="plan">Plan</TabsTrigger>
                      <TabsTrigger value="stats">Stats</TabsTrigger>
                      <TabsTrigger value="tools">Tools</TabsTrigger>
                    </TabsList>

                    <TabsContent value="write" className="space-y-6 mt-6">
                      {/* Chapter Management */}
                      <Card className={theme.card}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <BookOpen className="w-5 h-5" />
                            Chapters
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {currentProject?.chapters.map((chapter, index) => (
                            <motion.div
                              key={chapter.id}
                              whileHover={{ scale: 1.02 }}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                currentProject.currentChapterIndex === index
                                  ? 'border-purple-400 bg-purple-500/20'
                                  : 'border-gray-600 hover:border-gray-500'
                              }`}
                              onClick={() => {
                                setCurrentChapter(chapter);
                                setEditorContent(chapter.content);
                                setCurrentProject({
                                  ...currentProject,
                                  currentChapterIndex: index
                                });
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white font-medium">{chapter.title}</span>
                                {chapter.isComplete && (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                )}
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">
                                  {chapter.wordCount}/{chapter.targetWords} words
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {chapter.mood}
                                </Badge>
                              </div>
                              <Progress
                                value={(chapter.wordCount / chapter.targetWords) * 100}
                                className="h-1 mt-2"
                              />
                            </motion.div>
                          ))}
                          
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              // Add new chapter logic
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Chapter
                          </Button>
                        </CardContent>
                      </Card>

                      {/* AI Assistant */}
                      <Card className={theme.card}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Brain className="w-5 h-5" />
                            AI Assistant
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">Writing Style</label>
                            <select
                              value={writingStyle}
                              onChange={(e) => setWritingStyle(e.target.value)}
                              className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg text-white"
                            >
                              <option value="narrative">Narrative</option>
                              <option value="descriptive">Descriptive</option>
                              <option value="dialogue">Dialogue-Heavy</option>
                              <option value="action">Action-Packed</option>
                              <option value="literary">Literary</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">AI Model</label>
                            <select
                              value={selectedModel}
                              onChange={(e) => setSelectedModel(e.target.value)}
                              className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg text-white"
                            >
                              <option value="gpt-4">GPT-4 (Best Quality)</option>
                              <option value="gpt-3.5">GPT-3.5 (Faster)</option>
                              <option value="claude">Claude (Creative)</option>
                            </select>
                          </div>

                          <Button
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Content
                          </Button>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Lightbulb className="w-3 h-3 mr-1" />
                              Ideas
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Users className="w-3 h-3 mr-1" />
                              Characters
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Ambient Sounds */}
                      <Card className={theme.card}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Headphones className="w-5 h-5" />
                            Ambient Sounds
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-2">
                            {ambientSounds.map((sound) => (
                              <Button
                                key={sound.id}
                                variant={ambientSound === sound.id ? "default" : "outline"}
                                size="sm"
                                className="flex flex-col gap-1 h-auto p-2"
                                onClick={() => setAmbientSound(
                                  ambientSound === sound.id ? null : sound.id
                                )}
                              >
                                <span className="text-lg">{sound.icon}</span>
                                <span className="text-xs">{sound.name}</span>
                              </Button>
                            ))}
                          </div>
                          
                          {ambientSound && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Volume</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsMuted(!isMuted)}
                                >
                                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </Button>
                              </div>
                              <Slider
                                value={[ambientVolume]}
                                onValueChange={(value) => setAmbientVolume(value[0])}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="plan" className="space-y-6 mt-6">
                      {/* Characters */}
                      <Card className={theme.card}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Users className="w-5 h-5" />
                            Characters
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {currentProject?.characters.map((character) => (
                              <div key={character.id} className="p-3 bg-black/20 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-white">{character.name}</span>
                                  <Badge variant="outline">{character.role}</Badge>
                                </div>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {character.description}
                                </p>
                              </div>
                            ))}
                            <Button variant="outline" className="w-full">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Character
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Plot Lines */}
                      <Card className={theme.card}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Layers className="w-5 h-5" />
                            Plot Lines
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {currentProject?.plotlines.map((plot) => (
                              <div key={plot.id} className="p-3 bg-black/20 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-white">{plot.title}</span>
                                  <Badge variant={plot.status === 'active' ? 'default' : 'outline'}>
                                    {plot.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {plot.description}
                                </p>
                              </div>
                            ))}
                            <Button variant="outline" className="w-full">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Plot Line
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-6 mt-6">
                      {/* Writing Goals */}
                      <Card className={theme.card}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Target className="w-5 h-5" />
                            Today&apos;s Goal
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">
                              {wordCount}/{writingGoal}
                            </div>
                            <Progress value={(wordCount / writingGoal) * 100} className="h-3" />
                            <p className="text-sm text-gray-400 mt-2">
                              {Math.max(0, writingGoal - wordCount)} words to go
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">Daily Goal</label>
                            <Slider
                              value={[writingGoal]}
                              onValueChange={(value) => setWritingGoal(value[0])}
                              min={100}
                              max={5000}
                              step={50}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>100</span>
                              <span>5000</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Writing Statistics */}
                      <Card className={theme.card}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <BarChart3 className="w-5 h-5" />
                            Statistics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-black/20 rounded-lg">
                              <div className="text-lg font-bold text-white">
                                {currentProject?.statistics.writingStreak || 0}
                              </div>
                              <div className="text-xs text-gray-400">Day Streak</div>
                            </div>
                            <div className="text-center p-3 bg-black/20 rounded-lg">
                              <div className="text-lg font-bold text-white">
                                {currentProject?.statistics.averageWordsPerDay || 0}
                              </div>
                              <div className="text-xs text-gray-400">Avg/Day</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">This Week</span>
                              <span className="text-white">
                                {currentProject?.statistics.wordsThisWeek || 0}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">This Month</span>
                              <span className="text-white">
                                {currentProject?.statistics.wordsThisMonth || 0}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">Total Sessions</span>
                              <span className="text-white">
                                {currentProject?.statistics.totalSessions || 0}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="tools" className="space-y-6 mt-6">
                      {/* Quick Tools */}
                      <Card className={theme.card}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <PenTool className="w-5 h-5" />
                            Quick Tools
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            <Search className="w-4 h-4 mr-2" />
                            Find & Replace
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Bookmarks
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Tag className="w-4 h-4 mr-2" />
                            Tags
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Calendar className="w-4 h-4 mr-2" />
                            Timeline
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Export Options */}
                      <Card className={theme.card}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Download className="w-5 h-5" />
                            Export
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            Export as PDF
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            Export as DOCX
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            Export as EPUB
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Online
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Editor Toolbar */}
            <AnimatePresence>
              {!isFocusMode && (
                <motion.div
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  exit={{ y: -50 }}
                  className={`${theme.card} backdrop-blur-lg border-b p-3`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Underline className="w-4 h-4" />
                      </Button>
                      
                      <div className="w-px h-6 bg-gray-600 mx-2" />
                      
                      <Button variant="ghost" size="sm">
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <AlignRight className="w-4 h-4" />
                      </Button>
                      
                      <div className="w-px h-6 bg-gray-600 mx-2" />
                      
                      <Button variant="ghost" size="sm">
                        <List className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Quote className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Link className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Mic className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Editor */}
            <div className="flex-1 relative">
              <textarea
                ref={editorRef}
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder="Start writing your story..."
                className={`w-full h-full p-8 bg-transparent text-white placeholder-gray-400 border-none outline-none resize-none font-serif text-lg leading-relaxed ${
                  isFocusMode ? 'p-16 text-xl' : ''
                }`}
                style={{
                  fontFamily: '"Crimson Text", "Georgia", serif',
                  lineHeight: '1.8'
                }}
              />

              {/* Floating Action Buttons */}
              <AnimatePresence>
                {!isFocusMode && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="absolute bottom-8 right-8 flex flex-col gap-3"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="lg"
                          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
                          onClick={() => setAutoPilotMode(!autoPilotMode)}
                        >
                          {autoPilotMode ? <Pause className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        {autoPilotMode ? 'Stop Auto-Pilot' : 'Start Auto-Pilot'}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-full w-14 h-14 backdrop-blur-lg"
                          onClick={() => setShowSidebar(!showSidebar)}
                        >
                          <Grid className="w-6 h-6" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Toggle Sidebar</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-full w-14 h-14 backdrop-blur-lg"
                          onClick={() => setShowStatistics(!showStatistics)}
                        >
                          <BarChart3 className="w-6 h-6" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Statistics</TooltipContent>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Word Count Overlay */}
              <AnimatePresence>
                {!isFocusMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-8 left-8"
                  >
                    <div className={`${theme.card} backdrop-blur-lg rounded-lg p-4 border`}>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {chapterWordCount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">Words</div>
                        </div>
                        
                        <div className="w-px h-8 bg-gray-600" />
                        
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">
                            {Math.ceil(chapterWordCount / 250)}
                          </div>
                          <div className="text-xs text-gray-400">Pages</div>
                        </div>
                        
                        <div className="w-px h-8 bg-gray-600" />
                        
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">
                            {Math.ceil(chapterWordCount / 200)}
                          </div>
                          <div className="text-xs text-gray-400">Min Read</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Auto-Pilot Status */}
              <AnimatePresence>
                {autoPilotMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-8 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      <span className="font-medium">Auto-Pilot Active</span>
                      <Lightning className="w-4 h-4" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Statistics Panel */}
          <AnimatePresence>
            {showStatistics && !isFocusMode && (
              <motion.div
                initial={{ x: 400 }}
                animate={{ x: 0 }}
                exit={{ x: 400 }}
                className={`w-80 ${theme.card} backdrop-blur-lg border-l overflow-y-auto`}
              >
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-bold text-white">Writing Analytics</h2>
                  
                  {/* Session Stats */}
                  <Card className={theme.card}>
                    <CardHeader>
                      <CardTitle className="text-white">Current Session</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Duration</span>
                        <span className="text-white">
                          {currentSession ? 
                            Math.floor((Date.now() - currentSession.startTime.getTime()) / 60000) + 'm' 
                            : '0m'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Words Written</span>
                        <span className="text-white">{wordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">WPM</span>
                        <span className="text-white">
                          {currentSession ? 
                            Math.round(wordCount / Math.max(1, (Date.now() - currentSession.startTime.getTime()) / 60000))
                            : 0
                          }
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Chart */}
                  <Card className={theme.card}>
                    <CardHeader>
                      <CardTitle className="text-white">Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300">Chapter Progress</span>
                            <span className="text-white">
                              {Math.round((chapterWordCount / (currentChapter?.targetWords || 2000)) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(chapterWordCount / (currentChapter?.targetWords || 2000)) * 100} 
                            className="h-2"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300">Novel Progress</span>
                            <span className="text-white">
                              {Math.round(((currentProject?.totalWords || 0) / (currentProject?.targetWords || 50000)) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={((currentProject?.totalWords || 0) / (currentProject?.targetWords || 50000)) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card className={theme.card}>
                    <CardHeader>
                      <CardTitle className="text-white">Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 bg-yellow-500/20 rounded-lg">
                          <Award className="w-5 h-5 text-yellow-400" />
                          <div>
                            <div className="text-sm font-medium text-white">First Chapter</div>
                            <div className="text-xs text-gray-400">Complete your first chapter</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-2 bg-blue-500/20 rounded-lg">
                          <Flame className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="text-sm font-medium text-white">Writing Streak</div>
                            <div className="text-xs text-gray-400">Write for 7 days straight</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-2 bg-green-500/20 rounded-lg">
                          <Target className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="text-sm font-medium text-white">Goal Crusher</div>
                            <div className="text-xs text-gray-400">Exceed daily goal 10 times</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Audio Element for Ambient Sounds */}
        <audio
          ref={audioRef}
          loop
          src={ambientSound ? ambientSounds.find(s => s.id === ambientSound)?.url : undefined}
          autoPlay={!!ambientSound}
        />
      </div>
    </TooltipProvider>
  );
}