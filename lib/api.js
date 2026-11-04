
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
      data.message ||
      data.error ||
      `API request failed (${response.status})`
    );

    error.status = response.status;
    error.statusCode = response.status;
    error.responseData = data;
    error.requestUrl = `${API_URL}${endpoint}`;

    error.retryAfter =
      data.retryAfter ||
      Number(response.headers.get("Retry-After")) ||
      null;

    console.error('[API Error]', {
      url: error.requestUrl,
      status: error.status,
      response: data,
    });

    throw error;
  }

  return data;
}
