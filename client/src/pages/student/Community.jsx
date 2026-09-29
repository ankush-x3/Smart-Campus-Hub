import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, MoreHorizontal } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function Community() {
  const [posts, setPosts] = useState([]);

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community');
      setPosts((res.data.data || res.data || []).map(p => ({
        ...p,
        id: p._id,
        author: p.author?.name || 'Unknown User',
        role: p.author?.role || 'Student',
        time: new Date(p.createdAt).toLocaleDateString(),
        likes: p.likes?.length || 0,
        comments: p.comments?.length || 0,
        isLiked: p.likes?.includes('current-user-id') // Assuming user auth could provide this, omitting for now
      })));
    } catch (err) {
      console.error(err);
    }
  };
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const categories = ['All', 'General', 'Academic', 'Events', 'Sports', 'Lost & Found', 'Marketplace'];

    const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get('content');
    const category = formData.get('category') || 'general';
    const tagsString = formData.get('tags');
    const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : [];
    
    try {
      const res = await api.post('/community', { content, category, tags });
      toast.success('Post published!');
      setIsPostModalOpen(false);
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    }
  };

  const toggleLike = (id) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const filteredPosts = posts.filter(p => categoryFilter === 'All' || p.category === categoryFilter);

  return (
    <div className="space-y-6 animate-in fade-in p-6 max-w-3xl mx-auto">
      {/* Create Post Area */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
            A
          </div>
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="flex-1 text-left bg-slate-100 hover:bg-slate-200 transition-colors px-6 py-3.5 rounded-full text-slate-500 font-medium"
          >
            What's on your mind?
          </button>
        </div>
        <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100 justify-around">
          <button onClick={() => setIsPostModalOpen(true)} className="flex items-center text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"><ImageIcon className="w-5 h-5 mr-2 text-emerald-500" /> Photo</button>
          <button onClick={() => setIsPostModalOpen(true)} className="flex items-center text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"><MessageCircle className="w-5 h-5 mr-2 text-blue-500" /> Discussion</button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              categoryFilter === cat ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 leading-tight">{post.author}</h4>
                    <p className="text-xs text-slate-500">{post.role} • {post.time}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
              </div>

              <Badge variant="secondary" className="mb-3">{post.category}</Badge>
              
              <p className="text-slate-700 mb-4 whitespace-pre-wrap">{post.content}</p>
              
              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(t => <span key={t} className="text-indigo-600 text-sm font-medium hover:underline cursor-pointer">#{t}</span>)}
                </div>
              )}
            </div>

            {post.image && (
              <div className="w-full h-64 bg-slate-100">
                <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
              <button 
                onClick={() => toggleLike(post.id)}
                className={clsx("flex items-center font-medium transition-colors", post.isLiked ? "text-rose-500" : "text-slate-500 hover:text-slate-700")}
              >
                <Heart className={clsx("w-5 h-5 mr-1.5", post.isLiked && "fill-current")} /> {post.likes}
              </button>
              <button className="flex items-center text-slate-500 hover:text-slate-700 font-medium transition-colors">
                <MessageCircle className="w-5 h-5 mr-1.5" /> {post.comments} Comments
              </button>
              <button className="flex items-center text-slate-500 hover:text-slate-700 font-medium transition-colors">
                <Share2 className="w-5 h-5 mr-1.5" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title="Create Post">
        <form onSubmit={handleCreatePost} className="p-2 space-y-4">
          <textarea 
            name="content"
            required
            rows={4} 
            placeholder="What's on your mind?" 
            className="w-full border-none outline-none resize-none text-lg placeholder:text-slate-400 focus:ring-0 p-0"
            autoFocus
          ></textarea>
          
          <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-3">
            <select name="category" className="w-full border-none outline-none text-sm text-slate-700 bg-transparent cursor-pointer">
              <option value="" disabled selected>Select Category</option>
              <option value="general">General</option>
              <option value="academic">Academic</option>
              <option value="events">Events</option>
              <option value="sports">Sports</option>
              <option value="lost-found">Lost & Found</option>
              <option value="marketplace">Marketplace</option>
            </select>
            <div className="h-px bg-slate-100 w-full"></div>
            <input type="text" name="tags" placeholder="Add tags (comma separated)" className="w-full border-none outline-none text-sm placeholder:text-slate-400" />
          </div>

          <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
            <span className="text-sm font-semibold text-slate-700 flex items-center"><ImageIcon className="w-5 h-5 mr-2 text-emerald-500" /> Add Photo (coming soon)</span>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center hover:bg-indigo-700 transition-colors">
            <Send className="w-4 h-4 mr-2" /> Publish Post
          </button>
        </form>
      </Modal>
    </div>
  );
}


