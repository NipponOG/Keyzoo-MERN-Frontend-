
import { useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";

const locationIcon = L.divIcon({
    className: "",
    html: `
        <div style="
            width: 18px;
            height: 18px;
            background: #814DE5;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 1px 6px rgba(0,0,0,.4);
        "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

export default function LoginLocationMap({ location }) {
    const [expanded, setExpanded] = useState(false);

    const latitude = Number(location?.latitude);
    const longitude = Number(location?.longitude);

    const hasCoordinates =
        location?.latitude != null &&
        location?.longitude != null &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180;

    if (!hasCoordinates) {
        return (
            <p className="mt-3 text-xs text-gray-500">
                Map unavailable for this login.
            </p>
        );
    }

    return (
        <div className="mt-3">
            <div
                className="relative z-0 overflow-hidden rounded-xl border border-gray-200"
                style={{ height: expanded ? "300px" : "140px" }}
            >
                <MapContainer
                    center={[latitude, longitude]}
                    zoom={11}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%", zIndex: 0, }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker
                        position={[latitude, longitude]}
                        icon={locationIcon}
                    >
                        <Popup>
                            {[
                                location.city,
                                location.region,
                                location.country,
                            ].filter(Boolean).join(", ")}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    className="mt-2.5 cursor-pointer rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
                >
                    {expanded ? "Show Less" : "View Map"}
                </button>

                <p className="mt-1 text-[12px] text-gray-400 flex items-center">
                    Approximate location based on IP address.
                </p>
            </div>
        </div>
    );
}
