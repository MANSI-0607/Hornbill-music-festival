
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Calendar, Music } from 'lucide-react';

const ComingSoon = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    // Here you would typically save the email to your database
    toast({
      title: 'Success!',
      description: 'Thank you for subscribing! We\'ll notify you when we launch.',
    });
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-8 md:p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo/Brand Section */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <Music className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Something amazing is on the way. We're working hard to bring you an incredible experience.
          </p>
        </div>

        {/* Email Subscription */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <Mail className="w-5 h-5" />
            <span>Get notified when we launch</span>
          </div>
          
          <form onSubmit={handleEmailSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="px-6">
              Notify Me
            </Button>
          </form>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          {[
            {
              icon: <Music className="w-8 h-8" />,
              title: 'Amazing Features',
              description: 'Experience the best music festival management platform'
            },
            {
              icon: <Calendar className="w-8 h-8" />,
              title: 'Event Planning',
              description: 'Comprehensive tools for organizing unforgettable events'
            },
            {
              icon: <Mail className="w-8 h-8" />,
              title: 'Stay Connected',
              description: 'Get updates and notifications about our launch'
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-card/30 backdrop-blur-sm border-primary/10">
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p>© 2024 TaFMA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
