
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { PageApplications } from "../pages/Applications/Applications";
import PageHome from "../pages/Home/Home";
import { AuthContextProvider, useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header/Header";

const RootLayout = () => {
    return (
        <AuthContextProvider>
            <Header />
            <Outlet />
        </AuthContextProvider>
    )
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return null; // Or a loading spinner

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <PageHome />
            },
            {
                path: '/applications',
                element: (
                    <ProtectedRoute>
                        <PageApplications />
                    </ProtectedRoute>
                )
            },
            {
                path: '*',
                element: <Navigate to="/" replace />
            }
        ]
    }
])


