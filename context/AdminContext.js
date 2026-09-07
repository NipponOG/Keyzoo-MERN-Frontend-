import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    //--------------------------------------------------
    // Restore session
    //--------------------------------------------------

    useEffect(() => {

        const restoreSession = async () => {

            try {

                const token = localStorage.getItem("jwt");

                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch("/api/admin/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {

                    localStorage.removeItem("jwt");

                    setUser(null);

                    setLoading(false);

                    return;

                }

                setUser(data.user);

            } catch (err) {

                console.error(err);

                localStorage.removeItem("jwt");

                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        restoreSession();

    }, []);

    //--------------------------------------------------
    // Login
    //--------------------------------------------------

    const login = (jwt, user) => {

        localStorage.setItem("jwt", jwt);

        setUser(user);

    };

    //--------------------------------------------------
    // Logout
    //--------------------------------------------------

    const logout = () => {

        localStorage.removeItem("jwt");

        setUser(null);

    };

    return (

        <AdminContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >

            {children}

        </AdminContext.Provider>

    );

}

export function useAdmin() {

    return useContext(AdminContext);

}