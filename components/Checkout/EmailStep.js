// components/Checkout/EmailStep.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function EmailStep() {

  // This component is a placeholder for the Email Step in the checkout process.
  // It currently displays a static email address and an option to edit it.
  // You can replace this with your actual email input logic later.

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      router.push("/sign-in");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/users/me?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg space-y-4">
      <h3 className="text-sm text-gray-400">Step 1</h3>
      <h2 className="text-lg font-bold">Add an email address</h2>
      <div className="flex items-center justify-between bg-[#222] px-4 py-3 rounded cursor-not-allowed">
        {/* <span>nipponbiswas9090@gmail.com</span> */}
        <span>
          <input
            type="text"
            value={user?.email || "Add an email address"}
            readOnly
            className="outline-none bg-transparent text-white cursor-not-allowed"
          />
        </span>
        <button className="text-[#6a6aff] text-sm cursor-pointer">Edit email</button>
      </div>
      <p className="text-xs text-gray-500">Your order will be delivered to this email address.</p>
    </div>
  );
}
