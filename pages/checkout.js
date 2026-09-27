import EmailStep from "@/components/Checkout/EmailStep";
import PaymentMethods from "@/components/Checkout/PaymentMethods";
import OrderSummary from "@/components/Checkout/OrderSummary";
import { useSelector, useDispatch } from "react-redux";
import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
} from "@/store/cartSlice";
import { useState } from "react";

export default function Checkout() {
    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state) => state.cart.cartItems
    );

    const [
        selectedPayment,
        setSelectedPayment,
    ] = useState("Debit / Credit Card");

    return (
        <main className="min-h-screen text-white px-3 sm:px-6 py-10">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-6">
                    <EmailStep />

                    <PaymentMethods
                        selectedPayment={
                            selectedPayment
                        }
                        onSelectPayment={
                            setSelectedPayment
                        }
                    />
                </div>

                <OrderSummary
                    cartItems={cartItems}
                    selectedPayment={
                        selectedPayment
                    }
                    onRemove={(id) =>
                        dispatch(removeFromCart(id))
                    }
                    onIncrease={(id) =>
                        dispatch(increaseQuantity(id))
                    }
                    onDecrease={(id) =>
                        dispatch(decreaseQuantity(id))
                    }
                />
            </div>
        </main>
    );
}