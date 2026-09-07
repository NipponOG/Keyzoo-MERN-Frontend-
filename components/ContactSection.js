// components/ContactSection.js
import React from "react";
import ContactCard from "./ContactCard";

import BusinessIcon from "@/public/contact/BusinessIcon";
import LegalIcon from "@/public/contact/LegalIcon";
import TalentIcon from "@/public/contact/TalentIcon";

export default function ContactSection() {
  return (
    <section className="bg-black text-white flex justify-center items-center min-h-screen py-16 px-4 sm:px-6 md:px-8 lg:px-12">
      {/* centered spotlight */}
      <div className="relative w-full">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 sm:-top-16 w-[400px] sm:w-[500px] md:w-[620px] h-[400px] sm:h-[500px] md:h-[620px] rounded-full bg-purple-900/50 blur-[120px] sm:blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Contact Us
            </h1>
            <p className="text-gray-400 mt-3 text-sm sm:text-base md:text-lg">
              Need any help? Or got a suggestion? Drop us an email!
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-2">
            <ContactCard
              Icon={BusinessIcon}
              title="Business Development"
              email={process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "N/A"}
            >
              For all questions or information regarding our business, kindly
              reach out to us at the following contact information:
            </ContactCard>

            <ContactCard
              Icon={LegalIcon}
              title="Legal Department"
              email={process.env.NEXT_PUBLIC_LEGAL_EMAIL || "N/A"}
            >
              For clarification or assistance with any legal matters, our team
              of experts is available to assist you. Please contact them at:
            </ContactCard>

            <ContactCard
              Icon={TalentIcon}
              title="Talent Team"
              email={process.env.NEXT_PUBLIC_TALENT_EMAIL || "N/A"}
            >
              Are you seeking a new employment opportunity? Our Talent team is
              available to assist you. Please contact them at:
            </ContactCard>
          </div>

          {/* Purchase Issue Section */}
          <div className="mt-16 sm:mt-20 text-center px-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Issues With Purchase?
            </h2>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              The best way to resolve it quickly is to create a ticket.
            </p>
            <button onClick={()=> window.location.href = `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="px-6 py-2 text-sm sm:text-base rounded-full border border-gray-700 bg-[#4444444d] text-white cursor-pointer hover:bg-transparent hover:border-white transition">
              Mail us at
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
