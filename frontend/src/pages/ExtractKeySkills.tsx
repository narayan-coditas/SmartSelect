
import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertCircle, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface KeySkillsResponse {
  skills: string[];
  categories?: {
    [category: string]: string[];
  };
}

const ExtractKeySkills: React.FC = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [keySkills, setKeySkills] = useState<KeySkillsResponse | null>(null);
  const [extractStatus, setExtractStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadedResume, setUploadedResume] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const resumeData = sessionStorage.getItem('uploadedResume');
    if (resumeData) {
      setUploadedResume(JSON.parse(resumeData));
    }
  }, []);

  const handleExtractKeySkills = async () => {
    if (!uploadedResume) {
      toast({
        title: "No Resume Found",
        description: "Please upload a resume first.",
        variant: "destructive",
      });
      navigate('/upload');
      return;
    }

    setIsExtracting(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/extract-key-skills', {
        method: 'POST',
        body: new FormData(),
      });

      if (response.ok) {
        const data = await response.json();
        setKeySkills(data);
        setExtractStatus('success');
        toast({
          title: "Success!",
          description: `Extracted ${data.skills?.length || 0} key skills`,
        });
      } else {
        throw new Error('Extraction failed');
      }
    } catch (error) {
      setExtractStatus('error');
      toast({
        title: "Error",
        description: "Failed to extract key skills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleContinueToBuildIndex = () => {
    if (keySkills) {
      sessionStorage.setItem('extractedSkills', JSON.stringify(keySkills));
    }
    navigate('/build-index');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Extract Key Skills</h1>
        <p className="text-muted-foreground">Identify and categorize the most important skills from the resume</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resume Information</CardTitle>
            <CardDescription>
              Current resume ready for skill extraction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {uploadedResume ? (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{uploadedResume.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedResume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {extractStatus === 'success' && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
                {extractStatus === 'error' && (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No resume uploaded</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/upload')}
                  className="mt-4"
                >
                  Upload Resume
                </Button>
              </div>
            )}

            <Button
              onClick={handleExtractKeySkills}
              disabled={!uploadedResume || isExtracting}
              className="w-full"
              size="lg"
            >
              {isExtracting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Extracting...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Extract Key Skills
                </>
              )}
            </Button>

            {keySkills && (
              <Button
                onClick={handleContinueToBuildIndex}
                className="w-full"
                variant="outline"
              >
                Continue to Build Index
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Skills</CardTitle>
            <CardDescription>
              Most relevant skills identified from the resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            {keySkills ? (
              <div className="space-y-6">
                {keySkills.skills && keySkills.skills.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">All Skills ({keySkills.skills.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {keySkills.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {keySkills.categories && Object.keys(keySkills.categories).length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Skills by Category</h4>
                    {Object.entries(keySkills.categories).map(([category, skills]) => (
                      <div key={category}>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                          {category.replace('_', ' ')}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Extract skills to see categorized results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExtractKeySkills;
