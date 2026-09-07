// lib/getSiteSettings.js

export async function getSiteSettings() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/sites`);
    const json = await res.json();
    return json.data.attributes.maintenance_mode;
}
