
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Auditions from "./pages/Auditions";
import About from "./pages/About";
import Schedule from "./pages/Schedule";
import Gallery from "./pages/Gallery";
import HornbillMusicFestival from "./pages/HornbillMusicFestival";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import Artists from "./pages/Artists";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import Media from "./components/Media";
import Merch from "./pages/Merch";
import AdminMerchManage from "./pages/AdminMerchManage";
import AdminHero from "./pages/AdminHero";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Navigation />
          <main className="mobile-page-content flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auditions" element={<Auditions />} />
              <Route path="/events" element={<Events/>} />
              <Route path="/artists" element={<Artists/>} />
              <Route path="/about" element={<About />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/merch" element={<Merch />} />
              <Route path="/media" element={<Media youtubeId="Uzt5_n0vchU" articles={[
                { title: "TaFMA announces 26th Toyota Hornbill Music Festival 2025", url: "https://www.easternmirrornagaland.com/tafma-announces-26th-toyota-hornbill-music-festival-2025-to-feature-several-new-initiatives" },
                { title: "Toyota Hornbill Music Festival 2025 set to showcase collaborations", url: "https://nagalandtribune.in/toyota-hornbill-music-festival-2025-set-to-showcase-international-collaborations-local-talent-and-inclusivity/" },
                { title: "Nagaland: TaFMA announces Toyota Hornbill Music Fest 2025", url: "https://nagalandpost.com/nagaland-tafma-announces-toyota-hornbill-music-fest-2025/" },
              ]} />} />
              <Route path="/hornbill-music-festival" element={<HornbillMusicFestival />} />
               {/* Admin Routes */}
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/admin/merch" 
    element={
      <ProtectedRoute>
        <AdminMerchManage />
      </ProtectedRoute>
    }
    
  />
   <Route 
    path="/admin/hero" 
    element={
      <ProtectedRoute>
        <AdminHero />
      </ProtectedRoute>
    }/>
    
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
