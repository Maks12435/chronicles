import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Link, useRouterState } from '@tanstack/react-router'
import { BookOpen, Box, ChevronRight, Sparkles, ListTodo } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type SubItem = { label: string; to: string }

export function AppSidebar() {
    const pathname = useRouterState({ select: (s) => s.location.pathname })

    const pages = useMemo(
        () => [
            { label: 'Home', to: '/' },
            { label: 'Diary', to: '/diary' },
            { label: 'Tasks', to: '/tasks' },
        ],
        []
    )

    const interests: SubItem[] = useMemo(
        () => [
            { label: 'Music', to: '/music' },
            { label: 'TV shows', to: '/shows' },
            { label: 'Football', to: '/football' },
            { label: 'Books', to: '/books' },
        ],
        []
    )

    const [openModels, setOpenModels] = useState<boolean>(true)

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="relative h-12">
                <SidebarTrigger className="absolute right-2 top-2" />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Pages</SidebarGroupLabel>

                    <SidebarMenu>
                        {pages.map((item) => {
                            const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)

                            const Icon =
                                item.label === 'Home'
                                    ? Box
                                    : item.label === 'Diary'
                                      ? BookOpen
                                      : item.label === 'Tasks'
                                        ? ListTodo
                                        : Sparkles

                            return (
                                <SidebarMenuItem key={item.to}>
                                    <SidebarMenuButton asChild className={cn(active && 'bg-muted')}>
                                        <Link to={item.to}>
                                            <Icon className="size-4" />
                                            <span>{item.label}</span>
                                            <ChevronRight className="ml-auto size-4 opacity-70" />
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}

                        <SidebarMenuItem>
                            <Collapsible open={openModels} onOpenChange={setOpenModels}>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <Sparkles className="size-4" />
                                        <span>Interests</span>
                                        <ChevronRight
                                            className={cn(
                                                'ml-auto size-4 opacity-70 transition-transform',
                                                openModels && 'rotate-90'
                                            )}
                                        />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {interests.map((sub) => {
                                            const subActive = pathname.startsWith(sub.to)
                                            return (
                                                <SidebarMenuSubItem key={sub.to}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className={cn(subActive && 'bg-muted')}
                                                    >
                                                        <Link to={sub.to}>{sub.label}</Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            )
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </Collapsible>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    )
}
