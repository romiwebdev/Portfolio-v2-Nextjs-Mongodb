import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import { PageTitle, SeoMetadata } from '@/components';
import { site_metadata } from '@/constants';
import { motion } from 'framer-motion';

const Skills = () => {
  const [skills, setSkills] = useState({
    proficient: [],
    comfortable: [],
    other: []
  });
  const [loading, setLoading] = useState(true);
  const [intro, setIntro] = useState("💡 I'm like a JavaScript maestro! This is where my superpowers shine...");

  // Animasi
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const iconHover = {
    scale: 1.2,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  };

  const iconTap = {
    scale: 0.9
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        const allSkills = await res.json();
        
        const sortedSkills = [...allSkills].sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        
        const groupedSkills = {
          proficient: sortedSkills.filter(skill => skill.category === 'proficient'),
          comfortable: sortedSkills.filter(skill => skill.category === 'comfortable'),
          other: sortedSkills.filter(skill => skill.category === 'other')
        };
        
        setSkills(groupedSkills);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <section className="sm:max-w-3xl">
        <SeoMetadata
          title={site_metadata?.skill?.title}
          desc={site_metadata?.skill?.desc}
        />
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
    <section className="sm:max-w-3xl">
      <SeoMetadata
        title={site_metadata?.skill?.title}
        desc={site_metadata?.skill?.desc}
      />

      {/* Gradient Effect - tetap sama */}
      <div className="skill_page_gradient"></div>

      <PageTitle title="My technical expertise" effect="purple" />

      <motion.p
        className="info"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        {intro || ""}
      </motion.p>

      {/* Proficient With */}
      <div className="md:mt-10 md:flex md:gap-4">
        <motion.div 
          className="my-6 md:w-7/12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h2 
            className="sub_heading text-center"
            variants={fadeInUp}
          >
            Proficient with ⚡
          </motion.h2>
          <motion.ul 
            className="mt-4 grid grid-cols-6"
            variants={staggerContainer}
          >
            {skills.proficient?.map((skill, index) => (
              <motion.li
                key={skill.id}
                className="group flex flex-col justify-center items-center"
                variants={fadeInUp}
                whileHover={iconHover}
                whileTap={iconTap}
              >
                {skill.icon.match(/\.(svg|png|jpe?g)$/i) ? (
                  <Image
                    className={`${
                      ["Next.js", "Flask", "Expressjs"].includes(skill.name) &&
                      "dark:bg-light_2 dark:rounded-full"
                    } ${
                      skill.name === "Firebase" && "w-10 h-10"
                    }`}
                    src={skill.icon}
                    width={40}
                    height={40}
                    alt={skill.name}
                  />
                ) : (
                  <span className="text-2xl">{skill.icon}</span>
                )}
                <motion.span 
                  className="text_tiny font-light opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ 
                    opacity: 1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {skill.name}
                </motion.span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Comfortable With */}
        <motion.div 
          className="my-6 md:flex-1"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="sub_heading text-center"
            variants={fadeInUp}
          >
            Comfortable with 🛠️
          </motion.h2>
          <motion.ul 
            className="mt-4 grid grid-cols-6"
            variants={staggerContainer}
          >
            {skills.comfortable?.map((skill, index) => (
              <motion.li
                key={skill.id}
                className="group flex flex-col justify-center items-center"
                variants={fadeInUp}
                whileHover={iconHover}
                whileTap={iconTap}
              >
                {skill.icon.match(/\.(svg|png|jpe?g)$/i) ? (
                  <Image
                    className={`${skill.name === "Zustand" && "rounded-full"} ${
                      skill.name === "Nextauth.js" && "w-10 h-10"
                    }`}
                    src={skill.icon}
                    width={40}
                    height={40}
                    alt={skill.name}
                  />
                ) : (
                  <span className="text-2xl">{skill.icon}</span>
                )}
                <motion.span 
                  className="text_tiny font-light opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ 
                    opacity: 1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {skill.name}
                </motion.span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Have Strong Foundation */}
      <motion.div 
        className="my-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        transition={{ delay: 0.4 }}
      >
        <motion.h2 
          className="sub_heading text-center"
          variants={fadeInUp}
        >
          Have a strong foundation in 💪
        </motion.h2>
        <motion.ul 
          className="mt-4 flex justify-center items-center flex-wrap gap-2"
          variants={staggerContainer}
        >
          {skills.other?.map((skill, index) => (
            <motion.li 
              key={skill.id} 
              className="px-4 py-1 bg-gray-700/10 rounded shadow-2xl flex gap-2 items-center dark:bg-gray-800"
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{skill.icon}</span>
              {skill.name}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <Link className="mt-10 inline-block" href="/projects">
        <motion.button 
          className="btn_link" 
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ 
            scale: 1.05,
            transition: { type: 'spring', stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          My projects
          <MoveUpRight size={18} />
        </motion.button>
      </Link>
    </section>
  );
};

export default Skills;