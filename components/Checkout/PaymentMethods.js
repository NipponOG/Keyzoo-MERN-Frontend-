import Image from "next/image";

export default function PaymentMethods({
    selectedPayment,
    onSelectPayment,
}) {
    const paymentMethods = [
        {
            name: "Debit / Credit Card",
            logo: "/payments_payicon/visa.svg",
        },
        {
            name: "AMEX",
            logo: "/payments_payicon/amex.svg",
        },
        {
            name: "Cashfree",
            logo: "/payments_payicon/Cashfree_Payments_idzBxeINHs_0.svg",
        },
        {
            name: "Razorpay",
            logo: "/payments_payicon/Razorpay_idJPs0Yq7Y_1.svg",
        },
    ];

    return (
        <div className="space-y-4">
            {paymentMethods.map((method) => (
                <label
                    key={method.name}
                    className={`flex items-center justify-between bg-[#1a1a1a] px-4 py-3 rounded-lg cursor-pointer transition ${selectedPayment === method.name
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                    onClick={() =>
                        onSelectPayment(method.name)
                    }
                >
                    <div className="flex items-center gap-4">
                        <input
                            type="radio"
                            name="paymentMethod"
                            checked={
                                selectedPayment ===
                                method.name
                            }
                            onChange={() =>
                                onSelectPayment(
                                    method.name
                                )
                            }
                            className="form-radio accent-blue-500 w-5 h-5"
                        />

                        <div className="flex items-center justify-center w-[88px] h-[42px] sm:w-[100px] sm:h-[44px] bg-white rounded-md overflow-hidden">
                            <Image
                                src={method.logo}
                                alt={method.name}
                                width={100}
                                height={44}
                                className="w-full h-full object-contain p-1"
                            />
                        </div>
                    </div>

                    <span className="text-[0.875rem] text-gray-300">
                        {method.name}
                    </span>
                </label>
            ))}
        </div>
    );
}