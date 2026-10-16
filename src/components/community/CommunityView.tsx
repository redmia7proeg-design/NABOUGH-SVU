import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Post, Comment } from '../../types';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  Send,
  Sparkles,
  ShieldCheck,
  BarChart,
  Plus,
  Image,
  Paperclip,
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { currentUser, communityPosts, addPost, likePost } = useApp();
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const groups = [
    { id: 'all', label: 'كافة المنشورات' },
    { id: 'الفرقة الثالثة — علم النفس', label: 'الفرقة الثالثة — علم النفس' },
    { id: 'لوحة الإعلانات الرسمية بكلية التربية', label: 'لوحة الإعلانات الرسمية' },
    { id: 'ملتقى طلاب الفرقة الثالثة', label: 'ملتقى الطلاب' },
    { id: 'مجموعة التربية العملية الميدانية', label: 'التربية العملية' },
  ];

  const handleLike = async (postId: string) => {
    await likePost(postId);
  };

  const handleVotePoll = (postId: string, optionIndex: number) => {
    // Poll vote support
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    await addPost(
      newPostContent.trim(),
      activeGroup === 'all' ? 'الفرقة الثالثة — علم النفس' : activeGroup
    );
    setNewPostContent('');
  };

  const filteredPosts = (communityPosts || []).filter(
    (p) => activeGroup === 'all' || p.groupName === activeGroup
  );

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>المجتمع والملتقى الأكاديمي</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تواصل مع زملائك، أساتذة الكلية، وتابع الاستطلاعات والإعلانات الرسمية
          </p>
        </div>
      </div>

      {/* Group Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGroup(g.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition shrink-0 border ${
              activeGroup === g.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Create Post Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
          />
          <div className="text-right">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</h4>
            <span className="text-[10px] text-slate-400">{currentUser.specialization}</span>
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="شارك فكرة، سؤالاً أكاديمياً، أو استفساراً مع زملائك في الكلية..."
            rows={3}
            className="w-full text-xs lg:text-sm rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <button
                type="button"
                onClick={() => alert('يمكنك إرفاق صور المذكرات والملفات الأكاديمية!')}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition"
                title="إرفاق صورة"
              >
                <Image className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => alert('تم تفعيل إرفاق ملفات PDF والملخصات!')}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition"
                title="إرفاق ملف"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
              <span>نشر في المجتمع</span>
            </button>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="space-y-5">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-right"
          >
            {/* Post Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {post.authorName}
                    </h3>
                    {post.isOfficial && (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        <span>إعلان رسمي موثق</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{post.authorDepartment}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                    <span>•</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {post.groupName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-xs lg:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Poll Section if present */}
            {post.poll && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <BarChart className="w-4 h-4 text-blue-600" />
                  <span>استطلاع رأي: {post.poll.question}</span>
                </div>

                <div className="space-y-2">
                  {post.poll.options.map((opt, optIdx) => {
                    const percentage = Math.round(
                      (opt.votes / (post.poll?.totalVotes || 1)) * 100
                    );
                    const isVoted = post.poll?.userVotedIndex === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleVotePoll(post.id, optIdx)}
                        className={`w-full text-right p-3 rounded-xl border text-xs font-semibold transition relative overflow-hidden flex items-center justify-between ${
                          isVoted
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {/* Progress Fill bar */}
                        <div
                          className="absolute inset-y-0 right-0 bg-blue-500/10 pointer-events-none transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                        <span className="relative z-10">{opt.text}</span>
                        <span className="relative z-10 font-mono text-[11px] text-slate-400">
                          {percentage}% ({opt.votes} صوت)
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 text-left font-mono">
                  إجمالي الأصوات: {post.poll.totalVotes}
                </p>
              </div>
            )}

            {/* Post Interaction Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition ${
                    post.userLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes} إعجاب</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>{post.commentsCount} تعليقات</span>
                </div>
              </div>

              <button
                onClick={() => alert('تم نسخ رابط المنشور للمشاركة!')}
                className="hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {post.comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-start gap-2.5">
                    <img
                      src={c.authorAvatar}
                      alt={c.authorName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={commentInputs[post.id] || ''}
                onChange={(e) =>
                  setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                }
                placeholder="اكتب تعليقاً على هذا المنشور..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment(post.id);
                }}
                className="flex-1 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shrink-0"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
