import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Users,
  Clock,
  BarChart2,
  PieChart,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Modal from '@/components/admin/Modal';
import ConfirmModal from '@/components/admin/ConfirmModal';

// Load komponen chart secara dinamis
const LineChart = dynamic(() => import('@/components/stats/LineChart'), { ssr: false });
const BarChart = dynamic(() => import('@/components/stats/BarChart'), { ssr: false });
const PieChartComponent = dynamic(() => import('@/components/stats/PieChart'), { ssr: false });

const ITEMS_PER_PAGE = 10;

export default function VisitorDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data visitor dan statistik
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch('/api/visitors/stats');
      const statsData = await statsRes.json();
      setStats(statsData);
      
      // Fetch visitor list
      const visitorsRes = await fetch(`/api/visitors/list?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      const visitorsData = await visitorsRes.json();
      setVisitors(visitorsData.visitors);
      setTotalPages(Math.ceil(visitorsData.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Handle reset data
  const handleReset = async () => {
    try {
      const response = await fetch('/api/visitors/reset', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchData();
        setIsConfirmOpen(false);
      }
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Parse user agent
  const parseUserAgent = (ua) => {
    if (!ua) return 'Unknown';
    
    if (ua.includes('Mobile')) {
      return 'Mobile';
    } else if (ua.includes('Tablet')) {
      return 'Tablet';
    } else if (ua.includes('Windows')) {
      return 'Windows PC';
    } else if (ua.includes('Macintosh')) {
      return 'Mac';
    } else if (ua.includes('Linux')) {
      return 'Linux PC';
    }
    
    return 'Desktop';
  };

  return (
    <>
      <Head>
        <title>Visitor Dashboard</title>
      </Head>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Visitor Management</h2>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash2 size={18} />
            Reset All Data
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Visitors</p>
                    <p className="text-xl font-bold">{stats?.totalVisitors || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Today's Visitors</p>
                    <p className="text-xl font-bold">
                      {stats?.last30Days?.find(day => 
                        day._id === new Date().toISOString().split('T')[0]
                      )?.count || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <PieChart size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Top Page</p>
                    <p className="text-xl font-bold truncate">
                      {stats?.pageVisits[0]?._id === '/' ? 'Home' : 
                       stats?.pageVisits[0]?._id?.charAt(1).toUpperCase() + stats?.pageVisits[0]?._id?.slice(2) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                    <BarChart2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Top Browser</p>
                    <p className="text-xl font-bold">
                      {stats?.userAgents[0]?._id || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Clock className="mr-2 text-purple-600" size={18} />
                  Visitor Trend (Last 30 Days)
                </h3>
                <div className="h-64">
                  <LineChart data={stats?.last30Days || []} />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <PieChart className="mr-2 text-blue-600" size={18} />
                  Page Visits Distribution
                </h3>
                <div className="h-64">
                  <PieChartComponent data={stats?.pageVisits || []} />
                </div>
              </div>
            </div>

            {/* Visitor List */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Recent Visitors</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visitors.map((visitor, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(visitor.timestamp)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {visitor.pageVisited === '/' ? 'Home' : visitor.pageVisited}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {parseUserAgent(visitor.userAgent)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {visitor.source === 'unknown' ? 'Direct' : visitor.source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirm Reset Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleReset}
        title="Reset Visitor Data"
        message="Are you sure you want to delete ALL visitor data? This action cannot be undone."
        confirmText="Reset Data"
        confirmColor="red"
      />
    </>
  );
}