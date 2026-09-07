const store = new Map();

export const TEMP_SECRET_EXPIRY = 10 * 60 * 1000;

export function setTempSecret(userId, secret) {

    store.set(userId, {
        secret,
        createdAt: Date.now(),
    });

}

export function getTempSecret(userId) {

    const data = store.get(userId);

    if (!data) return null;

    if (Date.now() - data.createdAt > TEMP_SECRET_EXPIRY) {

        store.delete(userId);

        return null;

    }

    return data;

}

export function removeTempSecret(userId) {

    store.delete(userId);

}