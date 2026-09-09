const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function adminFetch(endpoint, options = {}) {
    const token = sessionStorage.getItem("admin_jwt");

    if (!token) {
        window.location.href = "/admin/login";
        return;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    if (res.status === 401) {
        sessionStorage.removeItem("admin_jwt");
        sessionStorage.removeItem("admin_user");

        window.location.href = "/admin/login";
        return;
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.message || "Admin API request failed"
        );
    }

    return data;
}