// import { Briefcase, Scale, Users } from "lucide-react";

// export default function Contact() {
//     return (
//         <div className="bg-black text-white min-h-screen">
//             {/* Gradient Background */}
//             <div className="relative bg-gradient-to-b from-[#0c0c0c] to-black py-20">
//                 <div className="absolute inset-0 flex justify-center">
//                     <div className="w-[600px] h-[600px] bg-purple-900/30 blur-[160px] rounded-full"></div>
//                 </div>

//                 <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
//                     {/* Heading */}
//                     <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
//                     <p className="text-gray-300 mb-12">
//                         Need any help? Or got a suggestion? Drop us an email!
//                     </p>

//                     {/* Contact Cards */}
//                     <div className="grid md:grid-cols-3 gap-6">
//                         <div className="bg-[#121212] p-6 rounded-xl shadow-lg text-left">
//                             <Briefcase className="w-8 h-8 mb-4 text-gray-200" />
//                             <h3 className="text-lg font-semibold mb-2">Business Development</h3>
//                             <p className="text-gray-400 text-sm mb-2">
//                                 For all questions or information regarding our business, kindly
//                                 reach out to us at:
//                             </p>
//                             <a
//                                 href="mailto:business@driffle.com"
//                                 className="text-blue-400 hover:underline"
//                             >
//                                 business@driffle.com
//                             </a>
//                         </div>

//                         <div className="bg-[#121212] p-6 rounded-xl shadow-lg text-left">
//                             <Scale className="w-8 h-8 mb-4 text-gray-200" />
//                             <h3 className="text-lg font-semibold mb-2">Legal Department</h3>
//                             <p className="text-gray-400 text-sm mb-2">
//                                 For clarification or assistance with any legal matters, our team
//                                 of experts is available to assist you. Please contact them at:
//                             </p>
//                             <a
//                                 href="mailto:legal@driffle.com"
//                                 className="text-blue-400 hover:underline"
//                             >
//                                 legal@driffle.com
//                             </a>
//                         </div>

//                         <div className="bg-[#121212] p-6 rounded-xl shadow-lg text-left">
//                             <Users className="w-8 h-8 mb-4 text-gray-200" />
//                             <h3 className="text-lg font-semibold mb-2">Talent Team</h3>
//                             <p className="text-gray-400 text-sm mb-2">
//                                 Are you seeking a new employment opportunity? Our Talent team is
//                                 available to assist you. Please contact them at:
//                             </p>
//                             <a
//                                 href="mailto:careers@driffle.com"
//                                 className="text-blue-400 hover:underline"
//                             >
//                                 careers@driffle.com
//                             </a>
//                         </div>
//                     </div>

//                     {/* Ticket Section */}
//                     <div className="mt-20">
//                         <h2 className="text-2xl font-semibold mb-2">Issues With Purchase?</h2>
//                         <p className="text-gray-400 mb-6">
//                             The best way to resolve it quickly is to create a ticket.
//                         </p>
//                         <button className="px-6 py-3 bg-transparent border border-gray-400 rounded-full hover:bg-gray-800 transition">
//                             Create a Ticket
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }



// components/ContactCard.js
import React from "react";
import Link from "next/link";

export default function ContactCard({ Icon, title, children, email }) {
  return (
    <div
      className="relative rounded-2xl border border-gray-800 bg-[#0f0f10] p-5 sm:p-6 md:p-8 transition-all duration-300 hover:scale-[1.02]"
      style={{
        boxShadow:
          "0 12px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
        {/* icon box */}
        <div
          className="mx-auto sm:mx-0 w-14 h-14 sm:w-12 sm:h-12 flex items-center justify-center rounded-md shrink-0"
          style={{
            background: "#141414",
            border: "1px solid rgba(255,255,255,0.03)",
            boxShadow: "inset 0 -6px 12px rgba(0,0,0,0.5)",
          }}
        >
          {Icon && <Icon className="w-6 h-6 sm:w-5 sm:h-5 text-gray-200" />}
        </div>

        {/* text area */}
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base sm:text-sm leading-snug">
            {title}
          </h3>

          <p className="text-gray-300 text-sm sm:text-xs leading-relaxed mt-2 mb-3 sm:mb-4 max-w-full sm:max-w-[48ch]">
            {children}
          </p>

          {email && (
            <Link
              href={`mailto:${email}`}
              className="text-blue-400 font-medium text-sm sm:text-md break-all"
            >
              {email}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

