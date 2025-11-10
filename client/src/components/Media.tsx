import React from "react";
import { ExternalLink, Youtube } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MediaPanelProps {
  youtubeId: string;
  articles: { title: string; url: string }[];
}

const Media: React.FC<MediaPanelProps> = ({ youtubeId, articles }) => {
  return (
    <Card
      className="border border-white/10 bg-gradient-to-b from-[#0a0a0a]/60 to-[#0b0b0f]/80 rounded-2xl overflow-hidden transition-all duration-500"
    >
      <CardContent className="p-6 md:p-10">
        {/* Center Heading */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Youtube className="text-neon-pink" size={36} />
          </div>
          <h3 className="text-3xl md:text-4xl font-righteous text-neon-pink tracking-wide">
            Media
          </h3>
          <div className="w-16 h-[2px] bg-pink-500 mx-auto mt-3 rounded-full" />
        </div>

        {/* YouTube Video */}
        <div className="rounded-xl overflow-hidden border border-white/10 mb-8 mx-auto max-w-3xl">
          <div
            className="relative w-full"
            style={{ aspectRatio: "16/9", maxHeight: "280px" }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Hornbill Music Festival 2025"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Articles Section */}
        <div className="max-w-5xl mx-auto space-y-4">
          <h4 className="text-lg md:text-xl font-semibold text-gray-100 mb-4 text-center">
            Latest News & Articles
          </h4>

          {articles.map((a, i) => (
            <a
              key={a.url}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl p-5 border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:border-pink-400/40"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-gray-100 font-medium leading-snug group-hover:text-pink-300 transition-colors duration-200">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new URL(a.url).hostname}
                  </p>
                </div>
                <ExternalLink
                  size={18}
                  className="text-gray-400 group-hover:text-pink-400 transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="btn-festival"
            onClick={() =>
              window.open(
                "https://www.youtube.com/@HornbillFestival",
                "_blank"
              )
            }
          >
            Visit Hornbill Channel
          </Button>
        </div>
      
      </CardContent>
    </Card>
  );
};

export default Media;
