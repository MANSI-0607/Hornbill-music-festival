import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Music } from "lucide-react";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // simple client-side email check
    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "coming-soon" }),
      });

      if (res.ok) {
        toast({
          title: "Success!",
          description:
            "Thank you for subscribing! We’ll notify you when we launch.",
        });
        setEmail("");
        return;
      }

      const data = await res.json().catch(() => ({ message: "Request failed" }));
      if (res.status === 409) {
        toast({
          title: "You're already on the list",
          description: "We'll keep you posted as soon as we launch.",
        });
      } else if (res.status === 400) {
        toast({
          title: "Invalid email",
          description: data.message || "Please check your email and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: data.message || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060616] via-[#020214] to-[#08102a] flex items-center justify-center p-6 md:p-10">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        {/* Logo / Brand Section */}
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            <div className="w-24 h-24 bg-gradient-to-br from-festival-blue to-festival-orange rounded-full flex items-center justify-center shadow-festival-glow">
              <Music className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-righteous bg-gradient-to-r from-festival-blue to-festival-orange bg-clip-text text-transparent tracking-wide">
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
            <Mail className="w-5 h-5 text-festival-orange" />
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
              className="flex-1 rounded-full border-festival-orange/40 bg-white/5 text-white placeholder:text-gray-400"
              required
            />
            <Button
              type="submit"
              className="px-6 rounded-full bg-festival-orange hover:bg-festival-orange-dark text-white font-semibold transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Notify Me"}
            </Button>
          </form>
        </div>

        {/* Single Centered Card */}
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <Mail className="w-8 h-8 text-festival-blue" />
              </div>
              <h3 className="font-semibold text-xl text-white">
                Stay Connected
              </h3>
              <p className="text-lg text-gray-400">
                Get updates and exclusive news about Hornbill Festival 2025.
              </p>
            </CardContent>
          </Card>
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
