import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index.tsx';
import { Toaster } from 'react-hot-toast';

export function App() {
    return (
        <>
            <Toaster
                position="bottom-right"
                reverseOrder={true}
                toastOptions={{
                    duration: 5000,
                }}
            />

            <RouterProvider router={router} />
        </>
    );
}
