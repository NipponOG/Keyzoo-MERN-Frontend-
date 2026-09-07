"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export default function StyledQRCode({

    value,

    size = 360,

    logo = "/qr-logo.png",

}) {

    const ref = useRef(null);

    const qr = useRef(null);

    // useEffect(() => {

    //     if (!value) return;

    //     if (!qr.current) {

    //         qr.current = new QRCodeStyling({

    //             width: size,

    //             height: size,

    //             type: "svg",

    //             data: value,

    //             image: logo,

    //             margin: 0,

    //             qrOptions: {

    //                 errorCorrectionLevel: "H",

    //             },

    //             dotsOptions: {

    //                 type: "rounded",

    //                 gradient: {

    //                     type: "linear",

    //                     rotation: Math.PI / 4,

    //                     colorStops: [

    //                         {

    //                             offset: 0,

    //                             color: "#7C3AED",

    //                         },

    //                         {

    //                             offset: 1,

    //                             color: "#4F46E5",

    //                         },

    //                     ],

    //                 },

    //             },

    //             cornersSquareOptions: {

    //                 type: "extra-rounded",

    //                 color: "#4F46E5",

    //             },

    //             cornersDotOptions: {

    //                 type: "dot",

    //                 color: "#4F46E5",

    //             },

    //             backgroundOptions: {

    //                 color: "#FFFFFF",

    //             },

    //             imageOptions: {

    //                 crossOrigin: "anonymous",

    //                 imageSize: 0.28,

    //                 margin: 8,

    //                 hideBackgroundDots: true,

    //             },

    //         });

    //         qr.current.append(ref.current);

    //     } else {

    //         qr.current.update({

    //             data: value,

    //             image: logo,

    //         });

    //     }

    // }, [value, logo, size]);

    useEffect(() => {
        if (!ref.current || !value) return;

        ref.current.innerHTML = "";

        const qr = new QRCodeStyling({
            width: size,
            height: size,

            type: "svg",

            data: value,

            image: logo,

            margin: 0,

            qrOptions: {
                errorCorrectionLevel: "H",
            },

            dotsOptions: {
                type: "dots",

                gradient: {
                    type: "linear",
                    rotation: Math.PI / 4,
                    colorStops: [
                        {
                            offset: 0,
                            color: "#7C3AED",
                        },
                        {
                            offset: 1,
                            color: "#4F46E5",
                        },
                    ],
                }
            },

            cornersSquareOptions: {
                type: "extra-rounded",
                color: "#4F46E5",
            },

            cornersDotOptions: {
                type: "dot",
                color: "#4F46E5",
            },

            backgroundOptions: {
                color: "#FFFFFF",
            },

            imageOptions: {
                imageSize: 0.26,
                margin: 14,
                hideBackgroundDots: true,
                crossOrigin: "anonymous",
            },
        });

        qr.append(ref.current);

        qr.current = qr;

    }, [value]);

    return (

        <div
            className="
                rounded-[30px]
                bg-white
                p-5
                shadow-[0_20px_60px_rgba(79,70,229,.18)]
            "
        >

            <div ref={ref} />

        </div>

    );

}