export const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const formatPercent = (value: number) => `${(value * 100).toFixed(0)}%`;