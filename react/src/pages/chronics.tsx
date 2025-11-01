import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from '@tanstack/react-router'

export default function Chronics() {
    return (
        <div className="container">
            <div className="flex flex-col items-center text-center py-2" style={{ fontFamily: 'Staatliches' }}>
                <h1 className="text-3xl text-zinc-100">My Hall of Top Favorites</h1>
            </div>

            <Separator className="bg-zinc-700 mb-4" />

            <div className="flex flex-col">
                <div className="grid grid-cols-3 gap-x-4">
                    <ContentCard
                        title="Best Music"
                        description="Every song captures a moment"
                        image="chaewon.png"
                        path="/music"
                    />
                    <ContentCard
                        title="Best Matches"
                        description="Football is more than a game"
                        image="eric.png"
                        path="/football"
                    />
                    <ContentCard
                        title="Best TV Shows"
                        description="Stories that grab your attention"
                        image="walt.jpg"
                        path="/shows"
                    />
                </div>
                <div className="grid grid-cols-3 gap-x-4 pt-8">
                    <ContentCard
                        title="Best Books"
                        description="Every song captures a moment"
                        image="fault.jpg"
                        path="/books"
                    />
                    <ContentCard
                        title="Best Games"
                        description="Football is more than a game"
                        image="game.jpg"
                        path="/games"
                    />
                    <ContentCard
                        title="Best Chess Matches"
                        description="Stories that grab your attention"
                        image="chess.jpg"
                        path="/chess"
                    />
                </div>
            </div>
        </div>
    )
}

function ContentCard({
    title,
    description,
    image,
    path,
}: {
    title: string
    description: string
    image: string
    path: string
}) {
    const navigate = useNavigate()

    return (
        <Card
            className="group w-full h-96 flex-1 backdrop-blur-md bg-zinc-900/20 border border-zinc-700  rounded-none p-0 overflow-hidden relative"
            onClick={() => navigate({ to: path })}
        >
            <CardContent className="p-0 h-full">
                <img src={`/assets/images/${image}`} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-fuchsia-900/80 via-transparent to-transparent flex items-end justify-center p-4 transition duration-300 group-hover:from-fuchsia-800/90">
                    <div className="flex flex-col" style={{ fontFamily: 'Staatliches' }}>
                        <h3 className="text-5xl text-white transition duration-300 group-hover:-translate-y-2">
                            {title}
                        </h3>
                        <h4 className="text-center transition duration-300 group-hover:-translate-y-3 text-zinc-200">
                            {description}
                        </h4>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
