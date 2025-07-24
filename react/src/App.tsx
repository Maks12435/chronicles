import { Outlet } from '@tanstack/react-router'
import './App.css'
import Navbar from './components/custom/Navbar'
import UserProfileMenu from './components/custom/UserProfileMenu'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CheckCircle2Icon, LogsIcon, XCircleIcon } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex justify-center">
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
                <div className="container">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-x-1">
                            <LogsIcon />
                            <h4>Maxism</h4>
                        </div>
                        <Navbar />
                        <UserProfileMenu />
                    </div>
                    <div>
                        <Outlet />
                    </div>
                </div>
            </div>
        </QueryClientProvider>
    )
}

export default App
