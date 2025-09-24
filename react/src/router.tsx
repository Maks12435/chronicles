import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router'
import App from './App'
import TaskStatistics from './pages/tasks'
import { RegisterPage } from './pages/register'
import { LoginPage } from './pages/login'
import Navbar from './components/custom/navbar/Navbar'
import UserProfileMenu from './components/custom/navbar/UserProfileMenu'
import { Gem } from 'lucide-react'
import axios from 'axios'
import { AUTH_ROUTE_URL } from './static/urls'
import { useUser } from './store/userInfo'
import Profile from './pages/profile'
import MusicStatistics from './pages/music/music_container'
import FootballStatistics from './pages/football/football_container'
import ShowContainer from './pages/show/show_container'
import Chronics from './pages/chronics'
import Footer from './components/custom/footer/footer'

const rootRoute = createRootRoute({
    component: App,
})

const publicRoute = createRoute({
    path: '/auth',
    getParentRoute: () => rootRoute,
    component: () => <Outlet />,
})

const privateRoute = createRoute({
    path: '/',
    getParentRoute: () => rootRoute,
    component: () => (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b-2 border-zinc-800">
                <div className="flex items-center gap-x-1">
                    <Gem />
                    <h4>Chronicles</h4>
                </div>
                <Navbar />
                <UserProfileMenu />
            </header>

            {/* Main Content */}
            <main className="flex justify-center flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-zinc-950 border border-t-zinc-800 text-zinc-300 mt-8">
                <Footer />
            </footer>
        </div>
    ),
    beforeLoad: async () => {
        const state = useUser.getState()
        if (!state.user) {
            try {
                const response = await axios.get(`${AUTH_ROUTE_URL}/check`, {
                    withCredentials: true,
                })
                state.setUser(response.data)
            } catch {
                throw redirect({ to: '/auth/login' })
            }
        }
    },
})

const RegisterRoute = createRoute({
    path: '/register',
    getParentRoute: () => publicRoute,
    component: RegisterPage,
})

const LoginRoute = createRoute({
    path: '/login',
    getParentRoute: () => publicRoute,
    component: LoginPage,
})

const profileRoute = createRoute({
    path: '/profile',
    getParentRoute: () => privateRoute,
    component: Profile,
})

const tasksStatisticsRoute = createRoute({
    path: '/tasks',
    getParentRoute: () => privateRoute,
    component: TaskStatistics,
})

const chronicsStatisticsRoute = createRoute({
    path: '/chronics',
    getParentRoute: () => privateRoute,
    component: Chronics,
})

const musicStatisticsRoute = createRoute({
    path: '/music',
    getParentRoute: () => privateRoute,
    component: MusicStatistics,
})

const showStatisticsRoute = createRoute({
    path: '/shows',
    getParentRoute: () => privateRoute,
    component: ShowContainer,
})

const footballStatisticsRoute = createRoute({
    path: '/football',
    getParentRoute: () => privateRoute,
    component: FootballStatistics,
})

const routeTree = rootRoute.addChildren([
    publicRoute.addChildren([LoginRoute, RegisterRoute]),
    privateRoute.addChildren([
        profileRoute,
        musicStatisticsRoute,
        showStatisticsRoute,
        footballStatisticsRoute,
        chronicsStatisticsRoute,
		tasksStatisticsRoute,
    ]),
])

export const router = createRouter({ routeTree })
