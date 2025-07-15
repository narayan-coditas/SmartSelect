
import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertCircle, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ExtractedFields {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: string;
  education?: string;
  skills?: string[];
}

const ExtractFields: React.FC = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedFields | null>(null);
  const [extractStatus, setExtractStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadedResume, setUploadedResume] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's an uploaded resume in session storage
    const resumeData = sessionStorage.getItem('uploadedResume');
    if (resumeData) {
      setUploadedResume(JSON.parse(resumeData));
    }
  }, []);

  const handleExtractFields = async () => {
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
      const response = await fetch('http://127.0.0.1:8000/extract-fields', {
        method: 'POST',
        body: new FormData(), // Backend will use the last uploaded file
      });

      if (response.ok) {
        const data = await response.json();
        setExtractedFields(data);
        setExtractStatus('success');
        toast({
          title: "Success!",
          description: "Fields extracted successfully",
        });
      } else {
        throw new Error('Extraction failed');
      }
    } catch (error) {
      setExtractStatus('error');
      toast({
        title: "Error",
        description: "Failed to extract fields. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleContinueToSkills = () => {
    if (extractedFields) {
      sessionStorage.setItem('extractedFields', JSON.stringify(extractedFields));
    }
    navigate('/extract-skills');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Extract Fields</h1>
        <p className="text-muted-foreground">Extract structured information from the uploaded resume</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resume Information</CardTitle>
            <CardDescription>
              Current resume ready for field extraction
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
              onClick={handleExtractFields}
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
                  <Eye className="h-4 w-4 mr-2" />
                  Extract Fields
                </>
              )}
            </Button>

            {extractedFields && (
              <Button
                onClick={handleContinueToSkills}
                className="w-full"
                variant="outline"
              >
                Continue to Extract Skills
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extracted Fields</CardTitle>
            <CardDescription>
              Structured information extracted from the resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            {extractedFields ? (
              <div className="space-y-4">
                {extractedFields.name && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="mt-1">{extractedFields.name}</p>
                  </div>
                )}
                {extractedFields.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="mt-1">{extractedFields.email}</p>
                  </div>
                )}
                {extractedFields.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="mt-1">{extractedFields.phone}</p>
                  </div>
                )}
                {extractedFields.location && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="mt-1">{extractedFields.location}</p>
                  </div>
                )}
                {extractedFields.experience && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience</label>
                    <p className="mt-1">{extractedFields.experience}</p>
                  </div>
                )}
                {extractedFields.education && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Education</label>
                    <p className="mt-1">{extractedFields.education}</p>
                  </div>
                )}
                {extractedFields.skills && extractedFields.skills.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Skills</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {extractedFields.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Extract fields to see structured information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExtractFields;
