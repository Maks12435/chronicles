import { handleLogin } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export function LoginPage() {
    const [creds, setCreds] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate()

    return (
        <div
            className="flex justify-center items-center h-screen w-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/background.png')" }}
        >
            <Card className="w-full max-w-md backdrop-blur-md bg-zinc-900/40 border border-zinc-600 rounded-none">
                <CardHeader>
                    <CardTitle>Log in</CardTitle>
                    <CardDescription>Enter your credentials to login</CardDescription>
                    <CardAction>
                        <Link to="/auth/register">
                            <Button variant="link">Sign Up</Button>
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault()
                            try {
                                await handleLogin(creds)
                                navigate({ to: '/profile' })
                            } catch (err) {
                                console.error(err)
                                alert('Login failed')
                            }
                        }}
                    >
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={(e) => setCreds((prev) => ({ ...prev, email: e.target.value }))}
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
                            <a href="#" className="text-center text-sm underline-offset-4 hover:underline">
                                Forgot your password?
                            </a>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2"></CardFooter>
            </Card>
        </div>
    )
}
