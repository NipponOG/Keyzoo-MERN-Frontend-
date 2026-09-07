// lib/topupOrder.js

export async function createTopupOrder(data) {
    return fetchFromStrapi(
        "api/topup-orders",
        {
            method: "POST",
            body: JSON.stringify({
                data,
            }),
        }
    );
}