import { Outlet, useNavigate } from '@tanstack/react-router'
import './App.css'
import Navbar from './components/custom/navbar/Navbar'
import UserProfileMenu from './components/custom/navbar/UserProfileMenu'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Archive, CheckCircle2Icon, Gem, Heading1Icon, LogsIcon, XCircleIcon } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

const queryClient = new QueryClient()

function App() {
    const navigate = useNavigate()

    /*useEffect(() => {
        navigate({ to: '/statistics/media' })
    }, [])*/

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
