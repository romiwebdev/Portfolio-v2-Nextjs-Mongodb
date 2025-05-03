import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Plus, Edit, Trash2, Upload, X, Calendar, Link as LinkIcon } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function ManageCertificates() {
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    image: '',
    issuer: '',
    issueDate: new Date().toISOString().split('T')[0],
    credentialLink: '',
    description: '',
    tags: []
  });

  // Fetch certificates
  useEffect(() => {
    // Pada fungsi fetchCertificates
    const fetchCertificates = async () => {
      try {
        const res = await fetch('/api/certificates?sort=-issueDate'); // Tambahkan query parameter
        const data = await res.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tags change
  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      tags: value.split(',').map(tag => tag.trim())
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Tampilkan preview segera
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);

      // Convert ke base64 untuk dikirim ke API
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      // Panggil API upload
      const response = await fetch('/api/certificates/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      // Simpan URL gambar ke form data
      setFormData(prev => ({
        ...prev,
        image: data.url
      }));

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error: ' + error.message);
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.image) {
      alert('Please upload an image first');
      return;
    }

    if (uploading) {
      alert('Please wait until the image finishes uploading');
      return;
    }

    try {
      const method = currentCertificate ? 'PUT' : 'POST';
      const url = currentCertificate
        ? `/api/certificates/${currentCertificate.id}`
        : '/api/certificates';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save certificate');
      }

      // Refresh data
      const updatedCertificates = await fetch('/api/certificates').then(res => res.json());
      setCertificates(updatedCertificates);
      setIsModalOpen(false);
      resetForm();

    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  // Edit certificate
  const handleEdit = (certificate) => {
    setCurrentCertificate(certificate);
    setFormData({
      id: certificate.id,
      title: certificate.title,
      image: certificate.image,
      issuer: certificate.issuer,
      issueDate: new Date(certificate.issueDate).toISOString().split('T')[0],
      credentialLink: certificate.credentialLink || '',
      description: certificate.description || '',
      tags: certificate.tags || []
    });
    setImagePreview(certificate.image);
    setIsModalOpen(true);
  };

  // Delete certificate
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/certificates/${currentCertificate.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCertificates = certificates.filter(c => c.id !== currentCertificate.id);
        setCertificates(updatedCertificates);
        setIsConfirmOpen(false);
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      image: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      credentialLink: '',
      description: '',
      tags: []
    });
    setImagePreview('');
    setCurrentCertificate(null);
  };

  return (
    <>
      <Head>
        <title>Manage Certificates</title>
      </Head>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Certificates</h2>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Certificate
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">{certificate.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Issued by: {certificate.issuer}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={14} className="mr-1" />
                    {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(certificate)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentCertificate(certificate);
                        setIsConfirmOpen(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-medium mb-4">
          {currentCertificate ? 'Edit Certificate' : 'Add New Certificate'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-form-label">Certificate ID</label>
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
            <label className="admin-form-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="admin-form-input"
              required
            />
          </div>

          <div>
            <label className="admin-form-label">Issuer</label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              className="admin-form-input"
              required
            />
          </div>


          <div className="mb-4">
            <label className="admin-form-label">
              Certificate Image <span className="text-red-500">*</span>
            </label>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-full object-contain rounded border border-gray-300"
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center bg-gray-100 rounded border border-dashed text-gray-400">
                    No image selected
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${uploading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50 cursor-pointer'}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Select Image'
                  )}
                </label>

                {formData.image && (
                  <p className="mt-2 text-sm text-green-600">✓ Image ready</p>
                )}

                <p className="mt-1 text-xs text-gray-500">
                  Max file size: 4MB. Supported formats: JPG, PNG
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="admin-form-label">Issue Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="admin-form-input"
              required
              max={new Date().toISOString().split('T')[0]} // Tidak boleh lebih dari hari ini
            />
          </div>

          <div>
            <label className="admin-form-label">Credential Link</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LinkIcon size={16} className="text-gray-500" />
              </div>
              <input
                type="url"
                name="credentialLink"
                value={formData.credentialLink}
                onChange={handleChange}
                className="admin-form-input pl-10"
                placeholder="https://example.com/credential"
              />
            </div>
          </div>

          <div>
            <label className="admin-form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="admin-form-input"
              rows={3}
            />
          </div>

          <div>
            <label className="admin-form-label">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              className="admin-form-input"
              placeholder="React, JavaScript, Web Development"
            />
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
              {currentCertificate ? 'Update' : 'Save'} Certificate
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${currentCertificate?.title}"?`}
      />
    </>
  );
}