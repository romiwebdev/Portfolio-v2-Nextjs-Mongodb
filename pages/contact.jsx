import { PageTitle, ContactForm, SeoMetadata } from "@/components";
import {
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  Send,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { contactPageData, site_metadata } from "@/constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10
    }
  }
};

const Contact = () => {
  return (
    <motion.section 
      className="max-w-4xl mx-auto px-4 py-2 md:py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SeoMetadata
        title={site_metadata?.contact?.title}
        desc={site_metadata?.contact?.desc}
      />

      <motion.div variants={itemVariants}>
        <PageTitle title="Let's Connect" effect="purple" />
        <motion.p 
          className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
          variants={itemVariants}
        >
          {contactPageData?.intro}
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Form Section */}
        <motion.div 
          className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
          whileHover={{ y: -3 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <MessageCircle className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <h2 className="text-lg font-medium">Send a Message</h2>
          </div>
          <ContactForm contactPageData={contactPageData} />
        </motion.div>

        {/* Contact Info Section */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
        >
          {/* Direct Contact */}
          <motion.div 
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            variants={itemVariants}
            whileHover={{ y: -3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-full">
                <Mail className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <h2 className="text-lg font-medium">Direct Contact</h2>
            </div>
            
            <ul className="space-y-3">
              <motion.li 
                className="flex items-start gap-3"
                variants={itemVariants}
              >
                <Mail className="mt-0.5 text-gray-500 dark:text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <Link
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    href={`mailto:${contactPageData?.alternative?.email}`}
                  >
                    {contactPageData?.alternative?.email}
                  </Link>
                </div>
              </motion.li>
              
              <motion.li 
                className="flex items-start gap-3"
                variants={itemVariants}
              >
                <Send className="mt-0.5 text-gray-500 dark:text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Telegram</p>
                  <Link
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    href={contactPageData?.alternative?.telegram || ""}
                    target="_blank"
                  >
                    @FazleRabbiDev
                  </Link>
                </div>
              </motion.li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div 
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            variants={itemVariants}
            whileHover={{ y: -3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-full">
                <MessageCircle className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <h2 className="text-lg font-medium">Find Me On</h2>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-3"
              variants={containerVariants}
            >
              {contactPageData?.socials?.map(platform => (
                <motion.div
                  key={platform.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    target="_blank" 
                    href={platform.link}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label={platform.name}
                  >
                    {platform.name === "Twitter" ? (
                      <Twitter className="text-blue-400 w-5 h-5" />
                    ) : platform.name === "Linkedin" ? (
                      <Linkedin className="text-blue-600 w-5 h-5" />
                    ) : platform.name === "Facebook" ? (
                      <Facebook className="text-blue-700 w-5 h-5" />
                    ) : platform.name === "Instagram" ? (
                      <Instagram className="text-pink-500 w-5 h-5" />
                    ) : (
                      <Github className="text-gray-700 dark:text-gray-300 w-5 h-5" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer Note */}
      <motion.div 
        className="mt-10 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30"
        variants={itemVariants}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-full">
            <span className="text-blue-600 dark:text-blue-300 text-sm">💡</span>
          </div>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            Looking forward to connecting with fellow enthusiasts and industry professionals!
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Contact;