import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import type { UserType } from '@/static/types'
import { handleRegister } from '@/api/auth'
import toast from 'react-hot-toast'
import { Link } from '@tanstack/react-router'

export function RegisterPage() {
    const [creds, setCreds] = useState<UserType>({
        email: '',
        username: '',
        password: '',
    })
    const [confirmedPass, setConfirmedPass] = useState('')

    const handleCheckPasswords = () => {
        if (confirmedPass == creds.password) {
            return true
        }
        toast.error('confirmed password must be same as password')
        return false
    }

    return (
        <div
            className="flex justify-center items-center h-screen w-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/background.jpg')" }}
        >
            <Card className="w-full max-w-md backdrop-blur-md bg-zinc-900/40 border border-zinc-600 rounded-none">
                <CardHeader>
                    <CardTitle>Sign up</CardTitle>
                    <CardDescription>Enter your credentials to sign up</CardDescription>
                    <CardAction>
                        <Link to="/auth/login">
                            <Button variant="link">Log in</Button>
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (!handleCheckPasswords()) return
                            handleRegister(creds)
                        }}
                    >
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    onChange={(e) => setCreds((prev) => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="username"
                                    required
                                    onChange={(e) => setCreds((prev) => ({ ...prev, username: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={(e) => setCreds((prev) => ({ ...prev, password: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirm">Confirm Password</Label>
                                <Input
                                    id="password_confirm"
                                    type="password"
                                    required
                                    onChange={(e) => setConfirmedPass(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Sign up
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2"></CardFooter>
            </Card>
        </div>
    )
}
