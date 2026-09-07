// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import confetti from "canvas-confetti";

// export default function ComingSoon() {
//     const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

//     useEffect(() => {
//         // Full-screen confetti shower sequence
//         const duration = 2 * 1000; // 2 seconds
//         const animationEnd = Date.now() + duration;
//         const defaults = {
//             startVelocity: 30,
//             spread: 360,
//             ticks: 500,
//             zIndex: 999,
//             gravity: 0.8,
//             scalar: 2,
//             shapes: ["square"],
//             // colors: ["#ffffff", "#eeeeee", "#cccccc","#4e21be", "#3a66ea"],
//             colors: ["#ff6467", "#ffffff", '#f7858a', '#e793e4', '#fd6cf9b0'],
//         };

//         function randomInRange(min, max) {
//             return Math.random() * (max - min) + min;
//         }

//         const interval = setInterval(() => {
//             const timeLeft = animationEnd - Date.now();

//             if (timeLeft <= 0) {
//                 return clearInterval(interval);
//             }

//             confetti({
//                 ...defaults,
//                 particleCount: 10,
//                 origin: {
//                     x: randomInRange(0.1, 0.9),
//                     y: Math.random() * 0.2,
//                 },
//             });
//         }, 50); // continuous bursts every 100ms

//         // Countdown timer
//         const targetDate = new Date("2025-09-21T00:00:00");

//         const countdown = setInterval(() => {
//             const now = new Date();
//             const diff = targetDate - now;

//             if (diff <= 0) {
//                 clearInterval(countdown);
//                 setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//                 return;
//             }

//             const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//             const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//             const minutes = Math.floor((diff / 1000 / 60) % 60);
//             const seconds = Math.floor((diff / 1000) % 60);

//             setTimeLeft({ days, hours, minutes, seconds });
//         }, 1000);

//         return () => {
//             clearInterval(interval);
//             clearInterval(countdown);
//         };
//     }, []);

//     return (
//         <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
//             <motion.h1
//                 className="text-4xl md:text-6xl font-extrabold mb-4"
//                 initial={{ opacity: 0, y: -40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//             >
//                 Something Awesome is Coming Soon
//             </motion.h1>

//             <motion.p
//                 className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3, duration: 0.8 }}
//             >
//                 We’re working hard to launch the best experience for you. Stay tuned!
//             </motion.p>

//             <motion.div
//                 className="flex gap-4 text-2xl font-semibold mb-8"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5, duration: 0.8 }}
//             >
//                 <TimeBox label="Days" value={timeLeft.days} />:
//                 <TimeBox label="Hours" value={timeLeft.hours} />:
//                 <TimeBox label="Minutes" value={timeLeft.minutes} />:
//                 <TimeBox label="Seconds" value={timeLeft.seconds} />
//             </motion.div>

//             <motion.button
//                 className="bg-white text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.6, duration: 0.4 }}
//             >
//                 Notify Me
//             </motion.button>

//             <motion.div
//                 className="mt-10 text-sm text-gray-400"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1, duration: 0.6 }}
//             >
//                 {/* &copy; {new Date().getFullYear()} YourBrand. All rights reserved. */}
//             </motion.div>
//         </div>
//     );
// }

// function TimeBox({ label, value }) {
//     return (
//         <div className="flex flex-col items-center">
//             <span className="text-4xl md:text-5xl font-bold">{String(value).padStart(2, "0")}</span>
//             <span className="text-sm text-gray-400 uppercase">{label}</span>
//         </div>
//     );
// }







import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FaRegClock } from "react-icons/fa";

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    // 🎉 Background confetti on page load
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 500,
      zIndex: 999,
      gravity: 0.8,
      scalar: 2,
      shapes: ["square"],
      colors: ["#ff6467", "#ffffff", "#f7858a", "#e793e4", "#fd6cf9b0"],
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      confetti({
        ...defaults,
        particleCount: 10,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() * 0.2 },
      });
    }, 50);

    // ⏳ Countdown timer
    const targetDate = new Date("2025-09-21T00:00:00");
    const countdown = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(countdown);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, []);

  const handleNotifyClick = () => {
    setNotified(true);

    // 🎉 Mini confetti pop on button click
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#38bdf8", "#22c55e", "#facc15", "#f43f5e"], // nice bright colors
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Something Awesome is Coming Soon
      </motion.h1>

      <motion.p
        className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        We’re working hard to launch the best experience for you. Stay tuned!
      </motion.p>

      {/* Countdown */}
      <motion.div
        className="flex gap-4 text-2xl font-semibold mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <TimeBox label="Days" value={timeLeft.days} />:
        <TimeBox label="Hours" value={timeLeft.hours} />:
        <TimeBox label="Minutes" value={timeLeft.minutes} />:
        <TimeBox label="Seconds" value={timeLeft.seconds} />
      </motion.div>

      {/* Notify Me Section */}
      {!notified ? (
        <motion.button
          className="bg-white text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          onClick={handleNotifyClick}
        >
          Notify Me
        </motion.button>
      ) : (
        <motion.div
          className="flex items-center bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            We will notify you!
          </motion.span>
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="ml-3"
          >
            <FaRegClock className="text-xl" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function TimeBox({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-bold">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-sm text-gray-400 uppercase">{label}</span>
    </div>
  );
}
