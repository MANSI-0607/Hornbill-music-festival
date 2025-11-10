import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Music } from "lucide-react";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description:
        "Thank you for subscribing! We’ll notify you when we launch.",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#05040a] to-[#100016] flex items-center justify-center p-6 md:p-10">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        {/* Logo / Brand Section */}
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_#ff2dd466]">
              <Music className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-righteous bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
            Coming Soon
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Something amazing is on the way. We're working hard to bring you an
            unforgettable Hornbill Music Festival experience.
          </p>
        </div>

        {/* Email Subscription */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-3">
            <Mail className="w-5 h-5" />
            <span>Get notified when we launch</span>
          </div>

          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col sm:flex-row gap-3 sm:gap-2"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border-pink-500/40 bg-white/5 text-white placeholder:text-gray-400"
            />
            <Button
              type="submit"
              className="px-6 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-all duration-300"
            >
              Notify Me
            </Button>
          </form>
        </div>

        {/* Single Centered Card */}
        <div className="max-w-md mx-auto">
         
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <Mail className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="font-semibold text-xl text-white">
                Stay Connected
              </h3>
              <p className="text-lg text-gray-400">
                Get updates and exclusive news about Hornbill Festival 2025.
              </p>
            </CardContent>
          
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 pt-10 text-sm">
          © 2025 TaFMA · All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
