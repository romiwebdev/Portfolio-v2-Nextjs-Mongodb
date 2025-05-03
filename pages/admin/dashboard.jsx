// pages/admin/dashboard.jsx
import Head from 'next/head';
import Link from 'next/link';
import {
  Home,
  User,
  Code,
  Briefcase,
  Award,
  BarChart2,
  Mail,
  Settings,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const cardItems = [
    {
      title: 'Home Page',
      description: 'Manage hero section, about brief, etc.',
      icon: Home,
      path: '/admin/manage/home',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'About',
      description: 'Manage your personal information',
      icon: User,
      path: '/admin/manage/about',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Skills',
      description: 'Update your skills and technologies',
      icon: Code,
      path: '/admin/manage/skills',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Projects',
      description: 'Manage your projects showcase',
      icon: Briefcase,
      path: '/admin/manage/projects',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Certificates',
      description: 'Create and manage certificates',
      icon: Award,
      path: '/admin/manage/certificates',
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Stats',
      description: 'View portfolio statistics',
      icon: BarChart2,
      path: '/admin/manage/visitors',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Settings',
      description: 'Change password and other settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'bg-gray-100 text-gray-600'
    },
  ];

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what you can manage.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cardItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="p-5">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${item.color} mb-4`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.description}</p>
                <div className="flex items-center text-sm font-medium text-blue-600">
                  <span>Manage</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}