import { useRouter } from "next/router";

export default function SetupHeader() {

    const router = useRouter();

    return (

        <div className="flex items-start justify-between">

            {/* Left */}

            <div>

                <button
                    onClick={() => router.back()}
                    className="mb-10 inline-flex items-center gap-2 text-indigo-400 transition hover:text-indigo-300"
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />

                    </svg>

                    Back to Security

                </button>

                <h1 className="text-2xl font-bold tracking-tight text-white">

                    Enable Two-Factor Authentication

                </h1>

                <p className="mt-2.5 max-w-xl text-lg text-gray-400">

                    Add an extra layer of security to your Keyzoo
                    administrator account by enabling
                    two-factor authentication.

                </p>

            </div>

            {/* Step Badge */}

            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-6 py-3">

                <div className="text-lg font-semibold text-indigo-300">

                    Step 2 of 3

                </div>

            </div>

        </div>

    );

}