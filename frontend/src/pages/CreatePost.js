import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { generateCaption, regenerateCaption, createPost } from '../utils/api';

function CreatePost() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle multiple image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 12) {
      setError('Maximum 12 images allowed');
      return;
    }

    // Check file sizes (300MB each)
    const oversized = files.find(file => file.size > 300 * 1024 * 1024);
    if (oversized) {
      setError('Each image must be under 300MB');
      return;
    }

    setImages(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    setError('');
  };

  // Remove an image
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Generate caption with AI
  const handleGenerateCaption = async () => {
    if (!description.trim()) {
      setError('Please describe your images');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await generateCaption({ description, tone, length });
      setCaption(response.data.caption);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate caption');
    } finally {
      setLoading(false);
    }
  };

  // Regenerate caption
  const handleRegenerateCaption = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await regenerateCaption({
        description,
        previousCaption: caption,
        feedback: 'Make it better',
        tone
      });
      setCaption(response.data.caption);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to regenerate caption');
    } finally {
      setLoading(false);
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    if (images.length === 0 || !caption || !description) {
      setError('Please complete all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Append all images
      images.forEach((image) => {
        formData.append('images', image);
      });
      
      formData.append('caption', caption);
      formData.append('userDescription', description);
      formData.append('status', 'draft');
      formData.append('platform', 'linkedin');

      await createPost(formData);
      setSuccess('Post saved as draft!');
      setTimeout(() => navigate('/drafts'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  // Post immediately
  const handlePost = async () => {
    if (images.length === 0 || !caption || !description) {
      setError('Please complete all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Append all images
      images.forEach((image) => {
        formData.append('images', image);
      });
      
      formData.append('caption', caption);
      formData.append('userDescription', description);
      formData.append('status', 'posted');
      formData.append('platform', 'linkedin');

      await createPost(formData);
      setSuccess('Post created successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-2">Upload up to 12 images (300MB each) and let AI generate the perfect caption</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Upload Images</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div className={`h-full transition-all ${step >= 2 ? 'bg-blue-600 w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Generate Caption</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div className={`h-full transition-all ${step >= 3 ? 'bg-blue-600 w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Review & Post</span>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Step 1: Upload Images */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (up to 12, max 300MB each)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="images-upload"
                  />
                  <label htmlFor="images-upload" className="cursor-pointer">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 mb-2">Click to upload images</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF, WEBP up to 300MB each</p>
                    <p className="text-sm text-gray-500">Maximum 12 images</p>
                  </label>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">{imagePreviews.length} image(s) selected</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imagePreviews.length > 0 && (
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Continue to Caption Generation
                </button>
              )}
            </div>
          )}

          {/* Step 2: Generate Caption */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Images
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E.g., Team Kenya at FIRST Global Robotics Challenge in Greece, showcasing our innovative climate solution robot"
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="inspiring">Inspiring</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                      <select
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview ({imagePreviews.length} images)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                    {imagePreviews.map((preview, index) => (
                      <img 
                        key={index}
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateCaption}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Caption with AI'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Post */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Images ({imagePreviews.length})
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={preview} 
                          alt={`Image ${index + 1}`} 
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows="15"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleRegenerateCaption}
                    disabled={loading}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Regenerating...' : '↻ Regenerate Caption'}
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={handlePost}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePost;