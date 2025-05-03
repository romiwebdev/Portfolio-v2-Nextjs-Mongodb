import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageTitle, SeoMetadata } from '@/components';
import { site_metadata } from '@/constants';
import dynamic from 'next/dynamic';
import { Globe, Users, Clock, BarChart2, PieChart, Smartphone, ExternalLink } from 'lucide-react';

// Load komponen chart secara dinamis (tanpa SSR)
const LineChart = dynamic(() => import('@/components/stats/LineChart'), { ssr: false });
const BarChart = dynamic(() => import('@/components/stats/BarChart'), { ssr: false });
const PieChartComponent = dynamic(() => import('@/components/stats/PieChart'), { ssr: false });

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/visitors/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardHover = {
    scale: 1.03,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3 }
  };

  const neonGlow = {
    initial: { opacity: 0.7 },
    hover: {
      opacity: 1,
      boxShadow: "0 0 8px rgba(99, 102, 241, 0.9)",
      transition: { repeat: Infinity, repeatType: "reverse", duration: 1.5 }
    }
  };

  if (loading) {
    return (
      <section className="sm:max-w-3xl">
        <SeoMetadata 
          title={`Statistics | ${site_metadata?.title}`} 
          desc="View portfolio visitor statistics and analytics"
        />
        <div className="flex justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="sm:max-w-5xl">
      <SeoMetadata 
        title={`Statistics | ${site_metadata?.title}`} 
        desc="View portfolio visitor statistics and analytics"
      />

      <PageTitle title="Portfolio Statistics" effect="purple" />
      
      <motion.div 
        className="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Total Visitors Card */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center border border-transparent hover:border-purple-400/30 transition-all"
          variants={item}
          whileHover={cardHover}
        >
          <motion.div 
            className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 mr-4"
            variants={neonGlow}
            initial="initial"
            whileHover="hover"
          >
            <Users size={24} />
          </motion.div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Visitors</h3>
            <motion.p 
              className="text-2xl font-bold text-gray-900 dark:text-white"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {stats?.totalVisitors?.toLocaleString() || 0}
            </motion.p>
          </div>
        </motion.div>
        
        {/* Unique Browsers Card */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center border border-transparent hover:border-blue-400/30 transition-all"
          variants={item}
          whileHover={cardHover}
        >
          <motion.div 
            className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 mr-4"
            variants={neonGlow}
            initial="initial"
            whileHover="hover"
          >
            <Globe size={24} />
          </motion.div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Unique Browsers</h3>
            <motion.p 
              className="text-2xl font-bold text-gray-900 dark:text-white"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            >
              {stats?.userAgents?.length || 0}
            </motion.p>
          </div>
        </motion.div>
        
        {/* Most Visited Page Card */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center border border-transparent hover:border-green-400/30 transition-all"
          variants={item}
          whileHover={cardHover}
        >
          <motion.div 
            className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 mr-4"
            variants={neonGlow}
            initial="initial"
            whileHover="hover"
          >
            <ExternalLink size={24} />
          </motion.div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Top Page</h3>
            <motion.p 
              className="text-xl font-bold text-gray-900 dark:text-white truncate"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            >
              {stats?.pageVisits[0]?._id || '/'}
            </motion.p>
          </div>
        </motion.div>
        
        {/* Popular Browser Card */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center border border-transparent hover:border-yellow-400/30 transition-all"
          variants={item}
          whileHover={cardHover}
        >
          <motion.div 
            className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300 mr-4"
            variants={neonGlow}
            initial="initial"
            whileHover="hover"
          >
            <Smartphone size={24} />
          </motion.div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Top Browser</h3>
            <motion.p 
              className="text-xl font-bold text-gray-900 dark:text-white"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
            >
              {stats?.userAgents[0]?._id || 'Chrome'}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Visitor Trend Chart */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6 border border-transparent hover:border-purple-400/30 transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ 
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <motion.h3 
            className="text-lg font-bold text-gray-900 dark:text-white flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <motion.span 
              className="mr-2 text-purple-600 dark:text-purple-400"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <Clock size={20} />
            </motion.span>
            Visitor Trend (Last 30 Days)
          </motion.h3>
        </div>
        <div className="h-80">
          <LineChart data={stats?.last30Days || []} />
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Page Visits Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-transparent hover:border-blue-400/30 transition-all"
          whileHover={{ 
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.h3 
              className="text-lg font-bold text-gray-900 dark:text-white flex items-center"
              whileHover={{ scale: 1.02 }}
            >
              <motion.span 
                className="mr-2 text-blue-600 dark:text-blue-400"
                animate={{ 
                  rotate: [0, 15, 0, -15, 0],
                  transition: { repeat: Infinity, duration: 4 }
                }}
              >
                <PieChart size={20} />
              </motion.span>
              Page Visits Distribution
            </motion.h3>
          </div>
          <div className="h-64">
            <PieChartComponent data={stats?.pageVisits || []} />
          </div>
        </motion.div>

        {/* Browser Usage Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-transparent hover:border-green-400/30 transition-all"
          whileHover={{ 
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.h3 
              className="text-lg font-bold text-gray-900 dark:text-white flex items-center"
              whileHover={{ scale: 1.02 }}
            >
              <motion.span 
                className="mr-2 text-green-600 dark:text-green-400"
                animate={{ 
                  y: [0, -3, 0, 3, 0],
                  transition: { repeat: Infinity, duration: 3 }
                }}
              >
                <BarChart2 size={20} />
              </motion.span>
              Browser Usage
            </motion.h3>
          </div>
          <div className="h-64">
            <BarChart data={stats?.userAgents || []} />
          </div>
        </motion.div>
      </motion.div>

      {/* Sources Table */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6 border border-transparent hover:border-purple-400/30 transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ 
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        <motion.h3 
          className="text-lg font-bold text-gray-900 dark:text-white mb-4"
          whileHover={{ scale: 1.01 }}
        >
          Top Traffic Sources
        </motion.h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <motion.th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  whileHover={{ scale: 1.02 }}
                >
                  Source
                </motion.th>
                <motion.th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  whileHover={{ scale: 1.02 }}
                >
                  Visitors
                </motion.th>
                <motion.th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  whileHover={{ scale: 1.02 }}
                >
                  Percentage
                </motion.th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats?.sources?.map((source, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ 
                    backgroundColor: "rgba(99, 102, 241, 0.05)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {source._id === 'unknown' ? 'Direct / Unknown' : source._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {source.count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {((source.count / stats.totalVisitors) * 100).toFixed(1)}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default Stats;