export async function changePassword(
    jwt,
    currentPassword,
    newPassword
) {

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-auth/change-password`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.error?.message ||
            data.message ||
            "Unable to change password."
        );
    }

    return data;
}

export async function getAdminMe(jwt) {

    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-auth/me`,
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response body:", data);

    if (!response.ok) {
        throw new Error(data.error || "Failed to load admin.");
    }

    return data;
}

export async function disable2FA(jwt) {

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-auth/disable-2fa`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Unable to disable 2FA.");
    }

    return data;
}

export async function generate2FA(jwt) {

    const res = await fetch(
        "/api/admin/2fa/setup",
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(

            data.error ||
            data.message ||
            "Unable to generate a QR code. Please try again."

        );
    }

    return data;
}

export async function verify2FA(jwt, code) {

    const res = await fetch(
        "/api/admin/2fa/verify",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
            }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(

            data.error ||
            data.message ||
            "Unable to verify the authentication code."

        );
    }

    return data;
}