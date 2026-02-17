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
import { useUser } from '@/store/global-variables'
import { ChangePassword, handleDelete, handleLogout } from '@/api/auth'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AlertDescription } from '@/components/ui/alert'

export default function UserProfileMenu() {
    const { user } = useUser()
    const [prevPass, setPrevPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="/avatar.jpg" alt="@user" />
                        <AvatarFallback className="bg-purple-100 text-purple-900">MN</AvatarFallback>
                    </Avatar>
                    <div className="text-start">
                        <h3 className="text-md font-medium">{user?.username}</h3>
                        <h4 className="text-[12px] font-medium text-zinc-600">admin</h4>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />

                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Change password</DropdownMenuItem>
                    </DialogTrigger>

                    <DialogContent>
                        <div className="flex flex-col gap-y-4">
                            <div className="flex flex-col gap-y-1">
                                <Label htmlFor="old_pass">Previous password</Label>
                                <Input id="old_pass" type="password" onChange={(e) => setPrevPass(e.target.value)} />
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <Label htmlFor="new_pass">New password</Label>
                                <Input id="new_pass" type="password" onChange={(e) => setNewPass(e.target.value)} />
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <Label htmlFor="confirm_pass">Confirm password</Label>
                                <Input
                                    id="confirm_pass"
                                    type="password"
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                />
                            </div>

                            <Button onClick={() => ChangePassword(prevPass, newPass, confirmPass)}>Confirm</Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Log out</DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Logout account</AlertDialogTitle>
                            <AlertDescription>Are you sure you want to logout account?</AlertDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleLogout()}>Logout</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}  className="text-red-500">Delete account</DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete account</AlertDialogTitle>
                            <AlertDescription>Are you sure you want to delete account?</AlertDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete()}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
