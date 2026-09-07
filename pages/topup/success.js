import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TopupSuccess() {

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    useEffect(() => {

        if (!router.isReady) return;

        const { order_id } = router.query;

        if (!order_id) return;

        async function verify() {

            try {

                const res = await fetch(
                    `/api/payment/cashfree/verify?orderId=${order_id}`
                );

                const data = await res.json();

                setStatus(data);

                if (data.order_status === "PAID") {

                    await fetch(
                        "/api/reloadly/process-topup",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                orderId: order_id,
                            }),
                        }
                    );
                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);
            }
        }

        verify();

    }, [router.isReady]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Verifying payment...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">

            {status?.order_status === "PAID" ? (

                <h1 className="text-green-500 text-3xl">
                    Recharge Successful
                </h1>

            ) : (

                <h1 className="text-red-500 text-3xl">
                    Payment Failed
                </h1>

            )}

        </div>
    );
}