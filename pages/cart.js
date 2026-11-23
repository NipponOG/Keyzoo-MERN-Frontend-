import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/store/cartSlice";
import useCurrency from "@/hook/useCurrency";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500";

const CARD =
  "rounded-2xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-[#1a1a1a]";

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (n) => n.toFixed(2);

// Quantity limits per item
const MIN_QTY = 1;
const MAX_QTY = 10;

/* -------------------------------------------------------------------------- */
/*  Cart item                                                                  */
/* -------------------------------------------------------------------------- */

function CartItem({ item, symbol, dispatch }) {
  const unitPrice = toNumber(item.price);
  const lineTotal = unitPrice * item.quantity;
  const href = item.slug ? `/product/${item.slug}` : null;
  const tag = item.item_type_gift || item.item_type_game;

  const title = href ? (
    <Link href={href} className={`rounded hover:underline ${FOCUS}`}>
      {item.title}
    </Link>
  ) : (
    item.title
  );

  return (
    <li className={`${CARD} flex gap-4 p-3 sm:p-4`}>
      {/* cover */}
      <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-black/40 sm:w-24">
        <Image
          src={item.image || "/images/placeholder.png"}
          alt={item.title || "Product"}
          fill
          sizes="96px"
          className="object-center"
        />
      </div>

      {/* details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{title}</h3>

          <button
            type="button"
            onClick={() => dispatch(removeFromCart(item.id))}
            aria-label={`Remove ${item.title} from cart`}
            className={`-mr-1 -mt-1 shrink-0 cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-500 ${FOCUS}`}
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          {item.region && (
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {item.region}
            </span>
          )}
          {tag && (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-neutral-300">
              {tag}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {/* quantity */}
          <div>
            <div
              role="group"
              aria-label={`Quantity of ${item.title}`}
              className="inline-flex items-center rounded-xl border border-gray-200 dark:border-white/10"
            >
              <button
                type="button"
                onClick={() => dispatch(decreaseQuantity(item.id))}
                disabled={item.quantity <= MIN_QTY}
                aria-label="Decrease quantity"
                className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-l-xl text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-neutral-300 dark:hover:bg-white/10 ${FOCUS}`}
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>

              <span aria-live="polite" className="w-9 select-none text-center text-sm font-semibold">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => dispatch(increaseQuantity(item.id))}
                disabled={item.quantity >= MAX_QTY}
                aria-label="Increase quantity"
                className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-r-xl text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-neutral-300 dark:hover:bg-white/10 ${FOCUS}`}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {item.quantity >= MAX_QTY && (
              <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                Max {MAX_QTY} per order
              </p>
            )}
          </div>

          {/* price */}
          <div className="text-right">
            <p className="whitespace-nowrap text-lg font-bold">
              {symbol} {formatMoney(lineTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="whitespace-nowrap text-xs text-gray-500 dark:text-neutral-400">
                {symbol} {formatMoney(unitPrice)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function CartPage() {
  const { symbol } = useCurrency();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [confirmingClear, setConfirmingClear] = useState(false);

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const total = cartItems.reduce((acc, item) => acc + toNumber(item.price) * item.quantity, 0);

  /* ---- empty state ------------------------------------------------------- */

  if (cartItems.length === 0) {
    return (
      <>
        <Head>
          <title>Your cart | Keyzoo</title>
          <meta name="robots" content="noindex" />
        </Head>

        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/10">
            <ShoppingCart className="h-11 w-11 text-purple-500" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Your cart is empty</h1>
          <p className="mt-2 text-gray-500 dark:text-neutral-400">
            Go ahead and add some cool stuff to it.
          </p>
          <Link
            href="/"
            className={`mt-8 inline-flex items-center justify-center rounded-xl bg-[#6d3cff] px-6 py-3 font-semibold text-white transition hover:bg-[#5a2ee6] ${FOCUS}`}
          >
            Go to store
          </Link>
        </div>
      </>
    );
  }

  /* ---- cart ---------------------------------------------------------------- */

  return (
    <>
      <Head>
        <title>Your cart | Keyzoo</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">My cart</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>

          {/* clear cart (two steps, so a stray click can't wipe the cart) */}
          {confirmingClear ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-neutral-400">Remove all items?</span>
              <button
                type="button"
                onClick={() => {
                  dispatch(clearCart());
                  setConfirmingClear(false);
                }}
                className={`cursor-pointer rounded-lg bg-red-500/10 px-3 py-1.5 font-semibold text-red-600 transition hover:bg-red-500/20 dark:text-red-400 ${FOCUS}`}
              >
                Yes, clear
              </button>
              <button
                type="button"
                onClick={() => setConfirmingClear(false)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 font-medium text-gray-600 transition hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-white/10 ${FOCUS}`}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingClear(true)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-red-500/10 hover:text-red-500 dark:text-neutral-400 ${FOCUS}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear cart
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Items */}
          <ul className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} symbol={symbol} dispatch={dispatch} />
            ))}
          </ul>

          {/* Summary */}
          <aside className={`${CARD} w-full p-6 lg:sticky lg:top-24 lg:w-96`}>
            <h2 className="text-lg font-semibold">Order summary</h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 dark:text-neutral-400">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </dt>
                <dd className="font-medium">
                  {symbol} {formatMoney(total)}
                </dd>
              </div>
            </dl>

            <div className="my-5 h-px bg-gray-200 dark:bg-neutral-700" />

            <div className="flex items-end justify-between">
              <span className="font-semibold">Estimated total</span>
              <span className="text-2xl font-extrabold">
                {symbol} {formatMoney(total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
              The final price is confirmed at checkout.
            </p>

            <Link
              href="/checkout"
              className={`mt-6 flex w-full items-center justify-center rounded-xl bg-[#6d3cff] px-4 py-3 font-semibold text-white transition hover:bg-[#5a2ee6] ${FOCUS}`}
            >
              Proceed to checkout
            </Link>

            <Link
              href="/"
              className={`mt-3 block rounded text-center text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white ${FOCUS}`}
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </main>
    </>
  );
}