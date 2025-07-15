
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Upload, Search, Database, FileText, Eye, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Upload Resume', href: '/upload', icon: Upload },
    { name: 'Extract Fields', href: '/extract-fields', icon: Eye },
    { name: 'Extract Skills', href: '/extract-skills', icon: Zap },
    { name: 'Search Candidates', href: '/search', icon: Search },
    { name: 'Build Index', href: '/build-index', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Resume Hub</span>
              </Link>
            </div>
            <div className="flex space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
