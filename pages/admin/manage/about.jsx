import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Upload, Save, Image as ImageIcon, FileText, AlertCircle, Info } from 'lucide-react';
import Modal from '@/components/admin/Modal';

export default function ManageAbout() {
    const [aboutData, setAboutData] = useState({
        name: '',
        profileImage: '',
        about_1: '',
        what_i_love: '',
        my_hobbies: '',
        apps_i_use: '',
        my_journey: '',
        fun_fact: ''
    });
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // Fetch about data
    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await fetch('/api/about');
                const data = await res.json();
                if (data) {
                    setAboutData(data);
                    setImagePreview(data.profileImage || '');
                }
            } catch (error) {
                console.error('Error fetching about data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Buat URL object untuk preview lokal
        const localPreviewUrl = URL.createObjectURL(file);
        setImagePreview(localPreviewUrl);

        // Simpan file untuk diupload nanti
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                setUploading(true);
                const response = await fetch('/api/about/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: reader.result }),
                });

                const data = await response.json();
                if (response.ok) {
                    setAboutData(prev => ({
                        ...prev,
                        profileImage: data.url
                    }));
                    setFormErrors(prev => ({
                        ...prev,
                        profileImage: null
                    }));
                } else {
                    throw new Error(data.message || 'Upload failed');
                }
            } catch (error) {
                console.error('Upload error:', error);
                setImagePreview('');
                setFormErrors(prev => ({
                    ...prev,
                    profileImage: error.message || 'Failed to upload image'
                }));
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // Validate form before submit
    const validateForm = () => {
        const errors = {};

        if (!aboutData.profileImage && !imagePreview) {
            errors.profileImage = 'Please upload a profile image';
        }

        if (!aboutData.profileImage) {
            errors.profileImage = 'Profile image is required';
        }
        if (!aboutData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!aboutData.about_1.trim()) {
            errors.about_1 = 'About section is required';
        }
        // Add validation for other required fields as needed

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setIsModalOpen(true);
            setModalContent('Please complete all required fields');
            return;
        }

        // Jika ada preview tapi belum diupload
        if (imagePreview && !aboutData.profileImage) {
            setIsModalOpen(true);
            setModalContent('Please wait until image upload completes');
            return;
        }

        try {
            const response = await fetch('/api/about', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aboutData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setAboutData(updatedData);
                setIsModalOpen(true);
                setModalContent('About page updated successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update about page');
            }
        } catch (error) {
            console.error('Error saving about data:', error);
            setIsModalOpen(true);
            setModalContent(error.message || 'Error updating about page');
        }
    };
    // Preview content with formatting
    const previewContent = (content) => {
        // Handle undefined or null content
        if (!content) return <p className="text-gray-400">No content</p>;

        // Split by new lines and map to paragraphs
        const paragraphs = content.split('\n').filter(p => p.trim() !== '');

        if (paragraphs.length === 0) {
            return <p className="text-gray-400">No content</p>;
        }

        return paragraphs.map((paragraph, i) => (
            <p key={i} className="mb-4">
                {paragraph.split(/(\[\[.*?\]\])/).map((part, j) => {
                    if (part.match(/^\[\[.*?\]\]$/)) {
                        const text = part.replace(/\[\[|\]\]/g, '');
                        return <span key={j} className="gradient_text">{text}</span>;
                    }
                    return part;
                })}
            </p>
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Manage About Page</title>
            </Head>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">About Page Content</h2>
                            <p className="text-sm text-gray-500">Manage your portfolio's about page content</p>
                        </div>
                        <button
                            type="submit"
                            form="about-form"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <form id="about-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Profile Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="space-y-4 sticky top-6">
                                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        <ImageIcon size={20} className="text-blue-500" />
                                        Profile Information
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Basic information that appears at the top of your about page.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                                    <div className="flex flex-col sm:flex-row items-start gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                                {imagePreview ? (
                                                    <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-white shadow-md">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile Preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                        {uploading && (
                                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                                                        <ImageIcon size={32} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <label className="mt-4 relative cursor-pointer block">
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${uploading ? 'bg-gray-300 cursor-wait' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
                                                    <Upload size={16} />
                                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="sr-only"
                                                    disabled={uploading}
                                                />
                                            </label>
                                            
                                            {formErrors.profileImage && (
                                                <p className="mt-2 text-sm text-red-600">{formErrors.profileImage}</p>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Your Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={aboutData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                                {formErrors.name && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Sections */}
                        {[
                            { 
                                title: 'About Section', 
                                name: 'about_1',
                                description: 'The first paragraph that introduces you to visitors.',
                                value: aboutData.about_1,
                                preview: previewContent(aboutData.about_1)
                            },
                            { 
                                title: 'What I Love', 
                                name: 'what_i_love',
                                description: 'What you enjoy doing or are passionate about.',
                                value: aboutData.what_i_love,
                                preview: previewContent(aboutData.what_i_love)
                            },
                            { 
                                title: 'My Hobbies', 
                                name: 'my_hobbies',
                                description: 'Your personal hobbies and interests outside of work.',
                                value: aboutData.my_hobbies,
                                preview: previewContent(aboutData.my_hobbies)
                            },
                            { 
                                title: 'Apps I Use Daily', 
                                name: 'apps_i_use',
                                description: 'Tools and applications you use regularly.',
                                value: aboutData.apps_i_use,
                                preview: previewContent(aboutData.apps_i_use)
                            },
                            { 
                                title: 'Fun Fact', 
                                name: 'fun_fact',
                                description: 'Something interesting or unusual about you.',
                                value: aboutData.fun_fact,
                                preview: previewContent(aboutData.fun_fact)
                            },
                            { 
                                title: 'My Web Dev Journey', 
                                name: 'my_journey',
                                description: 'Your career path and how you got into web development.',
                                value: aboutData.my_journey,
                                preview: previewContent(aboutData.my_journey)
                            }
                        ].map((section, index) => (
                            <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <div className="space-y-4 sticky top-6">
                                        <h3 className="text-lg font-medium text-gray-800">{section.title}</h3>
                                        <p className="text-sm text-gray-500">{section.description}</p>
                                        
                                        {section.name !== 'my_hobbies' && section.name !== 'apps_i_use' && (
                                            <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                                                <div className="flex items-start gap-2">
                                                    <Info size={16} className="flex-shrink-0 text-blue-500 mt-0.5" />
                                                    <div>
                                                        <h4 className="text-xs font-medium text-blue-800 mb-1">Formatting Tip</h4>
                                                        <p className="text-xs text-blue-700">
                                                            Use <code className="bg-blue-100 px-1 rounded">[[text]]</code> to highlight text with gradient effect
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="lg:col-span-2">
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {section.title} Content *
                                            </label>
                                            <textarea
                                                name={section.name}
                                                value={section.value}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                                            <div className="bg-white p-4 rounded-md border border-gray-200">
                                                <div className="prose prose-sm max-w-none">
                                                    {section.preview}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-sm w-full">
                    <div className="p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-blue-100 mb-4">
                            {modalContent.includes('Error') ? (
                                <AlertCircle size={24} className="text-red-500" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            )}
                        </div>
                        <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                            {modalContent.includes('Error') ? 'Error' : 'Success'}
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-6">{modalContent}</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
