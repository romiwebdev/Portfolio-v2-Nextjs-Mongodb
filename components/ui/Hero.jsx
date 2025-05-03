import {
  Instagram,
  Linkedin,
  Github,
  FileText,
  Download,
  ChevronsRight,
  MousePointerClick
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { formatText } from '@/lib/textFormatter';

export const Hero = () => {
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

  const handleDownload = async () => {
    try {
      const response = await fetch(homeData.resumelink);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Muhromin-Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback to regular link
      window.open(homeData.resumelink, '_blank');
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch('/api/home');
        const data = await res.json();
        if (data) {
          setHomeData(data);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <section className="relative min-h-screen md:flex md:justify-center md:items-center sm:max-w-3xl">
        <div className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen md:flex md:justify-center md:items-center sm:max-w-3xl">
      {/* Gradient Effect - unchanged */}
      <div className="gradient_effect"></div>

      <div className="transition duration-100">
        <div className="md:flex md:gap-2 md:flex-row-reverse md:justify-between">
          {/* Photo with subtle scale animation */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 md:w-auto"
          >
            <div className="relative h-32 w-32 md:h-64 md:w-64 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
              <Image
                src={homeData.photo.url || "/me.png"}
                width={300}
                height={300}
                alt={homeData.photo.alt || "Fazle Rabbi"}
                className="object-cover"
              />
            </div>
          </motion.div>

          <div className="md:flex-1">
            {/* Text elements with staggered fade-in */}
            <motion.span 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="leading-7 flex items-center gap-2 font-light"
            >
              Hello there
              <motion.span
                animate={{ 
                  rotate: [0, 15, 0, -15, 0],
                  y: [0, -3, 0, 3, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  repeatDelay: 3
                }}
              >
                <Image
                  src="https://user-images.githubusercontent.com/18350557/176309783-0785949b-9127-417c-8b55-ab5a4333674e.gif"
                  width={20}
                  height={20}
                  alt="Waving hand"
                />
              </motion.span>
            </motion.span>

            <motion.h1 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-black text-2xl font-ranade-bold dark:text-white"
            >
              {homeData.tagline2 || "I build web applications to empower businesses"}
            </motion.h1>

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="my-6 leading-7 font-light"
              dangerouslySetInnerHTML={{
                __html: formatText(homeData.intro)
              }}
            />

            {homeData.status.filter(s => s).map((item, index) => (
              <motion.p 
                key={index}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + (index * 0.1), duration: 0.4 }}
                className="my-2 flex gap-2"
              >
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: index * 0.5 }}
                >
                  <ChevronsRight size={17} />
                </motion.span>
                <span
                  className="font-light"
                  dangerouslySetInnerHTML={{ __html: formatText(item) }}
                />
              </motion.p>
            ))}
          </div>
        </div>

        {/* Socials & CTA */}
        <div className="ml-6 md:m-0 md:flex md:gap-4 md:items-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-8 md:m-0 flex items-center gap-4"
          >
            {homeData.socials.map((platform, index) => (
              <Link target="_blank" key={index} href={platform.link || "#"}>
                <motion.button 
                  className="social_icon" 
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {platform.name === "instagram" ? (
                    <Instagram />
                  ) : platform.name === "linkedin" ? (
                    <Linkedin />
                  ) : (
                    <Github />
                  )}
                </motion.button>
              </Link>
            ))}
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex items-center gap-2 flex-wrap mt-10 md:m-0"
          >
            <motion.button
              onClick={handleDownload}
              className="resume_btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={20} />
              Download Resume
            </motion.button>
            <Link href="/projects">
              <motion.button 
                className="work_btn" 
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <MousePointerClick size={16} />
                My Work
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};