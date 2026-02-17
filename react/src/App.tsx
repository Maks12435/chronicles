import { Outlet} from '@tanstack/react-router'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react'
import { Toaster } from 'react-hot-toast'


const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: '#111',
                        color: '#eee',
                        fontSize: '14px',
                    },
                    success: {
                        icon: <CheckCircle2Icon />,
                        style: {
                            background: '#111',
                            color: '#eee',
                            fontSize: '14px',
                        },
                    },
                    error: {
                        icon: <XCircleIcon />,
                        style: {
                            background: '#111',
                            color: '#eee',
                            fontSize: '14px',
                        },
                    },
                }}
            />

            <Outlet />
        </QueryClientProvider>
    )
}

export default App
