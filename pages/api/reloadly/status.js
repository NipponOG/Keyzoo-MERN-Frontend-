export default async function handler(req, res) {
    const { id } = req.query;

    return res.status(200).json({
        id,
        status: "SUCCESS",
    });
}