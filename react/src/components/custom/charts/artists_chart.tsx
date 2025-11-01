import type { TrackType } from '@/static/types'
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const COLORS = ['rgb(3, 71, 134)', 'rgb(21, 85, 176)', 'rgb(79, 132, 205)', 'rgb(129, 160, 204)']

function getArtistsCount<T extends { artist: string }>(items: T[]) {
    const artistCounts = items.reduce((acc, item) => {
        if (acc[item.artist]) {
            acc[item.artist] += 1
        } else {
            acc[item.artist] = 1
        }
        return acc
    }, {} as Record<string, number>)

    return Object.entries(artistCounts)
        .map(([artist, count]) => ({ artist, count }))
        .sort((a, b) => b.count - a.count) 
}

export default function ArtistChart( {data} : {data: TrackType[]} ) {
	const artists = getArtistsCount(data)

    return (
        <ResponsiveContainer width="100%" height={420}>
            <BarChart data={artists} layout="vertical" margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="artist" hide /> <Tooltip />
                <Bar
                    dataKey="count"
                    fill="#8884d8"
                    radius={[0, 5, 5, 0]}
                    label={({ x, y, height, index }) => {
                        const artist = artists[index].artist
                        const count = artists[index].count
                        return (
                            <text x={x + 5} y={y! + height / 2} fill="white" fontSize={12} alignmentBaseline="middle">
                                {artist} ({count})
                            </text>
                        )
                    }}
                >
                    {artists.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
