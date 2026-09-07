// import { useEffect, useState } from 'react';

// const currencyMap = {
//   US: { symbol: '$', code: 'USD' },
//   IN: { symbol: '₹', code: 'INR' },
//   EU: { symbol: '€', code: 'EUR' },
//   GB: { symbol: '£', code: 'GBP' },
//   JP: { symbol: '¥', code: 'JPY' },
//   // add more if needed
// };

// export default function useCurrency() {
//   const [currency, setCurrency] = useState({ symbol: '$', code: 'USD' });

//   useEffect(() => {
//     async function fetchLocation() {
//       try {
//         const res = await fetch('https://ipapi.co/json/');
//         const data = await res.json();
//         const country = data.country;

//         if (currencyMap[country]) {
//           setCurrency(currencyMap[country]);
//         }
//       } catch (err) {
//         console.error('Geo API error:', err);
//       }
//     }

//     fetchLocation();
//   }, []);

//   return currency;
// }





import { useEffect, useState } from 'react';

const currencyMap = {
  US: { symbol: '$', code: 'USD' },
  IN: { symbol: '₹', code: 'INR' },
  EU: { symbol: '€', code: 'EUR' },
  GB: { symbol: '£', code: 'GBP' },
  JP: { symbol: '¥', code: 'JPY' },
  // add more if needed
};

export default function useCurrency() {
  const [currency, setCurrency] = useState({ symbol: '$', code: 'USD' });

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await res.json();
        const country = data.country_code; // GeoJS returns `country_code`

        if (currencyMap[country]) {
          setCurrency(currencyMap[country]);
        }
      } catch (err) {
        console.error('GeoJS API error:', err);
      }
    }

    fetchLocation();
  }, []);

  return currency;
}


















// import { useEffect, useState } from 'react';

// const currencyMap = {
//   US: { symbol: '$', code: 'USD' },
//   IN: { symbol: '₹', code: 'INR' },
//   EU: { symbol: '€', code: 'EUR' },
//   GB: { symbol: '£', code: 'GBP' },
//   JP: { symbol: '¥', code: 'JPY' },
//   // add more...
// };

// export default function useCurrency(basePriceUSD) {
//   const [price, setPrice] = useState(basePriceUSD);
//   const [currency, setCurrency] = useState({ symbol: '$', code: 'USD' });

//   useEffect(() => {
//     async function fetchLocationAndRate() {
//       try {
//         // Step 1: Get user location
//         const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
//         const data = await res.json();
//         const country = data.country_code;

//         if (currencyMap[country]) {
//           const userCurrency = currencyMap[country];
//           setCurrency(userCurrency);

//           // Step 2: Convert USD → Local Currency
//           const rateRes = await fetch(
//             `https://api.exchangerate.host/convert?from=USD&to=${userCurrency.code}&amount=${basePriceUSD}`
//           );
//           const rateData = await rateRes.json();

//           if (rateData.result) {
//             setPrice(rateData.result.toFixed(2));
//           }
//         }
//       } catch (err) {
//         console.error('GeoJS or Exchange API error:', err);
//       }
//     }

//     fetchLocationAndRate();
//   }, [basePriceUSD]);

//   return { price, currency };
// }







