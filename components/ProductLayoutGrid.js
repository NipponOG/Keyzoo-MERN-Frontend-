import React from "react";

const ProductLayoutGrid = ({ children }) => {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT - IMAGES */}
        <div className="lg:col-span-7">
          {/* PLACEHOLDER - Replace with Cover + Thumbnails */}
          <div className="w-full bg-gray-100 aspect-square rounded-2xl mb-4" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        {/* RIGHT - DETAILS */}
        <div className="lg:col-span-5">
          {/* PLACEHOLDER - Replace with title, price, platform, etc. */}
          <h1 className="text-3xl font-semibold mb-2">Game Title</h1>
          <p className="text-sm text-gray-500 mb-4">
            Action | Steam | PC | Global
          </p>
          <div className="bg-gray-100 p-4 rounded-xl mb-6">
            <p className="text-xl font-bold mb-1">₹999</p>
            <p className="text-sm text-gray-500 line-through">₹1,499</p>
          </div>
          <button className="w-full bg-black text-white py-3 rounded-xl text-lg font-medium hover:opacity-80">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductLayoutGrid;
