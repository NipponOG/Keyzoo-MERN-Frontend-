export function formatDate(date, format = "DD-MM-YYYY") {
    if (!date) return "";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    switch (format) {
        case "DD-MM-YYYY":
            return `${day}-${month}-${year}`;

        case "YYYY-MM-DD":
            return `${year}-${month}-${day}`;

        case "DD/MM/YYYY":
            return `${day}/${month}/${year}`;

        default:
            return `${day}-${month}-${year}`;
    }
}