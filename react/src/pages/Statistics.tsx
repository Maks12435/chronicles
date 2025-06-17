import { Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function Statistics() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate({ to: 'media' })
    }, [])

    return (
        <>
            <Outlet />
        </>
    )
}
