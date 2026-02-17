import type { TrackType } from '@/store/types'
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const RED_COLORS = [
  '#5C0E32',
  '#611037',
  '#66103A',
  '#6B103A',
  '#70113E',
  '#751242',
  '#7C1444',
  '#821448',
  '#87164B',
  '#8E174D',
  '#951850',
  '#9B1953',
  '#A01A56',
  '#A61C59',
  '#AC1D5E',
  '#B21E63',
  '#BA2167',
  '#C2236C',
  '#CF2773',
  '#E9559C'
]

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

function pickEvenColors(palette: string[], n: number) {
  if (n <= 0) return []
  if (n === 1) return [palette[Math.floor((palette.length - 1) / 2)]]

  const last = palette.length - 1
  return Array.from({ length: n }, (_, i) => {
    const idx = Math.round((i * last) / (n - 1))
    return palette[idx]
  })
}

export default function ArtistChart({ data }: { data: TrackType[] }) {
  const artists = getArtistsCount(data)
  const colors = pickEvenColors(RED_COLORS, artists.length)

  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={artists} layout="vertical" margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <XAxis type="number" />
        <YAxis type="category" dataKey="artist" hide />
        <Tooltip />

        <Bar
          dataKey="count"
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
          {artists.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
