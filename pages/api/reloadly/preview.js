export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed",
        });
    }

    const {
        phone,
        operatorId,
        operatorName,
        amount,
        country,
    } = req.body;

    return res.status(200).json({
        phone,
        operatorId,
        operatorName,
        amount,
        country,
        status: "preview",
    });
}