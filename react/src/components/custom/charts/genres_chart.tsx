import type { GenresCountType } from '@/static/types'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'

const COLORS = ['rgb(3, 71, 134)', 'rgb(21, 85, 176)', 'rgb(79, 132, 205)', 'rgb(129, 160, 204)']

export function getGenresCount<T extends { genre: string }>(items: T[]) {
    const genreCounts = items.reduce((acc, item) => {
        if (acc[item.genre]) {
            acc[item.genre] += 1
        } else {
            acc[item.genre] = 1
        }
        return acc
    }, {} as Record<string, number>)

    return Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }))
}

export default function GenresChart( {genres}: {genres: GenresCountType[]}) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={genres}
                    dataKey="count"
                    nameKey="genre"
                    innerRadius="70%"
                    outerRadius="100%"
                    paddingAngle={0}
                    stroke="none"
                >
                    {genres.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="square"
                    wrapperStyle={{
                        paddingLeft: '12px',
                        lineHeight: '42px',
                        fontSize: '12px',
                        whiteSpace: 'normal',
                        overflowWrap: 'break-word',
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}
