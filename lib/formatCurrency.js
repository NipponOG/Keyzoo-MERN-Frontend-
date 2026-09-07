// lib/formatCurrency.js

export const formatCurrency = (amount = 0) =>
    Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });