import Image from "next/image";
import { PageTitle, SeoMetadata } from "@/components";
import Link from "next/link";
import { MoveUpRight } from "lucide-react";
import { site_metadata } from "@/constants";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const About = () => {
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

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch('/api/about');
        const data = await res.json();
        if (data) {
          setAboutData(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const renderHighlightedText = (text) => {
    return text.split(/(\[\[.*?\]\])/).map((part, i) => {
      if (part.match(/^\[\[.*?\]\]$/)) {
        const highlightText = part.replace(/\[\[|\]\]/g, '');
        return (
          <motion.span
            key={i}
            className="gradient_text font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
            whileHover={{
              scale: 1.1,
              rotate: [0, 5, -5, 0],
              transition: { duration: 0.4 }
            }}
          >
            {highlightText}
          </motion.span>
        );
      }
      return part;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  if (loading) {
    return (
      <section className="sm:max-w-3xl min-h-screen flex items-center justify-center">
        <SeoMetadata
          title={site_metadata?.about?.title}
          desc={site_metadata?.about?.desc}
        />
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut"
          }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"
        />
      </section>
    );
  }

  return (
    <motion.section
      className="sm:max-w-3xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SeoMetadata
        title={site_metadata?.about?.title}
        desc={site_metadata?.about?.desc}
      />

      <motion.div variants={itemVariants}>
        <PageTitle title="About me" effect="purple" />
      </motion.div>

      {/* Intro Section */}
      <motion.div
        className="relative"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={cardVariants}
      >
        <motion.div
          className="info dark:bg-transparent dark:p-4 dark:border-l-[.5px] dark:border-teal-400/40 dark:rounded-lg"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            transition: {
              duration: 0.4,
              ease: "easeOut"
            }
          }}
        >
          <motion.div
            className="relative h-24 w-24 rounded-full overflow-hidden mb-4 mx-auto"
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5
              }
            }}
            whileHover={{
              rotate: [0, 10, -10, 0],
              transition: { duration: 0.6 }
            }}
          >
            <Image
              src={aboutData.profileImage || '/me.png'}
              width={100}
              height={100}
              alt={aboutData.name || "Muhromin"}
              className="object-cover"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.7 }
            }}
          >
            Hello, I'm <span className="font-bold">{aboutData.name || "Muhromin"}</span>,
            {" "}
            {renderHighlightedText(aboutData.about_1 || "")}
            <br />
            <br />
            As part of my next plan, I aim to strengthen my web development skills
            by continuing to build impactful full-stack{" "}
            <motion.span
              whileHover={{
                scale: 1.1,
                textShadow: "0 0 8px rgba(124, 58, 237, 0.6)"
              }}
            >
              <Link className="link" href="/projects">
                projects
              </Link>
            </motion.span>
            .
          </motion.p>
        </motion.div>
      </motion.div>

      {/* What I Love */}
      <motion.div
        className="my-10"
        variants={itemVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="sub_heading"
          whileHover={{
            scale: 1.05,
            x: [0, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <motion.span
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 3,
              duration: 1.5
            }}
          >
            😍
          </motion.span> What I Love
        </motion.h2>
        <motion.p
          className="info"
          initial={{ x: -20, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            transition: { delay: 0.4 }
          }}
        >
          {renderHighlightedText(aboutData.what_i_love || "")}
        </motion.p>
      </motion.div>

      {/* My Hobbies */}
      <motion.div
        className="my-10"
        variants={itemVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="sub_heading"
          whileHover={{
            scale: 1.05,
            x: [0, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <motion.span
            animate={{
              y: [0, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 2,
              duration: 1.2
            }}
          >
            🎯
          </motion.span> My Hobbies
        </motion.h2>
        <motion.p
          className="info"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.4,
              staggerChildren: 0.1
            }
          }}
        >
          {renderHighlightedText(aboutData.my_hobbies || "")}
        </motion.p>

      </motion.div>

      {/* Apps I Use */}
      <motion.div
        className="my-10"
        variants={itemVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="sub_heading"
          whileHover={{
            scale: 1.05,
            x: [0, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <motion.span
            animate={{
              rotate: [0, 15, -15, 0],
              transition: {
                repeat: Infinity,
                duration: 3
              }
            }}
          >
            🛸
          </motion.span> Apps I use daily
        </motion.h2>
        <motion.p
          className="info"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.4 }
          }}
        >
          {renderHighlightedText(aboutData.apps_i_use || "")}
        </motion.p>

      </motion.div>

      {/* Fun Fact */}
      <motion.div
        className="my-10"
        variants={itemVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="sub_heading"
          whileHover={{
            scale: 1.05,
            x: [0, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
              transition: {
                repeat: Infinity,
                duration: 2
              }
            }}
          >
            🤓
          </motion.span> Fun fact
        </motion.h2>
        <motion.p
          className="info"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.4,
              staggerChildren: 0.1
            }
          }}
        >
          {renderHighlightedText(aboutData.fun_fact || "")}
        </motion.p>
      </motion.div>

      {/* Journey */}
      <motion.div
        className="my-10"
        variants={itemVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="sub_heading"
          whileHover={{
            scale: 1.05,
            x: [0, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <motion.span
            animate={{
              y: [0, -10, 0],
              transition: {
                repeat: Infinity,
                duration: 2
              }
            }}
          >
            🚀
          </motion.span> My web dev journey
        </motion.h2>
        <motion.p
          className="info"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.4,
              staggerChildren: 0.1
            }
          }}
        >
          {renderHighlightedText(aboutData.my_journey || "")}
        </motion.p>
      </motion.div>

      {/* Expertise Button */}
      <motion.div
        className="my-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.8 }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/skills">
          <motion.button
            className="btn_link relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{
              boxShadow: "0 0 15px rgba(124, 58, 237, 0.5)"
            }}
          >
            <motion.span className="relative z-10">
              My expertise
            </motion.span>
            <motion.span
              className="ml-2 relative z-10"
              animate={{
                x: [0, 5, 0],
                y: [0, -5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
            >
              <MoveUpRight size={18} />
            </motion.span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 hover:opacity-100"
              initial={{ opacity: 0 }}
              whileHover={{
                opacity: 1,
                transition: { duration: 0.3 }
              }}
            />
          </motion.button>
        </Link>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 rounded-full bg-purple-400 opacity-20"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-6 h-6 rounded-full bg-teal-400 opacity-20"
        animate={{
          y: [0, -30, 0],
          x: [0, 10, 0],
          scale: [1, 1.5, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </motion.section>
  );
};

export default About;