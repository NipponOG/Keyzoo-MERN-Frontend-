import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

export async function registerPasskey(jwt, deviceName) {
    // 1. Get registration options
    const optionsRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-passkey/register/options`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                deviceName,
            }),
        }
    );

    const optionsData = await optionsRes.json();

    if (!optionsRes.ok) {
        throw new Error(optionsData.error || "Unable to generate passkey options.");
    }

    // 2. Ask browser to create passkey
    const credential = await startRegistration({
        optionsJSON: optionsData.options,
    });

    // 3. Send credential back to backend
    const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-passkey/register/verify`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                credential,
            }),
        }
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Passkey registration failed.");
    }

    return verifyData;
}

export async function loginPasskey(email) {
    // 1. Get authentication options
    const optionsRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-passkey/login/options`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        }
    );

    const optionsData = await optionsRes.json();

    if (!optionsRes.ok) {
        throw new Error(
            optionsData.error ||
            optionsData.message ||
            "Unable to generate login options."
        );
    }

    // 2. Ask browser to authenticate
    const credential = await startAuthentication({
        optionsJSON: optionsData.options,
    });

    // 3. Verify with backend
    const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-passkey/login/verify`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                credential,
            }),
        }
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
        throw new Error(
            verifyData.error ||
            verifyData.message ||
            "Passkey login failed."
        );
    }

    return verifyData;
}

export async function getPasskeys(jwt) {

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-passkey`,
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
            "Unable to load passkeys."
        );
    }

    return data.passkeys;
}

export async function renamePasskey(jwt, documentId, deviceName) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-passkey/${documentId}`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                deviceName,
            }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.error ||
            data.message ||
            "Unable to rename passkey."
        );
    }

    return data.passkey;
}

export async function deletePasskey(jwt, documentId) {

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/admin-passkey/${documentId}`,
        {
            method: "DELETE",
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
            "Unable to delete passkey."
        );
    }

    return data;
}