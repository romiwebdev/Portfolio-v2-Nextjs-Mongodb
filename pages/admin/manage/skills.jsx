import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function ManageSkills() {
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [categories] = useState(['proficient', 'comfortable', 'other']);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '',
    category: 'proficient'
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        const data = await res.json();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle emoji input
    if (name === 'icon' && value.length > 0 && !value.startsWith('http')) {
      setFormData(prev => ({ ...prev, [name]: value }));
      setImagePreview(value);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadError('No file selected');
      return;
    }

    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only SVG, PNG, or JPG images are allowed');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setImagePreview(imageDataUrl);

        fetch('/api/skills/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageDataUrl }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.url) {
            setFormData(prev => ({ ...prev, icon: data.url }));
          } else {
            setUploadError(data.message || 'Failed to upload image');
          }
        })
        .catch(error => {
          console.error('Upload error:', error);
          setUploadError('Error uploading image');
        })
        .finally(() => {
          setUploading(false);
        });
      };

      reader.onerror = () => {
        setUploadError('Failed to read file');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error:', error);
      setUploadError('An error occurred');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.icon) {
      setUploadError('Please add an icon or emoji');
      return;
    }

    try {
      const method = currentSkill ? 'PUT' : 'POST';
      const url = currentSkill ? `/api/skills/${currentSkill.id}` : '/api/skills';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: Number(formData.id)
        }),
      });

      if (response.ok) {
        const updatedSkills = await fetch('/api/skills').then(res => res.json());
        setSkills(updatedSkills);
        resetForm();
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save skill');
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      setUploadError(error.message || 'Error saving skill');
    }
  };

  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    setFormData({
      id: skill.id.toString(),
      name: skill.name,
      icon: skill.icon,
      category: skill.category
    });
    setImagePreview(skill.icon);
    setIsModalOpen(true);
    setUploadError('');
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/skills/${currentSkill.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedSkills = skills.filter(s => s.id !== currentSkill.id);
        setSkills(updatedSkills);
        setIsConfirmOpen(false);
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      setUploadError('Error deleting skill');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      icon: '',
      category: 'proficient'
    });
    setImagePreview('');
    setCurrentSkill(null);
    setUploadError('');
  };

  return (
    <>
      <Head>
        <title>Manage Skills</title>
      </Head>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Skills</h2>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Skill
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skills.map((skill) => (
                  <tr key={skill.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {skill.icon.match(/^[\p{Emoji}]$/u) ? (
                        <span className="text-2xl">{skill.icon}</span>
                      ) : (
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="h-10 w-10 object-contain"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        skill.category === 'proficient' ? 'bg-blue-100 text-blue-800' :
                        skill.category === 'comfortable' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      } capitalize`}>
                        {skill.category === 'other' ? 'strong foundation' : skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentSkill(skill);
                          setIsConfirmOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-medium mb-4">
          {currentSkill ? 'Edit Skill' : 'Add New Skill'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Skill ID</label>
              <input
                type="number"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="admin-form-input"
                required
              />
            </div>
            
            <div>
              <label className="admin-form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="admin-form-input"
                required
              >
                <option value="proficient">Proficient ⚡</option>
                <option value="comfortable">Comfortable 🛠️</option>
                <option value="other">Strong Foundation 💪</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="admin-form-label">Skill Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="admin-form-input"
              required
            />
          </div>
          
          <div>
            <label className="admin-form-label">Icon</label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  imagePreview.match(/^[\p{Emoji}]$/u) ? (
                    <div className="h-16 w-16 flex items-center justify-center text-4xl bg-gray-100 rounded">
                      {imagePreview}
                    </div>
                  ) : (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-16 w-16 object-contain bg-gray-100 rounded"
                    />
                  )
                ) : (
                  <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded">
                    <span className="text-gray-400">No icon</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 1: Use Emoji
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon.match(/^[\p{Emoji}]$/u) ? formData.icon : ''}
                    onChange={handleChange}
                    placeholder="Paste emoji (e.g. 🎯, 🔐)"
                    className="admin-form-input"
                    maxLength="2"
                  />
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 2: Upload Image
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
                    <Upload size={16} />
                    {uploading ? 'Uploading...' : 'Choose Image (SVG/PNG/JPG)'}
                    <input
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
              
              {uploadError && (
                <p className="text-xs text-red-500 mt-1">{uploadError}</p>
              )}
              {formData.icon && !uploading && (
                <p className="text-xs text-green-500 mt-1">
                  {formData.icon.match(/^[\p{Emoji}]$/u) 
                    ? 'Emoji selected' 
                    : 'Image ready to save'}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.icon}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                (uploading || !formData.icon) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {currentSkill ? 'Update' : 'Save'} Skill
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Skill"
        message={`Are you sure you want to delete "${currentSkill?.name}"?`}
      />
    </>
  );
}