import speakeasy from "speakeasy";
import { encrypt, decrypt } from "@/lib/auth/crypto";

export function generateSecret(email) {
    return speakeasy.generateSecret({
        name: `Keyzoo Admin (${email})`,
        issuer: "Keyzoo",
        length: 20,
    });
}

export function verifyToken(secret, token) {
    return speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1,
    });
}

export function encryptSecret(secret) {
    return encrypt(secret);
}

export function decryptSecret(secret) {
    return decrypt(secret);
}