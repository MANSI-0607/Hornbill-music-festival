
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
import { Upload, Phone, Mail, MapPin, Link, Clock, Mic, CheckCircle2, Video, Music2 } from 'lucide-react';
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
  const isSubmissionOpen = true;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Banner ── */}
      <section className="relative pt-0 pb-0 px-0">
        {/* Mobile: 16/9, tablet+: 5/2 */}
        <div className="w-full aspect-video sm:aspect-[5/2]">
          <img
            src="ab.jpg"
            alt="Ticket to Hornbill - Band Auditions 2026"
            className="w-full h-full block object-cover object-center"
            width={1600}
            height={640}
            loading="eager"
          />
        </div>
        {isSubmissionOpen && (
          <span className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 bg-green-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg animate-pulse">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white inline-block" />
            Live — Auditions 2026
          </span>
        )}
      </section>

      {/* ── Registration Form ── */}
      <section className="py-5 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="festival-card border border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-4 sm:pb-5 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-righteous text-primary">
                Band Auditions 2026
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm mt-1">
                {isSubmissionOpen
                  ? 'Submissions are open. All fields marked * are required — your details will be used for evaluation and communication.'
                  : 'Submissions have closed. Thank you for participating!'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5 sm:pt-6 px-4 sm:px-6">
              {!isSubmissionOpen ? (
                <div className="p-8 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-righteous text-primary mb-4">Results Announced!</h2>
                  <p className="text-lg text-gray-300 mb-4">
                    Thank you to all the amazing bands who auditioned! 🎶 The submission window is now closed.
                  </p>
                  <p className="text-xl font-bold text-primary">
                    See results on Instagram:{' '}
                    <a href="https://www.instagram.com/hornbill_music/" target="_blank" rel="noopener noreferrer" className="underline text-white">
                      @hornbill_music
                    </a>
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">

                    {/* ── Step 1: Terms ── */}
                    <div className="rounded-xl border border-festival-orange/30 bg-festival-orange/5 p-4 sm:p-5">
                      <p className="text-xs font-bold text-festival-orange uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0" /> Step 1 — Terms &amp; Conditions
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 mb-4">
                        Please read and accept the Terms &amp; Conditions before filling out the form.
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

                    {/* ── Steps 2 & 3 locked until terms accepted ── */}
                    <fieldset disabled={!termsAccepted} className={!termsAccepted ? 'opacity-40 pointer-events-none select-none' : 'space-y-6 sm:space-y-8'}>

                      {/* ── Step 2: Band Information ── */}
                      <div className="space-y-4 sm:space-y-5">
                        <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-festival-orange pl-3">
                          <Music2 className="h-4 w-4 sm:h-5 sm:w-5 text-festival-orange shrink-0" />
                          <h3 className="text-lg sm:text-xl font-righteous text-white">
                            Step 2 — Band Information
                          </h3>
                        </div>

                        {/* Band Name + Genre — stacked on mobile, side by side on md+ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                          <FormField
                            control={form.control}
                            name="bandName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Band name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Trance Effect" className="bg-input border-border" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Band Photo Upload */}
                        <div>
                          <label className="text-white font-medium flex flex-wrap items-center gap-1.5 mb-2 text-sm">
                            <Upload className="h-4 w-4 text-festival-orange shrink-0" />
                            Band photo *
                            <span className="text-gray-500 text-xs font-normal">JPG/PNG · max 5 MB · min 1200×800 px</span>
                          </label>
                          <div className={`border-2 border-dashed rounded-xl transition-colors duration-200 ${bandPhotoUrl ? 'border-green-500/60 bg-green-900/10' : 'border-border bg-input/40 hover:border-festival-orange/50'}`}>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png"
                              onChange={handlePhotoUpload}
                              className="hidden"
                              id="band-photo"
                            />
                            <label htmlFor="band-photo" className="cursor-pointer flex flex-col sm:flex-row items-center gap-4 p-5">
                              {bandPhotoUrl ? (
                                <img src={bandPhotoUrl} alt="Band preview" className="w-24 h-16 object-cover rounded-lg border border-green-500/40 shrink-0" />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                  <Upload className="h-7 w-7 text-gray-400" />
                                </div>
                              )}
                              <div className="text-center sm:text-left">
                                <p className="text-white text-sm font-medium">
                                  {bandPhotoFile ? bandPhotoFile.name : 'Click to upload band photo'}
                                </p>
                                {isUploadingPhoto && <p className="text-yellow-300 text-xs mt-1">Uploading… please wait</p>}
                                {!isUploadingPhoto && bandPhotoUrl && <p className="text-green-400 text-xs mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Uploaded successfully</p>}
                                {photoError && <p className="text-red-400 text-xs mt-1">{photoError}</p>}
                                {!bandPhotoFile && <p className="text-gray-500 text-xs mt-1">JPG or PNG up to 5 MB</p>}
                              </div>
                            </label>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="bandMembers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Band members &amp; instruments *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Imna — Vocal, Kevi — Guitar, Neito — Bass, Meren — Drums"
                                  className="bg-input border-border min-h-[90px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-gray-500 text-xs text-right">
                                {bandMembersLength}/500
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
                                  placeholder="Tell us about your band's story, musical style, achievements, and what makes you unique… (50–2000 characters)"
                                  className="bg-input border-border min-h-[110px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-gray-500 text-xs text-right">
                                {bandBioLength}/2000
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Audition Video */}
                        <FormField
                          control={form.control}
                          name="auditionVideoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white flex items-center gap-1.5">
                                <Video className="h-4 w-4 text-festival-orange" />
                                Audition video link *
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="YouTube / Vimeo / Google Drive URL" className="bg-input border-border" {...field} />
                              </FormControl>
                              <FormDescription className="text-gray-500 text-xs">
                                Share a live performance video that best represents your band's talent and energy.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* ── Step 3: Contact Information ── */}
                      <div className="space-y-4 sm:space-y-5 mt-6">
                        <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-festival-orange pl-3">
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-festival-orange shrink-0" />
                          <h3 className="text-lg sm:text-xl font-righteous text-white">
                            Step 3 — Contact Information
                          </h3>
                        </div>

                        {/* Contact Person + City — stacked on mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                          <FormField
                            control={form.control}
                            name="contactPerson"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Contact person *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full name" className="bg-input border-border" {...field} />
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
                                <FormLabel className="text-white flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-festival-orange" /> City &amp; State *
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Kohima, Nagaland" className="bg-input border-border" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Email + Phone — stacked on mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                          <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white flex items-center gap-1">
                                  <Mail className="h-4 w-4 text-festival-orange" /> Contact email *
                                </FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="name@example.com" className="bg-input border-border" {...field} />
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
                                <FormLabel className="text-white flex items-center gap-1">
                                  <Phone className="h-4 w-4 text-festival-orange" /> Phone (WhatsApp) *
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 9XXXXXXXXX" className="bg-input border-border" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="socialLinks"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white flex items-center gap-1">
                                <Link className="h-4 w-4 text-festival-orange" /> Social links
                                <span className="text-gray-500 text-xs font-normal ml-1">(optional)</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Instagram, YouTube, Facebook — paste one link per line"
                                  className="bg-input border-border min-h-[70px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                    </fieldset>

                    {/* ── Submit ── */}
                    <div className="pt-2">
                      {!termsAccepted && (
                        <p className="text-center text-xs sm:text-sm text-gray-500 mb-3">
                          Accept the Terms &amp; Conditions above to unlock the form.
                        </p>
                      )}
                      <Button
                        type="submit"
                        className="w-full btn-festival text-sm sm:text-base py-4 sm:py-5 flex items-center justify-center gap-2 min-h-[48px]"
                        disabled={!termsAccepted || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Submitting…
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                            Submit Audition for HMF 2026
                          </>
                        )}
                      </Button>
                      <p className="text-center text-xs text-gray-600 mt-3">
                        Shortlisted bands will be contacted via the email provided above.
                      </p>
                    </div>

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
