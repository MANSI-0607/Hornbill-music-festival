
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Upload, Users, Phone, Mail, MapPin, Link, Clock } from 'lucide-react';
import TermsDialog from '@/components/TermsDialog';

const auditionSchema = z.object({
  bandName: z.string().min(1, 'Band name is required').max(100, 'Band name must be under 100 characters'),
  genre: z.string().min(1, 'Please select a genre'),
  bandMembers: z.string().min(10, 'Please provide band members and instruments (minimum 10 characters)').max(500, 'Maximum 500 characters'),
  bandBio: z.string().min(50, 'Bio must be at least 50 characters').max(2000, 'Bio must be under 2000 characters'),
  contactPerson: z.string().min(1, 'Contact person name is required'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().min(10, 'Please enter a valid phone number'),
  cityState: z.string().min(1, 'City & State is required'),
  socialLinks: z.string().optional(),
  auditionVideoUrl: z.string().url('Please enter a valid YouTube or Vimeo URL'),
  termsAccepted: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
});

type AuditionFormData = z.infer<typeof auditionSchema>;

const genres = [
  'Rock', 'Pop', 'Hip Hop', 'Electronic/EDM', 'Folk', 'Traditional Naga', 'Fusion', 'Jazz', 'Blues', 'Country', 'Metal', 'Indie', 'Alternative', 'World Music'
];

export default function Auditions() {
  const [bandPhotoFile, setBandPhotoFile] = useState<File | null>(null);
  const [bandPhotoUrl, setBandPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || '';
  const form = useForm<AuditionFormData>({
    resolver: zodResolver(auditionSchema),
    defaultValues: {
      bandName: '',
      genre: '',
      bandMembers: '',
      bandBio: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      cityState: '',
      socialLinks: '',
      auditionVideoUrl: '',
      termsAccepted: false,
    },
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB');
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Please upload a JPG or PNG file');
        return;
      }
      setBandPhotoFile(file);
      setPhotoError(null);
      setIsUploadingPhoto(true);
      setBandPhotoUrl(null);

      try {
        const formData = new FormData();
        formData.append('bandPhoto', file);
        const res = await fetch(`${API_BASE_URL}/auditions/upload-band-photo`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || 'Upload failed');
        }
        const data = await res.json();
        setBandPhotoUrl(data.url);
      } catch (err: any) {
        console.error('Photo upload error:', err);
        setPhotoError('Failed to upload photo. Please try again.');
        setBandPhotoUrl(null);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const onSubmit = async (data: AuditionFormData) => {
    if (!bandPhotoFile) {
      alert('Please select a band photo');
      return;
    }
    if (!bandPhotoUrl) {
      alert('Please wait for the band photo to finish uploading.');
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      // Prepare multipart form data
      const formData = new FormData();
      formData.append('bandName', data.bandName);
      formData.append('genre', data.genre);
      formData.append('bandMembers', data.bandMembers);
      formData.append('bandBio', data.bandBio);
      formData.append('contactPerson', data.contactPerson);
      formData.append('contactEmail', data.contactEmail);
      formData.append('contactPhone', data.contactPhone);
      formData.append('cityState', data.cityState);
      formData.append('socialLinks', data.socialLinks);
      formData.append('auditionVideoUrl', data.auditionVideoUrl);
      formData.append('termsAccepted', String(data.termsAccepted));
      // Use uploaded URL instead of uploading the file with the form
      formData.append('bandPhotoUrl', bandPhotoUrl);
  
      // Send to backend
      const response = await fetch(`${API_BASE_URL}/auditions`, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Submission failed');
      }
  
      const result = await response.json();
      console.log('Form submitted:', result);
  
      alert('🎉 Audition submitted successfully! You\'ll hear from us soon. Rock on!');
  
      // Reset form
      form.reset();
      setBandPhotoFile(null);
      setBandPhotoUrl(null);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong while submitting your audition. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const bandBioLength = form.watch('bandBio')?.length || 0;
  const bandMembersLength = form.watch('bandMembers')?.length || 0;
  const termsAccepted = form.watch('termsAccepted') || false;
  const isSubmissionOpen = false;
  return (
    <div className="min-h-screen bg-background">
    {/* Hero Section */}
    <section className="relative pt-0 pb-6 px-0 festival-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      <div className="relative text-center">
        {!isSubmissionOpen && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md">
            Auditions Closed
          </div>
        )}
        <div className="mb-0">
          <div className="w-full" style={{ aspectRatio: '5 / 2' }}>
            <img
              src="https://res.cloudinary.com/dovc3lfgz/image/upload/v1757339123/ahibi/bochmdduhenjlkuwuwxz.jpg"
              alt="Ticket to Hornbill - Band Auditions"
              className="w-full h-full block object-cover object-center"
              width={1600}
              height={640}
              loading="eager"
            />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <h2 className="text-2xl md:text-3xl font-righteous text-primary mb-6">Band Auditions</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Submit your band's audition for a chance to perform at the prestigious Hornbill Music Festival. 
            Showcase your talent to industry professionals and music lovers from around the world.
          </p>
        </div>
      </div>
    </section>

    {/* Form Section */}
    <section className="py-2 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-4xl mx-auto">
        <Card className="festival-card">
          <CardHeader>
            <CardTitle className="text-2xl font-righteous text-primary flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Band Registration
            </CardTitle>
            <CardDescription className="text-lg">
              {!isSubmissionOpen
                ? 'Submissions have closed. Thank you for participating!'
                : 'Please fill out all required fields carefully. Make sure all information is accurate as this will be used for evaluation and communication.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmissionOpen ? (
              <div className="p-8 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-righteous text-primary mb-4">
                  Results Announced!!
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Thank you to all the amazing bands who auditioned! 🎶  
                  The submission window is now closed.  
                 
                </p>
                <p className="text-3xl md:text-4xl font-extrabold text-primary mb-6">
             Results have been announced — see them on Instagram:{" "}
  <a
    href="https://www.instagram.com/hornbill_music/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline text-white"
  >
    @hornbill_music
  </a>
</p>

              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Terms & Conditions must be accepted first */}
                  <div className="space-y-3 p-4 rounded-lg border border-border bg-input/40">
                    <p className="text-sm text-gray-300">
                      Please review and accept the Terms & Conditions before proceeding.
                    </p>
                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-white text-sm">
                              I confirm I have the rights to submit this material and agree to the{' '}
                              <TermsDialog />.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* All fields below are enabled only after accepting terms */}
                  <fieldset disabled={!termsAccepted} className={!termsAccepted ? 'opacity-50 pointer-events-none select-none' : ''}>
                  {/* Band Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-righteous text-primary border-b border-secondary/20 pb-2">
                      Band Information
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="bandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Band name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Trance Effect" 
                              className="bg-input border-border" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Band photo upload moved here (right after band name) */}
                    <div>
                      <label className="text-white font-medium flex items-center mb-2">
                        <Upload className="h-4 w-4 mr-1" />
                        Band photo *
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-input/50">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="band-photo"
                        />
                        <label 
                          htmlFor="band-photo" 
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-white mb-1">
                            {bandPhotoFile ? bandPhotoFile.name : 'Click to upload band photo'}
                          </span>
                          <span className="text-gray-400 text-sm">
                            JPG/PNG, max 5MB, min 1200×800px
                          </span>
                        </label>
                        {/* Upload status */}
                        <div className="mt-3 text-sm">
                          {isUploadingPhoto && (
                            <span className="text-yellow-300">Uploading photo… please wait</span>
                          )}
                          {!isUploadingPhoto && bandPhotoUrl && (
                            <span className="text-green-400">Photo uploaded successfully ✔</span>
                          )}
                          {photoError && (
                            <span className="text-red-400">{photoError}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Primary genre *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-input border-border">
                                <SelectValue placeholder="Select a genre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-popover border-border">
                              {genres.map((genre) => (
                                <SelectItem key={genre} value={genre}>
                                  {genre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bandMembers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Band members & instruments *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Imna — Vocal, Kevi — Guitar, Neito — Bass, Meren — Drums"
                              className="bg-input border-border min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            {bandMembersLength}/500 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bandBio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Short band bio *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your band's story, musical style, achievements, and what makes you unique... (50-2000 characters)"
                              className="bg-input border-border min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            {bandBioLength}/2000 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Audition video link moved here (after short band bio) */}
                    <FormField
                      control={form.control}
                      name="auditionVideoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Audition video link (YouTube/Vimeo/Gdrive) *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Paste full URL" 
                              className="bg-input border-border" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Share a performance video that best represents your band's talent and style.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-righteous text-primary border-b border-secondary/20 pb-2">
                      Contact Information
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Contact person *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Full name" 
                              className="bg-input border-border" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            Contact email *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="name@example.com" 
                              className="bg-input border-border" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            Contact phone (WhatsApp preferred) *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+91 9XXXXXXXXX" 
                              className="bg-input border-border" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cityState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            City & State *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Kohima, Nagaland" 
                              className="bg-input border-border" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialLinks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                            <Link className="h-4 w-4 mr-1" />
                            Social links (optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste links (Instagram/YouTube/Facebook)"
                              className="bg-input border-border"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Media Submission Section removed; fields repositioned above */}
                  </fieldset>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full btn-festival text-lg py-6"
                    disabled={!termsAccepted || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting Audition...' : 'Submit Audition'}
                  </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
