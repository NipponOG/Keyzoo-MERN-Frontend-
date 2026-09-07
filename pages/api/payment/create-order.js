// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export default async function handler(req, res) {

//     if (req.method !== "POST") {
//         return res.status(405).end();
//     }

//     try {

//         const { amount } = req.body;

//         const order = await razorpay.orders.create({
//             amount: amount * 100,
//             currency: "INR",
//             receipt: `topup_${Date.now()}`,
//         });

//         res.status(200).json(order);

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             error: "Failed to create order",
//         });
//     }
// }