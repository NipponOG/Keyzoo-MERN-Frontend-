//PaymentMethods.js

"use client";

// import { useState } from "react";
import Image from "next/image";

export default function PaymentMethods({ selectedPayment, onSelectPayment }) {

  // const [selectedMethod, setSelectedMethod] = useState('UPI');

  const paymentMethods = [
    {
      name: "UPI",
      logo: "/payments_payicon/upi.svg", // replace with your actual image path
    },
    {
      name: "Debit / Credit Card",
      logo: "/payments_payicon/visa.svg", // replace with your actual image path
    },
    {
      name: "AMEX",
      logo: "/payments_payicon/amex.svg", // replace with your actual image path
    },
    {
      name: "Google Pay",
      logo: "/payments_payicon/gpay.svg", // optional
    },
    {
      name: "Crypto",
      logo: "/payments_payicon/crypto.svg", // optional
    },
  ];

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <label
          key={method.name}
          className={`flex items-center justify-between bg-[#1a1a1a] px-4 py-3 rounded-lg cursor-pointer transition ${
            selectedPayment === method.name ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => onSelectPayment(method.name)} // notify parent
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="paymentMethod"
              checked={selectedPayment === method.name}
              onChange={() => onSelectPayment(method.name)}
              className="form-radio accent-blue-500 w-5 h-5"
            />
            <Image
              src={method.logo}
              alt={method.name}
              width={80}
              // fill
              height={50}
              className="object-contain bg-white rounded w-[60px] h-[30px] sm:w-[80px] sm:h-[40px]"

            />
          </div>
          <span className="text-[0.875rem] text-gray-300">{method.name}</span>
        </label>
      ))}
    </div>
  );
}
