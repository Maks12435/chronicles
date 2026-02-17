import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router'
import App from './App'
import TaskStatistics from './pages/tasks/tasks_container'
import { RegisterPage } from './pages/register'
import { LoginPage } from './pages/login'
import Navbar from './components/custom/navbar/Navbar'
import UserProfileMenu from './components/custom/navbar/UserProfileMenu'
import { Gem } from 'lucide-react'
import axios from 'axios'
import { useUser } from './store/global-variables'
import Profile from './pages/profile'
import MusicStatistics from './pages/music/music_container'
import FootballStatistics from './pages/football/football_container'
import ShowContainer from './pages/show/show_container'
import Chronics from './pages/chronics'
import Footer from './components/custom/footer/footer'
import BooksStatistics from './pages/books/books_container'
import Diary from './pages/diary/diary'
import apiRequest from './api/axios'
import type { UserType } from './store/types'
import { SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/custom/main/sidebar'

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
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />

                <div className="flex flex-1 flex-col min-h-screen">
                    <header className="flex justify-between items-center p-4 border-b-2 border-zinc-800">
                        <div className="flex items-center gap-x-1">
                            <Gem />
                            <h4>Chronicles</h4>
                        </div>
                        <Navbar />
                        <UserProfileMenu />
                    </header>

                    <main className="flex-1">
                        <div className="flex justify-center flex-1">
                            <Outlet />
                        </div>
                    </main>

                    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-300">
                        <Footer />
                    </footer>
                </div>
            </div>
        </SidebarProvider>
    ),
    beforeLoad: async () => {
        const state = useUser.getState()

        if (state.user) {
            return
        }

        try {
            const response = await apiRequest<UserType>({ url: `auth/check`, method: 'GET' }, { silent: true })
            state.setUser(response)
        } catch (error: any) {
            if (error.response?.status === 401) {
                try {
                    await apiRequest({ url: 'auth/refresh', method: 'POST' }, { silent: true })

                    const response = await apiRequest<UserType>({ url: `auth/check`, method: 'GET' }, { silent: true })
                    state.setUser(response)
                } catch {
                    throw redirect({ to: '/auth/login' })
                }
            } else {
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

const booksStatisticsRoute = createRoute({
    path: '/books',
    getParentRoute: () => privateRoute,
    component: BooksStatistics,
})

const DiaryRoute = createRoute({
    path: '/diary',
    getParentRoute: () => privateRoute,
    component: Diary,
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
        booksStatisticsRoute,
        DiaryRoute,
    ]),
])

export const router = createRouter({ routeTree })
