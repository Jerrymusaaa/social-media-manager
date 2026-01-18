import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getAnalytics, getPosts } from '../utils/api';

function Analytics({ onLogout }) {
  const [analytics, setAnalytics] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, postsRes] = await Promise.all([
        getAnalytics(),
        getPosts()
      ]);
      
      setAnalytics(analyticsRes.data);
      setPosts(postsRes.data.posts);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEngagementRate = () => {
    if (!analytics || analytics.totalPosts === 0) return 0;
    const totalEngagement = analytics.totalLikes + analytics.totalComments + analytics.totalShares;
    return ((totalEngagement / (analytics.totalPosts * 100)) * 100).toFixed(1);
  };

  const getTopPosts = () => {
    return posts
      .filter(p => p.status === 'posted')
      .sort((a, b) => {
        const engagementA = a.analytics.likes + a.analytics.comments + a.analytics.shares;
        const engagementB = b.analytics.likes + b.analytics.comments + b.analytics.shares;
        return engagementB - engagementA;
      })
      .slice(0, 5);
  };

  const getRecentActivity = () => {
    return posts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your social media performance</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold opacity-90">Total Posts</h3>
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">{analytics?.totalPosts || 0}</p>
                <p className="text-sm mt-2 opacity-80">
                  {analytics?.postedPosts || 0} published, {analytics?.draftPosts || 0} drafts
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold opacity-90">Total Engagement</h3>
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">
                  {(analytics?.totalLikes || 0) + (analytics?.totalComments || 0) + (analytics?.totalShares || 0)}
                </p>
                <p className="text-sm mt-2 opacity-80">
                  {getEngagementRate()}% engagement rate
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold opacity-90">Total Reach</h3>
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">{analytics?.totalImpressions || 0}</p>
                <p className="text-sm mt-2 opacity-80">Total impressions</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold opacity-90">Avg. Engagement</h3>
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">
                  {analytics?.totalPosts > 0 
                    ? Math.round(((analytics?.totalLikes || 0) + (analytics?.totalComments || 0) + (analytics?.totalShares || 0)) / analytics.totalPosts)
                    : 0}
                </p>
                <p className="text-sm mt-2 opacity-80">Per post</p>
              </div>
            </div>

            {/* Detailed Engagement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{analytics?.totalLikes || 0}</p>
                    <p className="text-sm text-gray-600">Total Likes</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Avg per post: <span className="font-semibold text-gray-900">
                      {analytics?.totalPosts > 0 ? Math.round((analytics?.totalLikes || 0) / analytics.totalPosts) : 0}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{analytics?.totalComments || 0}</p>
                    <p className="text-sm text-gray-600">Total Comments</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Avg per post: <span className="font-semibold text-gray-900">
                      {analytics?.totalPosts > 0 ? Math.round((analytics?.totalComments || 0) / analytics.totalPosts) : 0}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{analytics?.totalShares || 0}</p>
                    <p className="text-sm text-gray-600">Total Shares</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Avg per post: <span className="font-semibold text-gray-900">
                      {analytics?.totalPosts > 0 ? Math.round((analytics?.totalShares || 0) / analytics.totalPosts) : 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing Posts */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Top Performing Posts
                </h2>
                {getTopPosts().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No posted content yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getTopPosts().map((post, index) => (
                      <div key={post._id} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {post.userDescription}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              ❤️ {post.analytics.likes}
                            </span>
                            <span className="flex items-center">
                              💬 {post.analytics.comments}
                            </span>
                            <span className="flex items-center">
                              🔄 {post.analytics.shares}
                            </span>
                          </div>
                        </div>
                        {post.image && (
                          <img 
                            src={`http://localhost:5000/${post.image}`}
                            alt="Post"
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Activity
                </h2>
                {getRecentActivity().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {getRecentActivity().map((post) => (
                      <div key={post._id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                          post.status === 'posted' ? 'bg-green-500' :
                          post.status === 'scheduled' ? 'bg-purple-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {post.userDescription}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              post.status === 'posted' ? 'bg-green-100 text-green-800' :
                              post.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Post Status Breakdown */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Post Status Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{analytics?.totalPosts || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Posts</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">{analytics?.draftPosts || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Drafts</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{analytics?.scheduledPosts || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Scheduled</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{analytics?.postedPosts || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Published</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
