import { Outlet } from '@tanstack/react-router'
import './App.css'
import Navbar from './components/custom/Navbar'
import UserProfileMenu from './components/custom/UserProfileMenu'
import Home from './pages/Home'
import { LogsIcon } from 'lucide-react'

function App() {
    return (
        <div className="flex justify-center">
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
    )
}

export default App
