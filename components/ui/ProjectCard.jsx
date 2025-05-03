import Link from "next/link";
import { Github, ExternalLink, Info } from "lucide-react";
import Image from "next/image";
import { ProjectModal } from "@/components";
import { useState } from "react";
import { motion } from "framer-motion";

// Badge styles
const badge = [
  // Frontend Frameworks
  "badge_react",
  "badge_angular",
  "badge_vue",
  "badge_svelte",
  
  // CSS Frameworks
  "badge_tailwind",
  "badge_bootstrap",
  "badge_materialui",
  "badge_chakraui",
  
  // State Management
  "badge_redux",
  "badge_zustand",
  "badge_recoil",
  
  // Backend Frameworks
  "badge_node",
  "badge_express",
  "badge_nestjs",
  "badge_django",
  "badge_flask",
  "badge_laravel",
  "badge_spring",
  
  // Databases
  "badge_mongo",
  "badge_postgresql",
  "badge_mysql",
  "badge_firebase",
  "badge_supabase",
  "badge_redis",
  
  // Mobile
  "badge_reactnative",
  "badge_flutter",
  
  // Full-stack Frameworks
  "badge_nextjs",
  "badge_nuxtjs",
  "badge_remix",
  
  // Cloud/AWS
  "badge_aws",
  "badge_azure",
  "badge_gcp",
  
  // Testing
  "badge_jest",
  "badge_cypress",
  
  // Languages
  "badge_typescript",
  "badge_javascript",
  "badge_python",
  "badge_java",
  "badge_go",
  "badge_rust",
  "badge_csharp",
  "badge_php",
  "badge_kotlin",
  "badge_swift",
  
  // Tools
  "badge_docker",
  "badge_kubernetes",
  "badge_git",
];


export const ProjectCard = ({ project }) => {
  const [openModal, setOpenModal] = useState(false);

  const toggleModal = () => {
    setOpenModal(curr => !curr);
  };

  return (
    <motion.li
      className="group project_card"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div onClick={toggleModal}>
        <motion.div className="overflow-hidden" whileHover={{ scale: 1.05 }}>
          <Image
            className="w-full rounded-t-2xl transition duration-500"
            src={project?.cover}
            width={600}
            height={300}
            alt={project?.name}
          />
        </motion.div>

        {/* Project Info */}
        <div className="p-4 relative">
          <div className="mb-2 border-b-[.7px] border-gray-700/20">
            <h3 className="text-xl font-bold">{project?.name}</h3>
            <div className="my-2 flex gap-2 flex-wrap">
              {project?.technologies?.map(tech => (
                <span key={tech.name} className={tech.style}>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="project_card_gradient"></div>
            <p className="relative">{project?.desc}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <ul className="pb-4 pr-4 flex gap-4 justify-end items-center">
        <li>
          <Link target="_blank" href={project?.links?.github || ""}>
            <motion.button
              className="cursor-pointer transition transform duration-300 hover:scale-125"
              type="button"
              whileHover={{ scale: 1.2 }}
            >
              <Github size={23} />
            </motion.button>
          </Link>
        </li>
        <li>
          <Link target="_blank" href={project?.links?.live || ""}>
            <motion.button
              className="cursor-pointer transition transform duration-300 hover:scale-125"
              type="button"
              whileHover={{ scale: 1.2 }}
            >
              <ExternalLink size={25} />
            </motion.button>
          </Link>
        </li>
        <li>
          <motion.button
            onClick={toggleModal}
            className="cursor-pointer transition transform duration-300 hover:scale-125"
            type="button"
            whileHover={{ scale: 1.2 }}
          >
            <Info size={25} />
          </motion.button>
        </li>
      </ul>

      {openModal && (
        <ProjectModal project={project} toggleModal={toggleModal} />
      )}
    </motion.li>
  );
};