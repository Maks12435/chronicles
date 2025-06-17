import Line from '@/components/custom/Line'
import { useEffect, useState } from 'react'

export default function Home() {
    const [offsetY, setOffsetY] = useState(0)

    const handleScroll = () => {
        setOffsetY(window.scrollY)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="bg-[url('assets/images/background.png')] bg-no-repeat bg-contain bg-center ">
            <div className="absolute px-4">
                <Line></Line>
            </div>
            <div className="grid grid-cols-12 relative py-18">
                <div className="col-span-6 col-start-4">
                    <img src="assets/images/Epicurus.png" alt="main" className="" style={{
                        backgroundImage: "url('/your-image.jpg')",
                        transform: `translateY(${offsetY * 0.1}px)`,
                    }}/>
                </div>
                <div
                    className="absolute text-center top-1/2 -translate-y-1/2 w-full"
                    style={{
                        backgroundImage: "url('/your-image.jpg')",
                        transform: `translateY(${offsetY * 0.2}px)`,
                    }}
                >
                    <h3 className="text-start pl-14 text-xl" style={{ fontFamily: 'Cinzel' }}>
                        The path to freedom
                    </h3>
                    <h1
                        className="xl:text-[280px] lg:text-[200px] md:text-[150px] sm:text-[120px] text-[60px] leading-[0.9]"
                        style={{ fontFamily: 'Cinzel' }}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 via-zinc-300 to-zinc-500">
                            M
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 via-zinc-300 to-zinc-500">
                            A
                        </span>
                        <span className="opacity-60 text-red-800">X</span>
                        <span className="opacity-60 text-red-800">I</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 via-zinc-300 to-zinc-500">
                            S
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 via-zinc-300 to-zinc-500">
                            M
                        </span>
                    </h1>
                    <div className="w-[500px] grid grid-cols-2 pl-14 gap-x-6">
                        <h3 className="text-[12px] text-justify" style={{ fontFamily: 'Cinzel' }}>
                            The meaning of human life is to achieve happiness, which consists in pleasure, but not
                            physical but spiritual pleasure. And you can achieve this pleasure only if you are free and
                            wise, and are the master of your life and your mind.
                        </h3>
                        <h3 className="text-[12px] text-justify" style={{ fontFamily: 'Cinzel' }}>
                            Without suffering, pleasure has no meaning. A person cannot understand the value of pleasure
                            if he does not know what suffering means, and the more suffering, the sweeter the pleasure
                            after it.
                        </h3>
                    </div>
                </div>
            </div>
            <div className="absolute px-4">
                <Line></Line>
                <Line></Line>
                <Line></Line>
            </div>
        </div>
    )
}
