async function getToken() {
    const response = await fetch(
        "https://auth.reloadly.com/oauth/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.RELOADLY_CLIENT_ID,
                client_secret: process.env.RELOADLY_CLIENT_SECRET,
                grant_type: "client_credentials",
                audience: "https://topups-sandbox.reloadly.com",
            }),
        }
    );

    return response.json();
}

export default async function handler(req, res) {

    const { operatorId, location } = req.query;

    if (!operatorId) {
        return res.status(400).json({
            error: "operatorId is required",
        });
    }

    try {

        const token = await getToken();

        const response = await fetch(
            `https://topups-sandbox.reloadly.com/operators/${operatorId}`,
            {
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            }
        );

        const operator = await response.json();

        const geographicalPlans =
            operator.geographicalRechargePlans || [];

        let selectedPlan = null;

        if (location) {
            selectedPlan = geographicalPlans.find(
                (plan) =>
                    plan.locationName?.toLowerCase() ===
                    location.toLowerCase()
            );
        } else {
            selectedPlan = geographicalPlans[0];
        }

        if (!selectedPlan) {
            return res.status(404).json({
                error: "Location plan not found",
            });
        }

        const amounts =
            selectedPlan.localAmounts || [];

        const descriptions =
            selectedPlan.localFixedAmountsDescriptions || {};

        const plans = amounts.map((amount) => ({
            amount,
            description:
                descriptions[
                amount.toFixed(2)
                ] || null,
        }));

        return res.status(200).json({
            operatorId: operator.id,
            operatorName: operator.name,
            location:
                selectedPlan.locationName,
            plans,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Failed to load plans",
        });

    }
}