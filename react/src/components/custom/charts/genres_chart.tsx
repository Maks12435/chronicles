import type { GenresCountType } from '@/store/types'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'

const BLUE_COLORS = [
    '#0B3C8C', // глубокий синий
    '#1257B5', // насыщенный синий
    '#1C73DD', // яркий синий
    '#2C8EF0', // голубой
    '#3FA8F5', // мягкий sky-blue
    '#4FC1E8', // переход к бирюзе
    '#62e7ff', // бирюзовый
    '#91f4ff', // акцентная бирюза
]

const RED_COLORS = [
    '#B21E63', // основной акцент
    '#D72A7A', // яркая малина
    '#E9559C', // розово-малиновый
    '#F28BBC', // мягкий светлый
    '#F7B7D4', // пастельный
]

export function getGenresCount<T extends { genre: string }>(items: T[]) {
    const genreCounts = items.reduce(
        (acc, item) => {
            if (acc[item.genre]) {
                acc[item.genre] += 1
            } else {
                acc[item.genre] = 1
            }
            return acc
        },
        {} as Record<string, number>
    )

    return Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }))
}

type GenresChartProps = {
    genres: GenresCountType[]
    colorScheme?: 'blue' | 'red'
}

export default function GenresChart({ genres, colorScheme = 'blue' }: GenresChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
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
                        <Cell
                            key={`cell-${index}`}
                            fill={
                                colorScheme === 'blue'
                                    ? BLUE_COLORS[index % BLUE_COLORS.length]
                                    : RED_COLORS[index % RED_COLORS.length]
                            }
                        />
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
