import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function UserProfileMenu() {
    const username = 'Maksud.N'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3"
                >
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="/avatar.jpg" alt="@user" />
                        <AvatarFallback className="bg-purple-100 text-purple-900">
                            MN
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-start">
                        <h3 className="text-md font-medium">{username}</h3>
                        <h4 className="text-[12px] font-medium text-zinc-600">user</h4>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log('Сменить пароль')}>
                    Сменить пароль
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Выход')}>
                    Выйти
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
