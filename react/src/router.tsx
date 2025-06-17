import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import MediaStatistics from './pages/MediaStatistics'
import TaskStatistics from './pages/TaskStatistics'

const rootRoute = createRootRoute({
    component: App,
})

const homeRoute = createRoute({
    path: '/home',
    getParentRoute: () => rootRoute,
    component: Home,
})

const statisticsRoute = createRoute({
    path: '/statistics',
    getParentRoute: () => rootRoute,
    component: Statistics,
})

const tasksStatisticsRoute = createRoute({
    path: '/tasks',
    getParentRoute: () => statisticsRoute,
    component: TaskStatistics,
})

const mediaStatisticsRoute = createRoute({
    path: '/media',
    getParentRoute: () => statisticsRoute,
    component: MediaStatistics,
})

const routeTree = rootRoute.addChildren([homeRoute, statisticsRoute.addChildren([tasksStatisticsRoute, mediaStatisticsRoute])])

export const router = createRouter({routeTree,})
