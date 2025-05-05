# Portfolio Website with Next.js and MongoDB

## Overview

This is a modern portfolio website built with Next.js and MongoDB, featuring a responsive design, dynamic content management, and an admin dashboard for content management. The website showcases my professional portfolio including projects, skills, certifications, and statistics.

## Features

### Frontend
- **Home**: Introduction and quick overview
- **About**: Detailed personal and professional information
- **Skills**: Technical skills with proficiency levels
- **Projects**: Portfolio projects with details and links
- **Certifications**: Professional certifications and achievements
- **Stats**: Statistics and metrics about my work
- **Contact**: Contact form and information

### Backend
- **Admin Dashboard**: Secure area for content management
  - CRUD operations for all portfolio sections
  - User authentication and authorization
  - Data analytics and statistics
- **MongoDB Integration**: For storing all portfolio data
- **API Routes**: Next.js API routes for data operations

## Technologies Used

### Frontend
- Next.js (App Router)
- React.js
- TypeScript (optional)
- Tailwind CSS
- Framer Motion (for animations)
- React Icons

### Backend
- Next.js API routes
- MongoDB (with Mongoose)
- NextAuth.js (for authentication)
- Form validation libraries (Zod, React Hook Form)

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- MongoDB Atlas account or local MongoDB installation
- Git

## Project Structure

```
/portfolio-nextjs/
├── app/
│   ├── (admin)/                   # Admin dashboard routes
│   ├── api/                       # API routes
│   ├── about/                     # About page
│   ├── skills/                    # Skills page
│   ├── projects/                  # Projects page
│   ├── certifications/            # Certifications page
│   ├── stats/                     # Stats page
│   ├── contact/                   # Contact page
│   ├── layout.tsx                 # Main layout
│   └── page.tsx                   # Home page
├── components/                    # Reusable components
├── lib/                           # Utility functions
├── models/                        # MongoDB models
├── public/                        # Static files
├── styles/                        # Global styles
├── .env.local                     # Environment variables
├── next.config.js                 # Next.js configuration
└── package.json                   # Project dependencies
```

## Data Models

The MongoDB database contains the following collections:

1. **User**: For admin authentication
2. **Skill**: Technical skills data
3. **Project**: Portfolio projects
4. **Certification**: Professional certifications
5. **Stat**: Statistics and metrics
6. **ContactMessage**: Messages from contact form

## Admin Dashboard

Access the admin dashboard at `/admin` (authentication required). Features include:

- Login/logout functionality
- Dashboard overview
- Management sections for all portfolio content
- Form validation and error handling
- Responsive design for all devices

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Inspiration from various portfolio designs