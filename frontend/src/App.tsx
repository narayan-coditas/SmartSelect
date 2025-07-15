
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import UploadResume from "./pages/UploadResume";
import ExtractFields from "./pages/ExtractFields";
import ExtractKeySkills from "./pages/ExtractKeySkills";
import SearchCandidates from "./pages/SearchCandidates";
import BuildIndex from "./pages/BuildIndex";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/upload" element={<UploadResume />} />
            <Route path="/extract-fields" element={<ExtractFields />} />
            <Route path="/extract-skills" element={<ExtractKeySkills />} />
            <Route path="/search" element={<SearchCandidates />} />
            <Route path="/build-index" element={<BuildIndex />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
