import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlatformSelector from '../components/PlatformSelector';
import { getAnalytics, getPosts } from '../utils/api';

function Dashboard({ onLogout }) {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedPlatform]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = selectedPlatform !== 'all' ? { platform: selectedPlatform } : {};
      const [analyticsRes, postsRes] = await Promise.all([
        getAnalytics(params),
        getPosts(params)
      ]);
      
      setAnalytics(analyticsRes.data);
      setRecentPosts(postsRes.data.posts.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">Welcome back! Here's your social media overview.</p>
        </div>

        {/* Platform Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Select Platform</h2>
          <PlatformSelector 
            selectedPlatform={selectedPlatform} 
            onSelect={setSelectedPlatform}
            showAll={true}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl p-6 text-white transform hover:scale-105 transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Total Posts</p>
                    <p className="text-4xl font-bold mt-2">{analytics?.totalPosts || 0}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm opacity-80">
                  {analytics?.postedPosts || 0} published • {analytics?.draftPosts || 0} drafts
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl shadow-xl p-6 text-white transform hover:scale-105 transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Scheduled</p>
                    <p className="text-4xl font-bold mt-2">{analytics?.scheduledPosts || 0}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm opacity-80">
                  Upcoming posts
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-xl p-6 text-white transform hover:scale-105 transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Engagement</p>
                    <p className="text-4xl font-bold mt-2">
                      {(analytics?.totalLikes || 0) + (analytics?.totalComments || 0) + (analytics?.totalShares || 0)}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm opacity-80">
                  Total interactions
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-xl p-6 text-white transform hover:scale-105 transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Reach</p>
                    <p className="text-4xl font-bold mt-2">{analytics?.totalImpressions || 0}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm opacity-80">
                  Total impressions
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-dark-card border border-dark-border rounded-xl shadow-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-100 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  to="/create"
                  className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-lg transition shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Post
                </Link>
                <Link 
                  to="/scheduled"
                  className="flex items-center justify-center bg-dark-hover hover:bg-gray-700 text-gray-200 px-6 py-4 rounded-lg transition border border-dark-border shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Scheduled
                </Link>
                <Link 
                  to="/analytics"
                  className="flex items-center justify-center bg-dark-hover hover:bg-gray-700 text-gray-200 px-6 py-4 rounded-lg transition border border-dark-border shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-dark-card border border-dark-border rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-100 mb-4">Recent Posts</h2>
              {recentPosts.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400 mb-4">No posts yet for {selectedPlatform === 'all' ? 'any platform' : selectedPlatform}</p>
                  <Link 
                    to="/create"
                    className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition shadow-lg"
                  >
                    Create Your First Post
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map(post => (
                    <div key={post._id} className="bg-dark-hover border border-dark-border rounded-lg p-4 hover:bg-gray-800 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{getPlatformIcon(post.platform)}</span>
                            <span className="text-sm text-gray-400 capitalize">{post.platform}</span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{post.userDescription}</p>
                          <p className="text-gray-200 line-clamp-2">{post.caption}</p>
                          <div className="flex items-center mt-3 space-x-4">
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              post.status === 'draft' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' :
                              post.status === 'scheduled' ? 'bg-purple-900/50 text-purple-300 border border-purple-700' :
                              post.status === 'posted' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                              'bg-red-900/50 text-red-300 border border-red-700'
                            }`}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            {post.media && post.media.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {post.media.length} file{post.media.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        {post.media && post.media.length > 0 && (
                          <div className="ml-4">
                            {post.media[0].endsWith('.mp4') || post.media[0].endsWith('.mov') || post.media[0].endsWith('.webm') ? (
                              <video 
                                src={`http://localhost:5000/${post.media[0]}`}
                                className="w-24 h-24 object-cover rounded-lg"
                                muted
                              />
                            ) : (
                              <img 
                                src={`http://localhost:5000/${post.media[0]}`}
                                alt="Post" 
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
