
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const NotFound = () => {
  const location = useLocation();
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div 
        ref={contentRef}
        className={`text-center transition-all duration-800 ${
          contentVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-12 scale-95'
        }`}
      >
        <h1 className="text-4xl font-bold mb-4 animate-fade-in">404</h1>
        <p className="text-xl text-gray-600 mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          Oops! Page not found
        </p>
        <a 
          href="/" 
          className="text-blue-500 hover:text-blue-700 underline animate-fade-in hover-scale" 
          style={{ animationDelay: '400ms' }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
