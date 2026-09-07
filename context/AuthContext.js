// context/AuthContext.js
import { createContext, useState, useEffect, useContext } from "react";
import { apiFetch } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(null);
    const [loading, setLoading] = useState(true); // ⭐ NEW

    const login = (userData, token) => {
        setUser(userData);
        setJwt(token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("jwt", token);
    };

    const logout = () => {
        setUser(null);
        setJwt(null);
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
    };

    useEffect(() => {
        const checkAuth = async () => {
            const savedJwt = localStorage.getItem("jwt");

            if (!savedJwt) {
                setLoading(false);
                return;
            }

            try {

                const data = await apiFetch("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${savedJwt}`,
                    },
                });

                setJwt(savedJwt);
                setUser(data.user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

            } catch (err) {

                console.error("Auth verification failed:", err);
                logout();
                
            } finally {

                setLoading(false);

            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, jwt, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
