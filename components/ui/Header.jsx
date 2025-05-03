import Link from "next/link";
import { useRouter } from "next/router";
import { useThemeContext } from "@/context";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  UserRound,
  Lightbulb,
  Flame,
  FileText,
  MessageSquare,
  Sun,
  Moon,
  Award,
  BarChart2
} from "lucide-react";

export const Header = () => {
  const { pathname } = useRouter();
  const { isDarkMode, toggleDarkMode } = useThemeContext();
  const marqueeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoScrollSpeed] = useState(0.3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navLinks = [
    { name: "Home", icon: <Home size={18} /> },
    { name: "About", icon: <UserRound size={18} /> },
    { name: "Skills", icon: <Lightbulb size={18} /> },
    { name: "Projects", icon: <Flame size={18} /> },
    { name: "Certificates", icon: <Award size={18} /> },
    { name: "Stats", icon: <BarChart2 size={18} /> },
    { name: "Contact", icon: <MessageSquare size={18} /> }
  ];

  const duplicatedLinks = [...navLinks, ...navLinks];

  useEffect(() => {
    if (!isMobile || !marqueeRef.current) return;

    let animationFrameId;
  
    const animate = () => {
      if (!isDragging) {
        marqueeRef.current.scrollLeft += autoScrollSpeed;
        if (marqueeRef.current.scrollLeft >= marqueeRef.current.scrollWidth / 2) {
          marqueeRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
  
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMobile, isDragging, autoScrollSpeed]);

  const handleMouseDown = (e) => {
    if (!isMobile) return;
    setIsDragging(true);
    setStartX(e.pageX - marqueeRef.current.offsetLeft);
    setScrollLeft(marqueeRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isMobile || !isDragging) return;
    e.preventDefault();
    const x = e.pageX - marqueeRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    marqueeRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
  const handleWheel = (e) => {
    if (!isMobile) return;
    e.preventDefault();
    marqueeRef.current.scrollLeft += e.deltaY;
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="fixed z-50 top-0 w-full bg-[#f8f8ff] dark:bg-[#161d27] h-12 md:h-16 shadow-sm"
    >
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-full items-center justify-center px-4">
        <nav className="flex items-center">
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mr-4 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDarkMode ? "dark" : "light"}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDarkMode ? (
                  <Sun size={18} className="text-yellow-400" />
                ) : (
                  <Moon size={18} className="text-gray-700 dark:text-gray-300" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <ul className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <motion.li 
                key={link.name}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.name === "Home" ? "/" : `/${link.name.toLowerCase()}`}
                  className={`px-3 py-1.5 rounded-full flex items-center text-sm ${
                    (pathname === "/" && link.name === "Home") || 
                    pathname === `/${link.name.toLowerCase()}`
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <motion.span 
                    className="mr-1.5"
                    whileHover={{ scale: 1.1 }}
                  >
                    {link.icon}
                  </motion.span>
                  <span className="font-medium">{link.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden h-full flex items-center justify-between px-3">
        {/* Dark Mode Button - Now integrated in the header bar */}
        <motion.button
          onClick={toggleDarkMode}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
          aria-label="Toggle dark mode"
          style={{ position: 'relative', zIndex: 30 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDarkMode ? "dark-mobile" : "light-mobile"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isDarkMode ? (
                <Sun size={16} className="text-yellow-400" />
              ) : (
                <Moon size={16} className="text-gray-700 dark:text-gray-300" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <div className="w-[calc(100%-50px)] h-full">
          <motion.div
            ref={marqueeRef}
            className="w-full h-full overflow-x-auto whitespace-nowrap scrollbar-hide cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
            whileTap={{ scale: 0.98 }}
          >
            <div className="inline-flex h-full items-center">
              {duplicatedLinks.map((link, index) => (
                <motion.div
                  key={`${link.name}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex"
                >
                  <Link
                    href={link.name === "Home" ? "/" : `/${link.name.toLowerCase()}`}
                    className={`mx-1 px-2 py-0.5 rounded-full inline-flex items-center text-xs ${
                      (pathname === "/" && link.name === "Home") || 
                      pathname === `/${link.name.toLowerCase()}`
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <motion.span 
                      className="mr-1"
                      whileHover={{ rotate: 10 }}
                    >
                      {link.icon}
                    </motion.span>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};