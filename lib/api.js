
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
  };

  if (isFormData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  } else {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    cache: "no-store",
    headers,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(
      data.message || "API request failed"
    );

    error.status = response.status;
    error.statusCode = response.status;
    error.retryAfter =
      data.retryAfter ||
      Number(response.headers.get("Retry-After")) ||
      null;

    throw error;
  }

  return data;
}
