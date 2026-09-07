import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const KEY = Buffer.from(
    process.env.TWO_FACTOR_ENCRYPTION_KEY,
    "hex"
);

export function encrypt(text) {

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        ALGORITHM,
        KEY,
        iv
    );

    let encrypted = cipher.update(
        text,
        "utf8",
        "hex"
    );

    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        tag.toString("hex"),
        encrypted,
    ].join(":");

}

export function decrypt(payload) {

    const [
        ivHex,
        tagHex,
        encrypted,
    ] = payload.split(":");

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        KEY,
        Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(
        Buffer.from(tagHex, "hex")
    );

    let decrypted = decipher.update(
        encrypted,
        "hex",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;

}