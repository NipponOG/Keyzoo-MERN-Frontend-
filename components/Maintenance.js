// import Image from "next/image";
import { motion } from "framer-motion";

export default function Maintenance() {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100 p-6 text-center">
            {/* <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Image
                    src="https://steadfast-gem-fdb13b7584.media.strapiapp.com/maintenance_f2c7a7407e.webp"
                    alt="Maintenance"
                    width={400}
                    height={400}
                    className="max-w-full h-auto"
                />
            </motion.div> */}

            <motion.svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-6"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                <circle cx="12" cy="12" r="3" />
            </motion.svg>

            <motion.h1
                className="text-3xl md:text-5xl font-bold text-gray-800 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                We'll Be Back Soon!
            </motion.h1>

            <motion.p
                className="text-gray-600 mt-4 text-lg md:text-xl max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
            >
                We're currently performing scheduled maintenance. We apologize for any inconvenience and appreciate your patience.
            </motion.p>
        </div>
    );
}
