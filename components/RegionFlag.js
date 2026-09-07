import ReactCountryFlag from "react-country-flag";
import { FaGlobeAmericas } from "react-icons/fa";
import { REGION_FLAGS } from "@/lib/regionFlags";

export default function RegionFlag({ region }) {
    const code = REGION_FLAGS[region];

    if (!code) {
        return <FaGlobeAmericas className="text-[#359dff] text-lg" />;
    }

    return (
        <ReactCountryFlag
            countryCode={code}
            svg
            style={{
                width: "22px",
                height: "22px",
                borderRadius: "4px",
            }}
            aria-label={region}
        />
    );
}