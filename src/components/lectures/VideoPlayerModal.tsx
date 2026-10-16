import React, { useState, useRef, useEffect } from 'react';
import { Lecture, TimestampNote } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Bookmark,
  Plus,
  FileText,
  Clock,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';

interface Props {
  lecture: Lecture;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<Props> = ({ lecture, onClose }) => {
  const { toggleBookmarkLecture, openAiWithContext, addNote } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(lecture.durationSeconds || 2910);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'summary' | 'ai'>('notes');
  const [newNoteText, setNewNoteText] = useState('');
  const [timestampNotes, setTimestampNotes] = useState<TimestampNote[]>(lecture.timestampNotes || []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      const nextTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const handleJumpToTimestamp = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleAddTimestampNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const noteObj: TimestampNote = {
      timeInSeconds: Math.floor(currentTime),
      displayTime: formatTime(currentTime),
      text: newNoteText.trim(),
    };

    setTimestampNotes([...timestampNotes, noteObj]);
    addNote({
      title: `ملاحظة زمنية عند ${noteObj.displayTime}`,
      content: noteObj.text,
      subjectId: lecture.subjectId,
      subjectName: lecture.subjectName,
      lectureId: lecture.id,
      lectureTitle: lecture.title,
      timestamp: noteObj.displayTime,
      tags: ['ملاحظة محاضرة', 'فيديو'],
      pinned: false,
    });
    setNewNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="إغلاق المشغل"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-right">
              <h3 className="text-sm font-bold text-white truncate max-w-md">{lecture.title}</h3>
              <p className="text-[11px] text-slate-400">
                {lecture.instructor} • {lecture.room} • {lecture.subjectName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmarkLecture(lecture.id)}
              className={`p-2 rounded-xl border transition ${
                lecture.isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="حفظ في المحفوظات"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() =>
                openAiWithContext(
                  lecture.subjectName,
                  `قم بتلخيص المحاضرة بعنوان "${lecture.title}" مع توضيح أهم النقاط الامتحانية المتوقعة.`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>تلخيص بالذكاء الاصطناعي</span>
            </button>
          </div>
        </div>

        {/* Center Grid: Video on Left/Center, Notes/Interaction on Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Main Video View (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-black relative">
            {/* Video container */}
            <div className="relative flex-1 flex items-center justify-center">
              <video
                ref={videoRef}
                src={lecture.videoUrl}
                className="w-full h-full object-contain max-h-[58vh]"
                autoPlay
                playsInline
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration || lecture.durationSeconds);
                  }
                }}
                onEnded={() => setIsPlaying(false)}
              />
            </div>

            {/* Custom Control Bar */}
            <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent space-y-2">
              {/* Progress Slider */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400 w-10 text-left">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-slate-700 accent-blue-500 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-600/30"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-2 text-slate-400 hover:text-white transition"
                    title="تراجع 10 ثوانٍ"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSkip(10)}
                    className="p-2 text-slate-400 hover:text-white transition"
                    title="تقديم 10 ثوانٍ"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                        setIsMuted(!isMuted);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-white transition"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed button */}
                  <button
                    onClick={handleSpeedChange}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
                  >
                    {playbackRate}x
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          videoRef.current.requestFullscreen();
                        }
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-white transition"
                    title="تكبير الشاشة"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Notes & Timestamps Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-800 flex flex-col h-full text-right">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-900/60 p-1">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === 'notes' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ملاحظات زمنية ({timestampNotes.length})
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === 'summary' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                وصف المحاضرة
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeTab === 'notes' && (
                <>
                  <p className="text-[11px] text-slate-400">
                    اضغط على أي وقت للانتقال مباشرة إلى المقطع المعني:
                  </p>

                  <div className="space-y-2">
                    {timestampNotes.map((tn, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleJumpToTimestamp(tn.timeInSeconds)}
                        className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer flex items-start gap-2.5 group"
                      >
                        <span className="px-2 py-0.5 rounded-lg bg-blue-600/30 text-blue-300 text-[10px] font-mono font-bold shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition">
                          {tn.displayTime}
                        </span>
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">{tn.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <span className="font-bold text-white block mb-1">الهدف التعليمي:</span>
                    <p>{lecture.description}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <span className="font-bold text-white block mb-1">توصيات أستاذ المادة:</span>
                    <p>• التركيز على أمثلة الواقع الصفي وكيفية تطبيق النظريات مع التلاميذ.</p>
                    <p>• مراجعة بنك الأسئلة المرفق للاختبار القصير القادم.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick add note at current timestamp */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/90">
              <form onSubmit={handleAddTimestampNote} className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>إضافة ملاحظة عند {formatTime(currentTime)}</span>
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="اكتب ملاحظتك هنا..."
                    className="flex-1 text-xs rounded-xl bg-slate-800 text-white placeholder-slate-500 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shrink-0"
                    title="حفظ الملاحظة"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
