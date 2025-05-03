// components/admin/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  LayoutDashboard,
  Home,
  User,
  Code,
  Briefcase,
  Award,
  BarChart2,
  Mail,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth', {
          credentials: 'include',
        });
        
        if (!response.ok && router.pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    if (router.pathname.startsWith('/admin')) {
      checkAuth();
    }
  }, [router]);

  if (router.pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Home', path: '/admin/manage/home', icon: Home },
    { name: 'About', path: '/admin/manage/about', icon: User },
    { name: 'Skills', path: '/admin/manage/skills', icon: Code },
    { name: 'Projects', path: '/admin/manage/projects', icon: Briefcase },
    { name: 'Certificates', path: '/admin/manage/certificates', icon: Award },
    { name: 'Stats', path: '/admin/manage/visitors', icon: BarChart2 },
    { name: 'Settings', path: '/admin/manage/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Portfolio Admin Dashboard" />
      </Head>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white shadow-md z-30 transition-all duration-300 ease-in-out 
          ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar content */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      router.push(item.path);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors
                      ${router.pathname === item.path 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <button
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST' });
                router.push('/admin/login');
              }}
              className="flex items-center w-full p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ease-in-out 
        ${sidebarOpen && !isMobile ? 'md:ml-64' : 'md:ml-0'}`}>
        {/* Top navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 md:hidden"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-700">
                Admin User
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}