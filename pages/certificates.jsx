import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTitle, SeoMetadata } from '@/components';
import { Home, Calendar, Link as LinkIcon, Award, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/certificates');
        const data = await res.json();
        
        const sorted = data.sort((a, b) => {
          return sortOrder === 'newest' 
            ? new Date(b.issueDate) - new Date(a.issueDate)
            : new Date(a.issueDate) - new Date(b.issueDate);
        });
        
        setCertificates(sorted);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  // More compact tag colors
  const tagColors = [
    'border-blue-400 text-blue-700 dark:border-blue-500 dark:text-blue-300',
    'border-purple-400 text-purple-700 dark:border-purple-500 dark:text-purple-300',
    'border-emerald-400 text-emerald-700 dark:border-emerald-500 dark:text-emerald-300',
    'border-amber-400 text-amber-700 dark:border-amber-500 dark:text-amber-300',
    'border-rose-400 text-rose-700 dark:border-rose-500 dark:text-rose-300'
  ];

  return (
    <section className="w-full sm:max-w-3xl">
      <SeoMetadata
        title="My Certificates"
        desc="Collection of professional certificates and achievements"
      />

      <PageTitle title="My Certificates" effect="purple" />

      <div className="my-6">
        <p className="text-gray-600 dark:text-gray-300">
          Here are my professional certificates and achievements that validate my skills and knowledge.
        </p>
        
        <motion.button 
          onClick={toggleSortOrder}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {sortOrder === 'newest' ? 'Show Oldest First' : 'Show Newest First'}
          <motion.svg 
            animate={{ rotate: sortOrder === 'newest' ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -3 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800"
              >
                {/* Header */}
                <div className="relative h-40 bg-gray-50 dark:bg-gray-700">
                  {/* Certificate badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <div className="absolute inset-0 bg-blue-200/50 dark:bg-blue-600/20 rounded-full blur-sm"></div>
                      <BadgeCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* Decorative border */}
                  <div className="absolute inset-0 border-2 border-gray-100 dark:border-gray-600/50 m-2 pointer-events-none"></div>
                  
                  <div className="h-full flex items-center justify-center p-4">
                    <Image
                      src={certificate.image}
                      alt={certificate.title}
                      width={300}
                      height={150}
                      className="object-contain h-full w-auto"
                    />
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start">
                    <Award className="flex-shrink-0 w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="font-medium text-base mb-1 text-gray-800 dark:text-white line-clamp-2">{certificate.title}</h3>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 pl-6 line-clamp-1">
                    Issued by: <span className="text-gray-700 dark:text-gray-300">{certificate.issuer}</span>
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 pl-6">
                    <Calendar size={12} className="mr-1.5" />
                    {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>

                  {/* Compact Tags */}
                  {certificate.tags && certificate.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2 pl-4">
                      {certificate.tags.map((tag, tagIndex) => (
                        <motion.span 
                          key={tagIndex}
                          whileHover={{ scale: 1.05 }}
                          className={`text-xs border rounded-full px-1.5 py-0.5 ${tagColors[tagIndex % tagColors.length]} hover:shadow-sm`}
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {certificate.credentialLink && (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="pl-6"
                    >
                      <Link
                        href={certificate.credentialLink}
                        target="_blank"
                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <LinkIcon size={12} className="mr-1" />
                        Verify Credential
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <Link className="mt-6 inline-block" href="/">
        <motion.button 
          className="btn_link bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 text-sm" 
          type="button"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          Go to home
          <Home size={16} className="ml-1.5" />
        </motion.button>
      </Link>
    </section>
  );
}