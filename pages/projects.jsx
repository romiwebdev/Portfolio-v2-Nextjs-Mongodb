import { useState, useEffect } from "react";
import { PageTitle, ProjectCard, ProjectList, SeoMetadata } from "@/components";
import { ListFilter, Star, Blocks } from "lucide-react";
import Link from "next/link";
import { site_metadata } from "@/constants";

const renderProjects = (projects, projectType) => {
  const filteredProjects = projects.filter(project => {
    if (projectType === "all") return true;
    if (projectType === "frontend") return project.category === "frontend";
    if (projectType === "backend") return project.category === "backend";
    if (projectType === "fullstack") return project.category === "fullstack";
    if (projectType === "misc") return project.category === "misc";
    return true;
  });

  return filteredProjects.map(project => {
    if (["frontend", "fullstack"].includes(project.category)) {
      return <ProjectCard key={project.id} project={project} />;
    } else {
      return <ProjectList key={project.id} {...project} />;
    }
  });
};

const Project = () => {
  const [projectType, setProjectType] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        const sortedProjects = data.sort((a, b) => 
          (a.order || 0) - (b.order || 0) || 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProjects(sortedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="sm:max-w-3xl">
      <SeoMetadata title={site_metadata?.project?.title} desc={site_metadata?.project?.desc} />

      <PageTitle title="My notable projects" effect="purple" />
      <p className="info my-4">Dive into my projects! See how I create cool web apps and tackle backend challenges using MERN stack. It's a journey of coding magic – join me in exploring innovation!</p>

      <div className="my-10">
        <p className="mb-2 flex items-center gap-1 font-medium font-bold text-black dark:text-white">
          <span className="text-purple-600 dark:text-teal-600"><ListFilter size={18} /></span>
          Filter Project
        </p>
        <div className="mb-8 flex justify-between items-center">
          <select
            onChange={e => setProjectType(e.target.value)}
            value={projectType}
            className="w-full px-3 py-2 rounded-md outline-0 bg-[#f8f8ff] border-[1px] border-gray-200 dark:bg-gray-700/70 dark:border-transparent"
          >
            <option value="all">All Projects</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Fullstack</option>
            <option value="misc">Miscellaneous</option>
          </select>
        </div>

        <h2 className="sub_heading flex items-center gap-4">
          <span className="text-purple-500 dark:text-teal-500">
            <Star />
          </span>
          {projectType === "all" ? "All" : 
           projectType === "frontend" ? "Frontend" :
           projectType === "backend" ? "Backend" :
           projectType === "fullstack" ? "Fullstack" : "Miscellaneous"} Projects
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {projects.length > 0 ? (
              <ul className="mt-4 space-y-4 md:grid md:grid-cols-2 md:items-stretch md:space-y-0 md:gap-6">
                {renderProjects(projects, projectType)}
              </ul>
            ) : (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                <p>No projects found in this category.</p>
              </div>
            )}
          </>
        )}

        <Link className="mt-10 inline-block" href="https://github.com/fazle-rabbi-dev?tab=repositories" target="_blank">
          <button className="btn_link" type="button">
            <Blocks size={20} />
            Browse more projects
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Project;