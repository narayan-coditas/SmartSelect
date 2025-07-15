import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const BuildIndex: React.FC = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [lastBuildTime, setLastBuildTime] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBuildIndex = async () => {
    setIsBuilding(true);
    setBuildStatus('building');

    try {
      const response = await fetch('http://127.0.0.1:8000/build-index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBuildStatus('success');
        setLastBuildTime(new Date().toISOString());
        toast({
          title: "Success!",
          description: "Index built successfully. Redirecting to search...",
        });
        
        // Redirect to search candidates page after a short delay
        setTimeout(() => {
          navigate('/search');
        }, 2000);
      } else {
        throw new Error('Build failed');
      }
    } catch (error) {
      setBuildStatus('error');
      toast({
        title: "Error",
        description: "Failed to build index. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const getStatusIcon = () => {
    switch (buildStatus) {
      case 'building':
        return <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusMessage = () => {
    switch (buildStatus) {
      case 'building':
        return 'Building search index...';
      case 'success':
        return 'Index built successfully - Redirecting to search...';
      case 'error':
        return 'Failed to build index';
      default:
        return 'Ready to build index';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Build Search Index</h1>
        <p className="text-foreground">Build or rebuild the search index to improve candidate search performance</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-600" />
            <span>Search Index Management</span>
          </CardTitle>
          <CardDescription>
            The search index needs to be rebuilt when new resumes are added to ensure accurate search results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <p className="font-medium text-foreground">{getStatusMessage()}</p>
                {lastBuildTime && (
                  <p className="text-sm text-muted-foreground">
                    Last built: {new Date(lastBuildTime).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Building the index may take a few moments depending on the number of resumes in the database.
              The search functionality will be temporarily unavailable during this process.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleBuildIndex}
            disabled={isBuilding}
            size="lg"
            className="w-full"
          >
            {isBuilding ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Building Index...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Build Index
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1 rounded-full mt-1">
              <Database className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Index Creation</h4>
              <p className="text-sm text-foreground">
                Processes all uploaded resumes and creates searchable indexes for skills, experience, and keywords
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-1 rounded-full mt-1">
              <RefreshCw className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Optimization</h4>
              <p className="text-sm text-foreground">
                Optimizes search performance and ensures accurate matching of candidate profiles
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-1 rounded-full mt-1">
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Validation</h4>
              <p className="text-sm text-foreground">
                Validates the index integrity and provides feedback on the indexing process
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildIndex;
