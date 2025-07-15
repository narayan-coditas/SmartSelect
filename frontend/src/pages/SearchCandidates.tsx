
import React, { useState } from 'react';
import { Search, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  skills: string[];
  experience?: string;
  lastUpdated: string;
  matched_skill?: string;
  score?: number;
}

const SearchCandidates: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Candidate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(false);

    try {
      const response = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Search response:', data);
        
        // Backend returns 'matches' array, not 'candidates'
        const matches = data.matches || [];
        
        // Transform backend data to frontend format
        const transformedResults = matches.map((match: any) => ({
          id: match.id,
          name: match.name,
          email: match.email,
          phone: match.phone,
          location: match.location,
          skills: match.matched_skill ? [match.matched_skill] : [],
          experience: match.experience,
          lastUpdated: match.lastUpdated || new Date().toISOString(),
          matched_skill: match.matched_skill,
          score: match.score
        }));
        
        setResults(transformedResults);
        setHasSearched(true);
        toast({
          title: "Search Complete",
          description: `Found ${transformedResults.length} candidates`,
        });
      } else {
        throw new Error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to search candidates. Please try again.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Search Candidates</h1>
        <p className="text-foreground">Find candidates by skills, experience, or keywords</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Query</CardTitle>
          <CardDescription>
            Enter skills, job titles, or keywords to find matching candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="e.g., React, JavaScript, Frontend Developer, 5 years experience"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              size="lg"
              className="px-8"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Search Results ({results.length} candidates found)
          </h2>
        </div>
      )}

      <div className="grid gap-6">
        {results.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{candidate.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-1">
                      {candidate.email && (
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {candidate.email}
                        </span>
                      )}
                      {candidate.phone && (
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {candidate.phone}
                        </span>
                      )}
                      {candidate.location && (
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {candidate.location}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {candidate.score && (
                    <div className="text-sm font-medium text-green-600">
                      Match: {Math.round(candidate.score)}%
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(candidate.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {candidate.experience && (
                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">Experience</h4>
                  <p className="text-foreground">{candidate.experience}</p>
                </div>
              )}
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant={skill === candidate.matched_skill ? "default" : "secondary"}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Resume
                </Button>
                <Button size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasSearched && results.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No candidates found</h3>
            <p className="text-foreground">Try adjusting your search terms or keywords</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchCandidates;
