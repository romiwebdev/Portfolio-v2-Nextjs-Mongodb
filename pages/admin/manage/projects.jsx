import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableProjectRow from '@/components/admin/DraggableProjectRow';

export default function ManageProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [categories] = useState(['frontend', 'backend', 'fullstack', 'misc']);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    category: 'frontend',
    cover: '',
    name: '',
    desc: '',
    technologies: [{ name: '', style: '' }],
    links: { github: '', live: '' },
    details: { title: '', desc: '', features: [''] }
  });

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        // Urutkan berdasarkan order
        const sortedProjects = data.sort((a, b) => a.order - b.order);
        setProjects(sortedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const moveProject = (dragIndex, hoverIndex) => {
    setProjects((prevProjects) => {
      const updatedProjects = [...prevProjects];
      const [removed] = updatedProjects.splice(dragIndex, 1);
      updatedProjects.splice(hoverIndex, 0, removed);
      
      // Update order property
      return updatedProjects.map((project, idx) => ({
        ...project,
        order: idx
      }));
    });
  };

  const saveProjectOrder = async () => {
    try {
      const projectIds = projects.map(project => project.id);
      await fetch('/api/projects/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: projectIds }),
      });
    } catch (error) {
      console.error('Error saving project order:', error);
    }
  };
  
  // Gunakan useEffect untuk menyimpan urutan ketika projects berubah
  useEffect(() => {
    if (projects.length > 0 && !loading) {
      saveProjectOrder();
    }
  }, [projects]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
      return;
    }

    // Handle regular fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle technology change
  const handleTechChange = (index, field, value) => {
    const newTechs = [...formData.technologies];
    newTechs[index][field] = value;

    setFormData(prev => ({
      ...prev,
      technologies: newTechs
    }));
  };

  // Handle feature change
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.details.features];
    newFeatures[index] = value;

    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        features: newFeatures
      }
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large (max 5MB)');
      return;
    }

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPEG, PNG, GIF, or WEBP images are allowed');
      return;
    }

    const reader = new FileReader();

    reader.onloadstart = () => {
      setUploading(true);
      setImagePreview('');
    };

    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };

    reader.onerror = () => {
      setUploading(false);
      alert('Error reading file');
    };

    reader.onloadend = async () => {
      try {
        const response = await fetch('/api/projects/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: reader.result }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }

        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          cover: data.url
        }));
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Upload failed: ${error.message}`);
        setImagePreview('');
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Handle form submit
  // Pada fungsi handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi required fields
    if (!formData.cover) {
      alert('Cover image is required');
      return;
    }

    try {
      let response;
      const method = currentProject ? 'PUT' : 'POST';
      const url = currentProject
        ? `/api/projects/${currentProject.id}`
        : '/api/projects';

      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save project');
      }

      const updatedProjects = await fetch('/api/projects').then(res => res.json());
      setProjects(updatedProjects);
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error.message || 'Error saving project');
    }
  };

  // Edit project
  const handleEdit = (project) => {
    setCurrentProject(project);
    setFormData({
      id: project.id,
      category: project.category,
      cover: project.cover,
      name: project.name,
      desc: project.desc,
      technologies: project.technologies.length > 0
        ? project.technologies
        : [{ name: '', style: '' }],
      links: project.links || { github: '', live: '' },
      details: project.details || { title: '', desc: '', features: [''] }
    });
    setImagePreview(project.cover);
    setIsModalOpen(true);
  };

  // Delete project
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/projects/${currentProject.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedProjects = projects.filter(p => p.id !== currentProject.id);
        setProjects(updatedProjects);
        setIsConfirmOpen(false);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      category: 'frontend',
      cover: '',
      name: '',
      desc: '',
      technologies: [{ name: '', style: '' }],
      links: { github: '', live: '' },
      details: { title: '', desc: '', features: [''] }
    });
    setImagePreview('');
    setCurrentProject(null);
  };

  // Add technology field
  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, { name: '', style: '' }]
    }));
  };

  // Remove technology field
  const removeTechnology = (index) => {
    const newTechs = formData.technologies.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      technologies: newTechs.length > 0 ? newTechs : [{ name: '', style: '' }]
    }));
  };

  // Add feature field
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        features: [...prev.details.features, '']
      }
    }));
  };

  // Remove feature field
  const removeFeature = (index) => {
    const newFeatures = formData.details.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        features: newFeatures.length > 0 ? newFeatures : ['']
      }
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Head>
        <title>Manage Projects</title>
      </Head>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Projects</h2>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Project
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project, index) => (
                  <DraggableProjectRow
                    key={project.id}
                    project={project}
                    index={index}
                    moveProject={moveProject}
                    handleEdit={handleEdit}
                    handleDelete={(project) => {
                      setCurrentProject(project);
                      setIsConfirmOpen(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-medium mb-4">
          {currentProject ? 'Edit Project' : 'Add New Project'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Project ID</label>
              <input
                type="text"
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="admin-form-label">
              Cover Image <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 w-full object-contain rounded border border-gray-200"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white font-medium">Uploading...</div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-4">
                <label className="flex-1 flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100">
                  <Upload size={24} className="mb-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {uploading ? 'Uploading...' : 'Click to upload'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {!formData.cover && !uploading && (
                <p className="text-sm text-red-600">Please upload a cover image</p>
              )}
            </div>
          </div>

          <div>
            <label className="admin-form-label">Project Name</label>
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
            <label className="admin-form-label">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              className="admin-form-input"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="admin-form-label">Technologies</label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tech.name}
                  onChange={(e) => handleTechChange(index, 'name', e.target.value)}
                  placeholder="Technology name"
                  className="admin-form-input flex-1"
                  required
                />
                <input
                  type="text"
                  value={tech.style}
                  onChange={(e) => handleTechChange(index, 'style', e.target.value)}
                  placeholder="CSS class (e.g. badge_react)"
                  className="admin-form-input flex-1"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeTechnology(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTechnology}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Technology
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">GitHub Link</label>
              <input
                type="url"
                name="links.github"
                value={formData.links.github}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>

            <div>
              <label className="admin-form-label">Live Demo Link</label>
              <input
                type="url"
                name="links.live"
                value={formData.links.live}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>
          </div>

          <div>
            <label className="admin-form-label">Details Title</label>
            <input
              type="text"
              name="details.title"
              value={formData.details.title}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>

          <div>
            <label className="admin-form-label">Details Description</label>
            <textarea
              name="details.desc"
              value={formData.details.desc}
              onChange={handleChange}
              className="admin-form-input"
              rows={3}
            />
          </div>


          <div>
            <label className="admin-form-label">Features</label>
            {formData.details.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...formData.details.features];
                    newFeatures[index] = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        features: newFeatures
                      }
                    }));
                  }}
                  className="admin-form-input flex-1"
                  placeholder={`Feature ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newFeatures = formData.details.features.filter((_, i) => i !== index);
                    setFormData(prev => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        features: newFeatures.length > 0 ? newFeatures : ['']
                      }
                    }));
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    features: [...prev.details.features, '']
                  }
                }));
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Feature
            </button>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {currentProject ? 'Update' : 'Save'} Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${currentProject?.name}"?`}
      />
    </DndProvider>
  );
}