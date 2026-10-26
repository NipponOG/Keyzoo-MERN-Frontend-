
import { startAuthentication } from "@simplewebauthn/browser";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function postJson(endpoint, body = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Passkey authentication failed.");
    }

    return data;
}

export async function loginPasskey() {
    // Request a fresh authentication challenge from the Express backend.
    const challengeData = await postJson(
        "/admin/passkeys/authentication/options"
    );

    if (!challengeData.options || !challengeData.challengeKey) {
        throw new Error("The server returned invalid passkey options.");
    }

    // Ask the browser to authenticate using a registered passkey.
    const credential = await startAuthentication({
        optionsJSON: challengeData.options,
    });

    // Verify the credential and receive the admin JWT.
    const result = await postJson(
        "/admin/passkeys/authentication/verify",
        {
            challengeKey: challengeData.challengeKey,
            response: credential,
        }
    );

    if (!result.jwt || !result.user) {
        throw new Error("The server did not return a valid admin session.");
    }

    return result;
}
