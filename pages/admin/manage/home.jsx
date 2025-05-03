import { useState, useEffect } from 'react';
import Head from 'next/head';
import Modal from '@/components/admin/Modal';
import { Upload, Save, Image as ImageIcon, FileText, ArrowRight, AlertCircle } from 'lucide-react';

export default function ManageHome() {
    const [homeData, setHomeData] = useState({
        photo: {
            url: '',
            alt: 'Fazle Rabbi'
        },
        tagline: '',
        tagline2: '',
        intro: '',
        status: ['', '', ''],
        socials: [
            { name: 'instagram', link: '' },
            { name: 'linkedin', link: '' },
            { name: 'github', link: '' }
        ],
        resumelink: ''
    });
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState('');
    const [resumeName, setResumeName] = useState('');
    const [uploading, setUploading] = useState({
        photo: false,
        resume: false
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    // Fetch home data
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await fetch('/api/home');
                const data = await res.json();

                // Pastikan struktur data selalu lengkap
                const completeData = {
                    photo: data?.photo || { url: '', alt: 'Fazle Rabbi' },
                    tagline: data?.tagline || '',
                    tagline2: data?.tagline2 || '',
                    intro: data?.intro || '',
                    status: data?.status || ['', '', ''],
                    socials: data?.socials || [
                        { name: 'instagram', link: '' },
                        { name: 'linkedin', link: '' },
                        { name: 'github', link: '' }
                    ],
                    resumelink: data?.resumelink || ''
                };

                setHomeData(completeData);
                setImagePreview(completeData.photo.url || '');

                if (completeData.resumelink) {
                    const urlParts = completeData.resumelink.split('/');
                    setResumeName(urlParts[urlParts.length - 1]);
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('status[')) {
            const index = parseInt(name.match(/\[(\d+)\]/)[1]);
            const newStatus = [...homeData.status];
            newStatus[index] = value;
            setHomeData(prev => ({ ...prev, status: newStatus }));
        } else if (name.startsWith('socials[')) {
            const index = parseInt(name.match(/\[(\d+)\]/)[1]);
            const field = name.split('.')[1];
            const newSocials = [...homeData.socials];
            newSocials[index][field] = value;
            setHomeData(prev => ({ ...prev, socials: newSocials }));
        } else {
            setHomeData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle image upload
    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Untuk gambar, tampilkan preview
        if (type === 'photo') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else if (type === 'resume') {
            setResumeName(file.name);
        }

        try {
            setUploading(prev => ({ ...prev, [type]: true }));

            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result.split(',')[1];

                const response = await fetch('/api/home/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: reader.result,
                        type
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    if (type === 'photo') {
                        setHomeData(prev => ({
                            ...prev,
                            photo: {
                                ...prev.photo,
                                url: data.url
                            }
                        }));
                    } else {
                        setHomeData(prev => ({
                            ...prev,
                            resumelink: data.url
                        }));
                    }
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/home', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(homeData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setHomeData(updatedData);
                setIsModalOpen(true);
                setModalContent('Home page updated successfully!');
            }
        } catch (error) {
            console.error('Error saving home data:', error);
            setIsModalOpen(true);
            setModalContent('Error updating home page');
        }
    };

    const processText = (text) => {
        if (!text) return '';
      
        // Ganti [[teks]] dengan span highlight
        let processed = text.replace(
          /\[\[(.*?)\]\]/g,
          '<span class="gradient_text font-bold">$1</span>'
        );
      
        // Ganti **teks** dengan bold (menggunakan class Tailwind)
        processed = processed.replace(
          /\*\*(.*?)\*\*/g,
          '<span class="font-bold">$1</span>'
        );
      
        return processed;
      };

    // Highlight text preview
    const highlightText = (text) => {
        if (!text) return '';
        return text.replace(
            /(Full Stack|Full Stack Projects|web developer)/g,
            '<span class="gradient_text font-bold">$1</span>'
        );
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
                <title>Manage Home Page</title>
            </Head>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Home Page Content</h2>
                            <p className="text-sm text-gray-500">Manage your portfolio's homepage content</p>
                        </div>
                        <button
                            type="submit"
                            form="home-form"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <form id="home-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Profile Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="space-y-4 sticky top-6">
                                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        <ImageIcon size={20} className="text-blue-500" />
                                        Profile Image
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Upload a circular profile photo that will be displayed on the homepage.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-start gap-6">
                                        <div className="flex-shrink-0">
                                            {homeData.photo?.url ? (
                                                <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-white shadow-md">
                                                    <img
                                                        src={homeData.photo.url}
                                                        alt="Profile Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                                                    <ImageIcon size={32} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Photo Alt Text
                                                </label>
                                                <input
                                                    type="text"
                                                    name="photo.alt"
                                                    value={homeData.photo.alt}
                                                    onChange={(e) => setHomeData(prev => ({
                                                        ...prev,
                                                        photo: {
                                                            ...prev.photo,
                                                            alt: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="relative cursor-pointer">
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                        <Upload size={16} />
                                                        {uploading.photo ? 'Uploading...' : 'Change Photo'}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileUpload(e, 'photo')}
                                                        className="sr-only"
                                                        required={!homeData.photo?.url}
                                                    />
                                                </label>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    JPG, PNG recommended. Max size 2MB.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Taglines Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="space-y-4 sticky top-6">
                                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        <FileText size={20} className="text-blue-500" />
                                        Taglines
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Short and main taglines that appear prominently on your homepage.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Short Tagline
                                        </label>
                                        <input
                                            type="text"
                                            name="tagline"
                                            value={homeData.tagline}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. Full Stack Developer"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Main Tagline
                                        </label>
                                        <input
                                            type="text"
                                            name="tagline2"
                                            value={homeData.tagline2}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. I build digital experiences that matter"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Introduction Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="space-y-4 sticky top-6">
                                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        <FileText size={20} className="text-blue-500" />
                                        Introduction
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Write a brief introduction about yourself that will appear on the homepage.
                                    </p>
                                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                                        <h4 className="text-xs font-medium text-blue-800 mb-1">Formatting Guide</h4>
                                        <ul className="text-xs text-blue-700 space-y-1">
                                            <li className="flex items-start gap-1">
                                                <span className="mt-0.5">•</span>
                                                <span>Use <code className="bg-blue-100 px-1 rounded">[[text]]</code> for gradient highlight</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <span className="mt-0.5">•</span>
                                                <span>Use <code className="bg-blue-100 px-1 rounded">**text**</code> for bold text</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Introduction Text
                                        </label>
                                        <textarea
                                            name="intro"
                                            value={homeData.intro}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                                        <div className="bg-white p-4 rounded-md border border-gray-200">
                                            <div
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: processText(homeData.intro) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Items Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="space-y-4 sticky top-6">
                                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        <AlertCircle size={20} className="text-blue-500" />
                                        Status Items
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Up to 3 status messages that appear below your introduction.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2">
                                <div className="space-y-6">
                                    {homeData.status.map((item, index) => (
                                        <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Status {index + 1}
                                                </label>
                                                <input
                                                    type="text"
                                                    name={`status[${index}]`}
                                                    value={item}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={`Example: I'm currently building [[Full Stack Projects]]`}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Raw Text</h4>
                                                    <div className="bg-white p-3 rounded-md border border-gray-200 text-sm">
                                                        {item || <span className="text-gray-400">Empty</span>}
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Formatted Preview</h4>
                                                    <div
                                                        className="bg-white p-3 rounded-md border border-gray-200 text-sm"
                                                        dangerouslySetInnerHTML={{
                                                            __html: item ? processText(item) : '<span class="text-gray-400">Empty</span>'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Social Links Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="space-y-4 sticky top-6">
                                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                        </svg>
                                        Social Links
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Links to your social media profiles.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                                    {homeData.socials.map((social, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-24 flex-shrink-0">
                                                <label className="block text-sm font-medium text-gray-700 capitalize">
                                                    {social.name}
                                                </label>
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="url"
                                                    name={`socials[${index}].link`}
                                                    value={social.link}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={`https://${social.name}.com/yourusername`}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Resume Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="space-y-4 sticky top-6">
                                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        <FileText size={20} className="text-blue-500" />
                                        Resume
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Upload your resume in PDF format.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700">Resume File</h4>
                                                {homeData.resumelink ? (
                                                    <a 
                                                        href={homeData.resumelink} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {resumeName}
                                                        <ArrowRight size={14} className="mt-0.5" />
                                                    </a>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No resume uploaded</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <label className="relative cursor-pointer">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                <Upload size={16} />
                                                {uploading.resume ? 'Uploading...' : homeData.resumelink ? 'Change File' : 'Upload Resume'}
                                            </div>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => handleFileUpload(e, 'resume')}
                                                className="sr-only"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
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