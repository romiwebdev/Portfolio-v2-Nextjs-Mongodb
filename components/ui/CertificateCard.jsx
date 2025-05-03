import { Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const CertificateCard = ({ certificate }) => {
  const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800">
      {/* Gambar Certificate */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50 dark:bg-gray-700">
        <Image
          src={certificate.image}
          alt={certificate.title}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={90}
        />
        
        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          {certificate.credentialLink && (
            <Link 
              href={certificate.credentialLink}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white dark:bg-gray-900 rounded-full p-3 shadow-lg"
              aria-label="View certificate"
            >
              <ExternalLink className="w-5 h-5 text-gray-800 dark:text-white" />
            </Link>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-1 text-gray-900 dark:text-white">
          {certificate.title}
        </h3>
        
        {/* Issuer */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 mt-1">
          {certificate.issuer}
        </p>
        
        {/* Date and Verify Button */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          
          {certificate.credentialLink && (
            <Link
              href={certificate.credentialLink}
              target="_blank"
              className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-teal-900/50 dark:text-teal-400 dark:hover:bg-teal-800 transition-colors"
            >
              <LinkIcon className="w-3 h-3 mr-1" />
              Verify
            </Link>
          )}
        </div>
        
        {/* Tags */}
        {certificate.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {certificate.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;