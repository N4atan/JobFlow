
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { PageApplications } from "../pages/Applications/Applications";
import PageHome from "../pages/Home/Home";
import { AuthContextProvider, useAuth } from "../contexts/AuthContext";
import { JobContextProvider } from "../contexts/JobContext";
import { Header } from "../components/Header/Header";
import { PrivacyPage } from '../pages/Privacy/Privacy'

const RootLayout = () => {
    return (
        <AuthContextProvider>
            <JobContextProvider>
                <Header />
                <Outlet />
            </JobContextProvider>
        </AuthContextProvider>
    )
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const agreed = localStorage.getItem("@jobflow:agreed");

    if (loading) return null; // Or a loading spinner

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!agreed) {
        return <Navigate to="/privacy" replace state={{ redirection: true}}/>;
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
            },
            {
                path: '/privacy',
                element: <PrivacyPage />
            }
        ]
    }
])


