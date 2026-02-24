import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index.tsx';
import { Toaster } from 'react-hot-toast';

export function App() {
    return (
        <>
            <Toaster
                position="bottom-right"
                reverseOrder={true}
            />

            <RouterProvider router={router} />
        </>
    );
}
