
import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, Database, FileText, Users, TrendingUp, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Resumes',
      description: 'Easily upload and process candidate resumes in PDF or Word format',
      link: '/upload',
      color: 'bg-blue-500'
    },
    {
      icon: Eye,
      title: 'Extract Fields',
      description: 'Extract structured information like name, email, experience from resumes',
      link: '/extract-fields',
      color: 'bg-indigo-500'
    },
    {
      icon: Zap,
      title: 'Extract Key Skills',
      description: 'Identify and categorize the most important skills from candidate resumes',
      link: '/extract-skills',
      color: 'bg-yellow-500'
    },
    {
      icon: Search,
      title: 'Search Candidates',
      description: 'Find the perfect candidates using advanced skill-based search',
      link: '/search',
      color: 'bg-green-500'
    },
    {
      icon: Database,
      title: 'Build Index',
      description: 'Optimize search performance by building the candidate index',
      link: '/build-index',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    { icon: Users, label: 'Total Candidates', value: '1,234' },
    { icon: FileText, label: 'Resumes Processed', value: '2,456' },
    { icon: TrendingUp, label: 'Successful Matches', value: '89%' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          Resume Management System
        </h1>
        <p className="text-xl text-foreground max-w-3xl mx-auto">
          Streamline your recruitment process with our comprehensive resume management platform. 
          Upload, extract, search, and manage candidate profiles with advanced AI capabilities.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="bg-muted p-3 rounded-full">
                  <stat.icon className="h-8 w-8 text-foreground" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Complete Resume Processing Pipeline
          </h2>
          <p className="text-foreground max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools you need to manage your recruitment process efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`${feature.color} p-2 rounded-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={feature.link}>
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Begin by uploading your first resume or explore our extraction capabilities to see how our AI can help streamline your recruitment process.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/upload">
                <Button variant="secondary" size="lg">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume
                </Button>
              </Link>
              <Link to="/extract-fields">
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                  <Eye className="h-4 w-4 mr-2" />
                  Extract Fields
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
