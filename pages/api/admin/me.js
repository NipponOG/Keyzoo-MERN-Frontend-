import verifyAdmin from "@/lib/auth/verifyAdmin";

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed",
        });
    }

    const user = await verifyAdmin(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }

    return res.status(200).json({
        success: true,
        user,
    });

}