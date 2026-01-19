import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlatformSelector from '../components/PlatformSelector';
import { getScheduledPosts, deletePost, updatePost } from '../utils/api';

function Scheduled({ onLogout }) {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScheduledPosts();
  }, [selectedPlatform]);

  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const params = selectedPlatform !== 'all' ? { platform: selectedPlatform } : {};
      const response = await getScheduledPosts(params);
      setPosts(response.data.posts);
    } catch (err) {
      setError('Failed to load scheduled posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSchedule = async (id) => {
    if (!window.confirm('Cancel this scheduled post and move it to drafts?')) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('status', 'draft');
      await updatePost(id, formData);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError('Failed to cancel schedule');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheduled post?')) {
      return;
    }

    try {
      await deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      linkedin: '💼',
      twitter: '🐦',
      instagram: '📸',
      tiktok: '🎵',
      reddit: '🤖'
    };
    return icons[platform] || '📱';
  };

  const getTimeUntil = (scheduledFor) => {
    const now = new Date();
    const scheduled = new Date(scheduledFor);
    const diff = scheduled - now;
    
    if (diff < 0) return 'Processing...';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              Scheduled Posts
            </h1>
            <p className="text-gray-400">Manage your scheduled content</p>
          </div>
          <Link
            to="/create"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Schedule New Post
          </Link>
        </div>

        {/* Platform Selector */}
        <div className="mb-8">
          <PlatformSelector 
            selectedPlatform={selectedPlatform} 
            onSelect={setSelectedPlatform}
            showAll={true}
          />
        </div>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading scheduled posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-xl shadow-xl p-12 text-center">
            <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">No scheduled posts</h2>
            <p className="text-gray-500 mb-6">Schedule your first post to see it here</p>
            <Link
              to="/create"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
            >
              Schedule Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {posts.map(post => (
              <div key={post._id} className="bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden hover:border-purple-500 transition">
                <div className="md:flex">
                  {/* Media Preview */}
                  <div className="md:w-1/3">
                    {post.media && post.media.length > 0 ? (
                      <div className="relative h-64 md:h-full">
                        {post.media[0].endsWith('.mp4') || post.media[0].endsWith('.mov') || post.media[0].endsWith('.webm') ? (
                          <video 
                            src={`http://localhost:5000/${post.media[0]}`}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img 
                            src={`http://localhost:5000/${post.media[0]}`}
                            alt="Scheduled post"
                            className="w-full h-full object-cover"
                          />
                        )}
                        {post.media.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            +{post.media.length - 1} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-64 md:h-full bg-dark-hover flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 p-6">
                    {/* Platform and Time Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                        <div>
                          <p className="text-sm text-gray-400 capitalize">{post.platform}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.scheduledFor).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-purple-900/50 text-purple-300 px-4 py-2 rounded-lg border border-purple-700">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {getTimeUntil(post.scheduledFor)}
                      </div>
                    </div>

                    {/* Description */}
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">
                      {post.userDescription}
                    </h3>

                    {/* Caption */}
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.caption}
                    </p>

                    {/* Cross-posting badges */}
                    {post.crossPost && post.crossPost.enabled && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Also posting to:</p>
                        <div className="flex gap-2">
                          {post.crossPost.platforms.map(platform => (
                            <span key={platform} className="text-xs bg-dark-hover px-2 py-1 rounded border border-dark-border">
                              {getPlatformIcon(platform)} {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleCancelSchedule(post._id)}
                        className="bg-yellow-900/50 hover:bg-yellow-800/50 text-yellow-300 px-4 py-2 rounded-lg text-sm border border-yellow-700 transition flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Schedule
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-900/50 hover:bg-red-800/50 text-red-300 px-4 py-2 rounded-lg text-sm border border-red-700 transition flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Scheduled;