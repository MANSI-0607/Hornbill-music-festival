// src/components/HornbillFaq.tsx
import React, { useState } from "react";
import { ChevronDown, Calendar, ShoppingCart, Info, Compass } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import faqbanner from "../assets/banners/faqbanner.png";
import wooden from "../assets/wooden.png";

const faqData = [
  {
    title: "Event Information",
    icon: Calendar,
    items: [
      {
        question: "When & where is the event taking place?",
        answer:
          "The Hornbill Music Festival 2025 will be held from 1st – 10th December at Naga Heritage Village, Kisama, Nagaland.",
      },
      {
        question: "What are the festival timings?",
        answer:
          "The festival will run daily with performances, cultural showcases, and other activities. A detailed schedule will be released closer to the event dates.",
      },
      {
        question: "Are pets allowed at the festival?",
        answer:
          "As much as we love pets, they will not be allowed inside the festival venue.",
      },
    ],
  },
  {
    title: "Ticketing",
    icon: Info,
    items: [
      {
        question: "What ticket categories are available?",
        answer:
          "Tickets will be available in General Admission, VIP, and Premium categories. Each offers different access levels and perks.",
      },
      {
        question: "When does ticket sales go live?",
        answer:
          "Pre-ticket sales and auditions are already live! General ticket sales will be announced soon.",
      },
      {
        question: "Can I transfer or cancel my ticket?",
        answer:
          "Tickets are non-transferable and non-refundable. Please purchase carefully.",
      },
    ],
  },
  {
    title: "How to Get to the Festival",
    icon:  Info,
    items: [
      {
        question: "Where is the venue located?",
        answer:
          "The festival takes place at Naga Heritage Village, Kisama, Nagaland. A Google Maps location pin will be shared on our website and socials.",
      },
      {
        question: "Is there parking at the venue?",
        answer:
          "Limited parking is available. We recommend using eco-friendly and public transport whenever possible.",
      },
    ],
  },
  {
    title: "General Info",
    icon: Info,
    items: [
      {
        question: "Is this a seated show?",
        answer:
          "No, the Hornbill Music Festival is a standing and walk-in cultural/music experience. Limited seating may be available in VIP zones.",
      },
      {
        question: "Will food & beverages be available?",
        answer:
          "Yes! A wide variety of local and multi-cuisine options will be available at the festival grounds. Outside food or drinks are not permitted.",
      },
      {
        question: "Is smoking allowed?",
        answer:
          "Smoking will be permitted in designated areas only. Vaping and other electronic smoking devices are not allowed.",
      },
    ],
  },
  {
    title: "Accessibility",
    icon: Info,
    items: [
      {
        question: "Is the festival accessibility-friendly?",
        answer:
          "Yes. Accessible entry points, viewing areas, and facilities will be available to ensure a comfortable experience for all attendees.",
      },
      {
        question: "Is the venue wheelchair friendly?",
        answer:
          "Yes, the venue is wheelchair friendly. However, attendees must bring their own mobility equipment.",
      },
    ],
  },
  {
    title: "Health, Safety & Security",
    icon: Info,
    items: [
      {
        question: "What medical assistance is available?",
        answer:
          "First aid services and medical support will be available throughout the festival days. Please carry essential personal medication with you.",
      },
      {
        question: "What safety measures are in place?",
        answer:
          "The festival works with local authorities and security teams to ensure safety. Unruly behavior or illegal substances will not be tolerated.",
      },
    ],
  },
  {
    title: "Allowed & Prohibited Items",
    icon: Info,
    items: [
      {
        question: "What can I bring inside?",
        answer:
          "Small bags (under A4 size), empty reusable water bottles (up to 500ml), and personal essentials are allowed.",
      },
      {
        question: "What is prohibited?",
        answer:
          "Outside food, large bags, alcohol, illegal substances, professional cameras, and sharp objects are strictly prohibited.",
      },
    ],
  },
  {
    title: "Lineup & Schedule",
    icon: Calendar,
    items: [
      {
        question: "When will the lineup be announced?",
        answer:
          "The official artist lineup and day-wise schedule will be announced closer to the festival. Stay tuned to our socials!",
      },
      {
        question: "Are there after-parties or pre-events?",
        answer:
          "Yes – follow our social media handles for announcements about pre-events and aftershows.",
      },
    ],
  },
];

const HornbillFaq = () => {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (sectionIndex: number) => {
    setOpenSections((prev) =>
      prev.includes(sectionIndex)
        ? prev.filter((i) => i !== sectionIndex)
        : [...prev, sectionIndex]
    );
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#c3af79]">
      {/* Banner image */}
      {/* <img
        src={faqbanner}
        alt="FAQ Banner"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        style={{ objectPosition: "center" }}
      /> */}

      {/* Content */}
      <div className="relative z-20 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ y: -40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
              <h1 className="text-5xl font-righteous mb-2 text-[#FFD700]">
              Frequently Asked Questions
            </h1>
           
          </motion.div>

          <div className="space-y-6">
            {faqData.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                className="rounded-xl overflow-hidden bg-white shadow-md "
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
               
                viewport={{ once: true }}
              >
                {/* Section Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  style={{
                    backgroundImage: `url(${wooden})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => toggleSection(sectionIndex)}
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="w-5 h-5 text-white" />
                    <h3 className="text-base md:text-lg font-bold text-white drop-shadow-sm">
                      {section.title}
                    </h3>
                  </div>
                  <motion.div
                    animate={{
                      rotate: openSections.includes(sectionIndex) ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="p-1"
                  >
                    <ChevronDown className="w-5 h-5 text-white drop-shadow-sm" />
                  </motion.div>
                </div>

                {/* Section Content */}
                <AnimatePresence>
                  {openSections.includes(sectionIndex) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="bg-gradient-to-br from-gray-50 to-white"
                    >
                      <div className="p-4 space-y-4">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex}>
                            <h4 className="text-sm font-semibold text-gray-800 mb-1">
                              {item.question}
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HornbillFaq;
