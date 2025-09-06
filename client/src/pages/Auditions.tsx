import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import auditionBanner from "../assets/banners/auditionBanner.jpeg";
import auditionleft from "../assets/banners/audition left.jpeg";
import auditionright from "../assets/banners/Auditionright.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Users, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import TermsDialog from "@/components/TermsDialog";
import { fireConfetti } from "@/components/ui/confetti";

const auditionSchema = z.object({
  bandName: z.string().min(1, "Band name is required").max(100),
  genre: z.string().min(1, "Please select a genre"),
  bandMembers: z.string().min(10, "Must be at least 10 characters").max(500),
  bandBio: z.string().min(50, "Must be at least 50 characters").max(2000),
  contactPerson: z.string().min(1, "Contact person is required"),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  cityState: z.string().min(1, "City & State is required"),
  socialLinks: z.string().optional(),
  auditionVideoUrl: z.string().url("Please enter a valid URL"),
  termsAccepted: z.boolean(),
});

type AuditionFormData = z.infer<typeof auditionSchema>;

const genres = [
  "Rock", "Pop", "Hip Hop", "Electronic/EDM", "Folk", "Traditional Naga",
  "Fusion", "Jazz", "Blues", "Country", "Metal", "Indie", "Alternative", "World Music",
];

const steps = ["Terms & Conditions", "Band Info", "Contact Info", "Media Submission"];

// Define which fields belong to each step (typed to form fields)
type StepField = keyof AuditionFormData;
const stepFields: Record<number, StepField[]> = {
  0: ["termsAccepted"], // Terms & Conditions must be accepted first
  1: ["bandName", "genre", "bandMembers", "bandBio"], // Band Info
  2: ["contactPerson", "contactEmail", "contactPhone", "cityState"], // Contact Info
  3: ["auditionVideoUrl"], // Media Submission (bandPhoto handled separately)
};

export default function Auditions() {
  const [step, setStep] = useState(0);
  const [bandPhotoFile, setBandPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

  const form = useForm<AuditionFormData>({
    resolver: zodResolver(auditionSchema),
    defaultValues: {
      bandName: "",
      genre: "",
      bandMembers: "",
      bandBio: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      cityState: "",
      socialLinks: "",
      auditionVideoUrl: "",
      termsAccepted: false,
    },
    mode: "onChange", // Change to validate on change for better UX
    reValidateMode: "onChange",
  });

  // Validate current step fields
  const validateCurrentStep = async () => {
    const currentStepFields = (stepFields[step] ?? []) as StepField[];
    
    // Trigger validation for current step fields
    const isValid = await form.trigger(currentStepFields);
    
    // Additional validation for step 3 (Media Submission)
    if (step === 3) {
      if (!bandPhotoFile) {
        setGlobalError("Please upload a band photo before proceeding.");
        setShowError(true);
        return false;
      }
    }
    
    if (!isValid) {
      setShowValidationErrors(true);
      setGlobalError("Please fill in all required fields correctly before proceeding.");
      setShowError(true);
      return false;
    }
    
    return true;
  };

  // Step navigation with validation
  const nextStep = async () => {
    const isStepValid = await validateCurrentStep();
    
    if (isStepValid) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
      setShowError(false);
      setGlobalError(null);
      // Don't reset validation errors to maintain field state
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    setShowError(false);
    setGlobalError(null);
    // Keep validation errors to maintain field state
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be under 5MB");
        return;
      }
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        alert("Please upload a JPG or PNG file");
        return;
      }
      setBandPhotoFile(file);
      // Clear photo-related errors when photo is uploaded
      if (globalError && globalError.includes("band photo")) {
        setGlobalError(null);
        setShowError(false);
      }
    }
  };

  // Submit handler for successful submission
  const onSubmit = async (data: AuditionFormData) => {
    setGlobalError(null);
    setShowError(false);
    setShowValidationErrors(true);

    if (!bandPhotoFile) {
      setGlobalError("Please upload a band photo before submitting.");
      setShowError(true);
      return;
    }

    if (!data.termsAccepted) {
      setGlobalError("Please accept the terms and conditions before submitting.");
      setShowError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      formData.append("bandPhoto", bandPhotoFile);

      const response = await fetch(`${API_BASE_URL}/auditions`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());
      fireConfetti();
      alert("🎉 Audition submitted successfully!");
      form.reset();
      setBandPhotoFile(null);
      setStep(0);
      setShowError(false);
      setGlobalError(null);
      setShowValidationErrors(false);
    } catch (error) {
      console.error(error);
      setGlobalError("Something went wrong, please try again.");
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Char counter helpers
  const bandBioLength = form.watch("bandBio")?.length || 0;
  const bandMembersLength = form.watch("bandMembers")?.length || 0;

  // Check if current step is valid for button state
  const isCurrentStepValid = () => {
    const currentStepFields = stepFields[step as keyof typeof stepFields] || [];
    const values = form.getValues();
    
    // Check if all required fields in current step have values
    const hasAllRequiredValues = currentStepFields.every(field => {
      const value = values[field as keyof AuditionFormData];
      return value && value.toString().trim() !== "";
    });
    
    // Additional checks for step 3 (Media Submission)
    if (step === 3) {
      return hasAllRequiredValues && bandPhotoFile;
    }
    
    return hasAllRequiredValues;
  };

  return (
    <div className="min-h-screen bg-[#ffdb58] text-[#1E293B]">
      {/* Hero */}
      <section className="relative mt-12 bg-[#201758] text-white overflow-hidden">
        <div className="grid grid-cols-12 items-stretch">
            {/* Left image fills height */}
            <div className="col-span-3 hidden md:block relative">
              <img
                src={auditionleft}
                alt="Audition Left"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Center content */}
            <div className="col-span-12 md:col-span-6 flex flex-col justify-center items-center text-center py-16 px-6">
              <h1 className="text-4xl md:text-5xl font-righteous mb-2 text-[#FFD700]">
                Pre-Ticket to Hornbill
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold">Band Auditions</h2>
              <p className="max-w-2xl mx-auto mt-4 text-[#F9FAFB]">
                Submit your band's audition for a chance to perform at the Hornbill
                Music Festival.
              </p>
            </div>

            {/* Right image fills height */}
            <div className="col-span-3 hidden md:block relative">
              <img
                src={auditionright}
                alt="Audition Right"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
        </div>
      </section>

      {/* Main */}
      <section className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-10 ">
        {/* Banner */}
        <div className="flex justify-center items-center">
          <img
            src={auditionBanner}
            alt="Audition Banner"
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-[#E5E7EB]">
          <h3 className="text-3xl font-righteous text-[#FFD700] mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#00B8D9]" />
            {steps[step]}
          </h3>

          {/* Progress indicator */}
          <div className="flex justify-between mb-8">
            {steps.map((stepName, index) => (
              <div
                key={stepName}
                className={`flex-1 text-center ${
                  index <= step ? 'text-[#FFD700]' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                    index <= step
                      ? 'bg-[#FFD700] text-[#0A2342]'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="text-xs font-medium">{stepName}</div>
              </div>
            ))}
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                onSubmit,
                (errors) => {
                  setShowValidationErrors(true);
                  setGlobalError("Please fix the highlighted errors before submitting.");
                  setShowError(true);
                }
              )}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {/* Terms & Conditions */}
                {step === 0 && (
                  <motion.div
                    key="terms-privacy"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="text-sm text-gray-700">
                      Please review and accept the Terms & Conditions before proceeding.
                    </div>
                    <FormField
                      name="termsAccepted"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start space-y-1">
                          <div className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  if (checked && globalError && globalError.includes("terms")) {
                                    setGlobalError(null);
                                    setShowError(false);
                                  }
                                }}
                                className="border-2 border-yellow-400"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              I confirm I have the rights to submit this
                              material and agree to the <TermsDialog />.
                            </FormLabel>
                          </div>
                          {!form.getValues("termsAccepted") && showValidationErrors && (
                            <FormMessage>Accepting the terms is required to proceed.</FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* Band Info */}
                {step === 1 && (
                  <motion.div
                    key="band-info"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <FormField
                      name="bandName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Band name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Trance Effect"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="genre"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary genre *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a genre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genres.map((g) => (
                                <SelectItem
                                  key={g}
                                  value={g}
                                  className="bg-blue-100 hover:blue-200 text-[#1E293B]"
                                >
                                  {g}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="bandMembers"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Band members *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List members and instruments (minimum 10 characters)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {bandMembersLength}/500 characters (minimum 10 required)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="bandBio"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Band Bio *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your band... (minimum 50 characters)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {bandBioLength}/2000 characters (minimum 50 required)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* Contact Info */}
                {step === 2 && (
                  <motion.div
                    key="contact-info"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <FormField
                      name="contactPerson"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person *</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="contactEmail"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="contactPhone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 XXXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="cityState"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City & State *</FormLabel>
                          <FormControl>
                            <Input placeholder="Kohima, Nagaland" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="socialLinks"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Links (optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste links" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* Media Submission */}
                {step === 3 && (
                  <motion.div
                    key="media-submission"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="font-medium flex items-center mb-2">
                        <Upload className="h-4 w-4 mr-1" /> Band photo *
                      </label>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        bandPhotoFile ? 'border-green-400 bg-green-50' : 'border-gray-300'
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="band-photo"
                        />
                        <label htmlFor="band-photo" className="cursor-pointer">
                          {bandPhotoFile
                            ? `✅ ${bandPhotoFile.name}`
                            : "Click to upload band photo"}
                        </label>
                      </div>
                    </div>
                    <FormField
                      name="auditionVideoUrl"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audition video link *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Paste YouTube or Vimeo URL"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex flex-col items-end mt-10 space-y-4">
                <div className="flex justify-between w-full">
                  {step > 0 ? (
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="bg-[#1E3A8A] hover:bg-[#0A2342] text-white flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  {step < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className={`flex items-center gap-2 font-semibold ${
                        isCurrentStepValid()
                          ? 'bg-[#FFD700] hover:bg-[#E6C200] text-[#0A2342]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!isCurrentStepValid()}
                    >
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className={`font-semibold ${
                        isCurrentStepValid() && !isSubmitting
                          ? 'bg-[#D96C30] hover:bg-[#A65224] text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!isCurrentStepValid() || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Audition"}
                    </Button>
                  )}
                </div>

                {/* Global Error Below Submit */}
                {showError && globalError && (
                  <div className="w-full text-center p-3 rounded-lg bg-red-100 text-red-700 font-medium">
                    {globalError}
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}