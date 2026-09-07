import Link from "next/link";
import { FaHome } from "react-icons/fa";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity } from "@/store/cartSlice";
import { CiTrash } from "react-icons/ci";
import { LuPlus } from "react-icons/lu";
import { LuMinus } from "react-icons/lu";
import { MdClear } from "react-icons/md";
import useCurrency from "@/hook/useCurrency";
import { IoInformationCircleOutline } from "react-icons/io5";

export default function CartPage() {

  const { symbol } = useCurrency();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Example: Your real cart logic should check if cartItems.length === 0
  // const cartItems = [];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center text-white px-4">
        <Image
          src="https://static.driffle.com/media-gallery/production/860122fd-2d7e-4b18-92fe-34be7898f5e0_empty-cartpng"
          alt="Empty Cart"
          width={200}
          height={200}
          className="mb-8"
        />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-400 mb-6">
          Go ahead and add some cool stuff to it.
        </p>
        <Link href="/">
          <button className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-md text-white">
            <FaHome className="h-5 w-5" />
            Go to store
          </button>
        </Link>
      </div>
    );
  }

  // If cart has items: Render cart items instead
  return (

    <div className="bg-[#0d0d0d] text-white min-h-screen">
      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-8 flex flex-col lg:flex-row gap-10">
        {/* Left: Cart Items */}
        <section className="flex-1 max-w-7xl">
          <h2 className="font-semibold text-white text-lg mb-6">My Cart</h2>
          <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-4 text-xs text-gray-300">
            <div className="flex justify-end">
              <button
                onClick={() => dispatch(clearCart())}
                className="text-sm text-red-500 hover:underline cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span><CiTrash className="text-2xl" /> </span>
                  {/* <span>Clear Cart</span> */}
                </div>
              </button>
            </div>
            {cartItems.map((item) => (
              <div className="flex bg-[#222222] rounded-lg p-3 gap-4 relative items-start">
              {/* <div className="flex bg-[#222222] rounded-lg p-3 sm:p-4 gap-3 sm:gap-4 relative items-start flex-col sm:flex-row"> */}
                <Image
                  src={item.image}
                  alt={item.title}
                  height={90}
                  width={120}
                  className="w-[100px] sm:w-[120px] md:w-[140px] h-auto rounded-sm object-cover"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="flex-1 min-w-0 text-white font-extrabold text-[1rem] leading-tight line-clamp-2 mt-5">
                        {item.title}
                      </h3>
                      {item.item_type_gift && (
                        <span className="bg-[#ff7f6a] px-2.5 py-1 rounded font-medium text-white mr-5 mt-5">
                          {item.item_type_gift}
                        </span>
                      )}
                      {item.item_type_game && (
                        <span className="bg-[#5539cc] px-2.5 py-1 rounded font-medium text-white mr-5 mt-5">
                          {item.item_type_game}
                        </span>
                      )}
                    </div>

                    <span className="text-[#0099ff] text-sm font-extrabold uppercase mt-2.5 inline-block">
                      {item.region}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="cursor-pointer transition-transform duration-200 hover:scale-110">
                      <CiTrash className="text-2xl text-white" />
                    </button>
                    <button
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                      className="cursor-pointer bg-[#1a1a1a] text-white outline-none rounded w-[28px] h-[28px] flex items-center justify-center transition-colors duration-200 hover:bg-[#2c2c2c]"
                    >
                      <LuMinus className="text-white" />
                    </button>
                    <span className="bg-[#1a1a1a] outline-none text-white rounded w-[28px] h-[28px] sm:w-[24px] sm:h-[24px] flex items-center justify-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(increaseQuantity(item.id))}
                      className="cursor-pointer bg-[#1a1a1a] text-white outline-none rounded w-[28px] h-[28px] flex items-center justify-center transition-colors duration-200 hover:bg-[#2c2c2c]"
                    >
                      <LuPlus className="text-white" />
                    </button>
                  </div>

                  {/* 💰 Price (visible on large screens only) */}
                  <div className="hidden md:block text-white font-semibold text-base mt-5">
                    {symbol} {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* 💰 Price (visible on small screens only, floating right) */}
                <div className="block md:hidden absolute bottom-9 right-3 text-white font-semibold text-sm whitespace-nowrap">
                  {symbol} {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>

            ))}
          </div>
        </section>

        {/* Right: Summary */}
        <section className="w-full lg:max-w-sm flex flex-col gap-6">
          <h2 className="font-semibold text-white text-lg">Summary</h2>
          <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-3 text-xs text-gray-300">
            <div className="flex items-center gap-1 text-[#6a6aff] font-semibold uppercase text-[9px]">
              <span>plus</span>
              <span className="bg-[#6a6aff] text-white rounded px-1 text-[11px] font-bold tracking-widest">MEMBERSHIP</span>
              <span>Save extra ₹107.71</span>
            </div>
            <div>
              <p className="text-gray-300 text-xs font-semibold mb-1">Your cart total</p>
              <p className="text-white font-extrabold text-2xl mb-1">~ {symbol}{total}</p>
              <p className="text-gray-500 text-[12px] flex items-center gap-1">PRICE NOT FINAL <IoInformationCircleOutline className="text-lg text-white" /></p>
            </div>
            <Link href="/checkout">
              <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] rounded-md py-3 text-white font-semibold flex items-center justify-center gap-2">
                Proceed to checkout
              </button>
            </Link>
          </div>
          <div className="border border-[#6a6aff] rounded-lg p-4 space-y-3 text-xs text-gray-300 relative">
            <div className="flex items-center gap-1 font-semibold text-white">
              Save extra <span className="text-[#6a6aff]">₹107.71</span> , Join Driffle <span className="text-[#6a6aff]">plus</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><i className="fas fa-check-circle text-[#6a6aff] mt-[3px]"></i> Up to 10% OFF</li>
              <li className="flex items-center gap-2"><i className="fas fa-check-circle text-[#6a6aff]"></i> Exclusive events<label className="ml-auto relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" /><div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#6a6aff]"></div><div className="absolute left-[4px] top-[4px] bg-white w-5 h-5 rounded-full peer-checked:translate-x-5 transition-transform"></div></label></li>
              <li className="flex items-start gap-2"><i className="fas fa-check-circle text-[#6a6aff] mt-[3px]"></i> Priority pre-order</li>
              <li className="flex items-start gap-2"><i className="fas fa-check-circle text-[#6a6aff] mt-[3px]"></i> Priority support</li>
            </ul>
            <div className="absolute top-0 right-0 text-[100px] font-extrabold text-[#6a6aff] opacity-10 select-none pointer-events-none" style={{ lineHeight: 0.7 }}>+</div>
          </div>
          <p className="text-gray-400 text-xs text-center">See our <span className="font-semibold">3,880</span> reviews on <span className="text-[#00c853] font-semibold flex items-center justify-center gap-1 inline-block"><i className="fas fa-star"></i> Trustpilot</span></p>
        </section>
      </main>
    </div>
  );
}
