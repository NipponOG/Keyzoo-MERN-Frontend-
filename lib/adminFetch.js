// export default async function adminFetch(url, options = {}) {
//     const token = localStorage.getItem("jwt");

//     const res = await fetch(url, {
//         ...options,
//         headers: {
//             ...(options.headers || {}),
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     if (res.status === 401) {
//         localStorage.removeItem("jwt");
//         localStorage.removeItem("user");
//         window.location.href = "/sign-in";
//         throw new Error("Unauthorized");
//     }

//     return res.json();
// }




export default async function adminFetch(url, options = {}) {
    
    const token = localStorage.getItem("jwt");

    if (!token) {
        window.location.href = "/sign-in";
        return;
    }

    const res = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    // if (res.status === 401) {
    //     // localStorage.removeItem("jwt");
    //     // localStorage.removeItem("user");
    //     // window.location.href = "/sign-in";
    //     return;
    // }

    return res.json();
}