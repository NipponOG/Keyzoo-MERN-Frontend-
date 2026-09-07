// pages/404.js

import Link from "next/link";
import Image from "next/image";

export default function Custom404() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-md">
                <Image
                    src="/404.png"
                    alt="404 Error"
                    width={500}
                    height={500}
                    className="w-full h-auto object-contain"
                />
                {/* <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-2">
                    404 - Page Not Found
                </h1>
                <p className="text-base md:text-lg mb-6">
                    Oops! The page you are looking for doesn’t exist or has been moved.
                </p>
                <Link href="/">
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm md:text-base transition-all duration-200">
                        Go Back Home
                    </button>
                </Link> */}
            </div>
        </div>
    );
}
