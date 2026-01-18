import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPosts, deletePost, updatePost } from '../utils/api';

function Drafts({ onLogout }) {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState('');

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await getPosts({ status: 'draft' });
      setDrafts(response.data.posts);
    } catch (err) {
      setError('Failed to load drafts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) {
      return;
    }

    try {
      await deletePost(id);
      setDrafts(drafts.filter(draft => draft._id !== id));
    } catch (err) {
      setError('Failed to delete draft');
      console.error(err);
    }
  };

  const handleEdit = (draft) => {
    setEditingId(draft._id);
    setEditCaption(draft.caption);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCaption('');
  };

  const handleSaveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append('caption', editCaption);
      formData.append('status', 'draft');

      await updatePost(id, formData);
      
      // Update local state
      setDrafts(drafts.map(draft => 
        draft._id === id ? { ...draft, caption: editCaption } : draft
      ));
      
      setEditingId(null);
      setEditCaption('');
    } catch (err) {
      setError('Failed to update draft');
      console.error(err);
    }
  };

  const handlePostNow = async (id) => {
    if (!window.confirm('Are you sure you want to post this now?')) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('status', 'posted');

      await updatePost(id, formData);
      setDrafts(drafts.filter(draft => draft._id !== id));
      alert('Post published successfully!');
    } catch (err) {
      setError('Failed to post draft');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Drafts</h1>
            <p className="text-gray-600 mt-2">Manage your saved draft posts</p>
          </div>
          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Post
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading drafts...</p>
          </div>
        ) : drafts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No drafts yet</h2>
            <p className="text-gray-600 mb-6">Create your first draft to see it here</p>
            <Link
              to="/create"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Create Your First Draft
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {drafts.map(draft => (
              <div key={draft._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  {/* Images Section */}
                  <div className="md:w-1/3">
                    {draft.images && draft.images.length > 0 ? (
                      <div className="relative h-64 md:h-full">
                        <img 
                          src={`http://localhost:5000/${draft.images[0]}`}
                          alt="Draft"
                          className="w-full h-full object-cover"
                        />
                        {draft.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                            +{draft.images.length - 1} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {draft.userDescription}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(draft.createdAt).toLocaleDateString()}
                          </span>
                          {draft.images && draft.images.length > 0 && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {draft.images.length} image{draft.images.length > 1 ? 's' : ''}
                            </span>
                          )}
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                            Draft
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Caption */}
                    {editingId === draft._id ? (
                      <div className="mb-4">
                        <textarea
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          rows="6"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleSaveEdit(draft._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-gray-700 whitespace-pre-wrap line-clamp-4">
                          {draft.caption}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    {editingId !== draft._id && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(draft)}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Caption
                        </button>
                        <button
                          onClick={() => handlePostNow(draft._id)}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-200 transition flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Post Now
                        </button>
                        <button
                          onClick={() => handleDelete(draft._id)}
                          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Show all images when expanded */}
                {draft.images && draft.images.length > 1 && (
                  <details className="border-t border-gray-200">
                    <summary className="px-6 py-3 cursor-pointer text-sm text-gray-600 hover:bg-gray-50 transition">
                      View all {draft.images.length} images
                    </summary>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50">
                      {draft.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={`http://localhost:5000/${image}`}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Drafts;
