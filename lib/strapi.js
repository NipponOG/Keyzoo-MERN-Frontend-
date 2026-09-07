const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL; // e.g., http://localhost:1337/api
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN; // your token

// export async function fetchFromStrapi(endpoint, options = {}) {
//   const res = await fetch(`${STRAPI_URL}${endpoint}`, {
//     headers: {
//       Authorization: `Bearer ${STRAPI_TOKEN}`,
//       'Content-Type': 'application/json',
//     },
//     ...options,
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch from Strapi');
//   }

//   return res.json();
// }

// import { API_URL, STRAPI_API_TOKEN } from "./urls";

export const fetchFromStrapi = async (endpoint) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + STRAPI_TOKEN,
    },
  };

  const res = await fetch(`${STRAPI_URL}${endpoint}`, options);
  const data = await res.json();

  return data;
};

export async function createStrapiOrder(data) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  return json.data;
}

export async function updateStrapiOrder(id, data) {
  return await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });
}
