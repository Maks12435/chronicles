import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { AvgRating } from '@/static/types'
import CountUp from "react-countup";

export function getAverageRatings<T extends { rating: number; personal_rating: number }>(items: T[]) {
    let total_rating = 0
    let total_prating = 0

    for (const item of items) {
        total_rating += item.rating
        total_prating += item.personal_rating
    }

    return {
        rating: Number((total_rating / items.length).toFixed(3)),
        personal_rating: Number((total_prating / items.length).toFixed(3)),
    }
}

export default function RatingBox({ ratings }: { ratings: AvgRating }) {
    return (
        <Card className="bg-transparent rounded-sm font-semibold">
            <CardContent>
                <div className="grid grid-cols-2 items-center">
                    <h4>Rating:</h4>
                    <CountUp end={ratings.rating} decimals={2} duration={3.2} className="text-end text-[#476fff] text-xl" />
                </div>
                <div className="grid grid-cols-2 items-center">
                    <h4>Personal rating:</h4>
                    <CountUp end={ratings.personal_rating} decimals={2} duration={3.2} className="text-end text-cyan-500 text-xl" />
                </div>
            </CardContent>
        </Card>
    )
}
