import { useEffect, useState } from 'react';

export default function useConvertedPrice(priceEUR, currencyCode) {
    const [price, setPrice] = useState(priceEUR);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!priceEUR || currencyCode === 'EUR') {
            setPrice(priceEUR);
            return;
        }

        async function convert() {
            try {
                setLoading(true);

                const res = await fetch(
                    `https://api.exchangerate.host/convert?from=EUR&to=${currencyCode}&amount=${priceEUR}`
                );
                const data = await res.json();

                // Optional buffer (recommended)
                const buffered = data.result * 1.05;

                setPrice(Math.round(buffered * 100) / 100);
            } catch (err) {
                console.error('FX error', err);
                setPrice(priceEUR);
            } finally {
                setLoading(false);
            }
        }

        convert();
    }, [priceEUR, currencyCode]);

    return { price, loading };
}
