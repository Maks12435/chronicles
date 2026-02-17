import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { currentYear } from '@/store/global-variables'

type Year = number

export type BannerConfig = {
    title: string
    imagesByYear: Record<Year, string> & { default: string }
    items: React.ReactNode[] | ((year: Year) => React.ReactNode[])
    maxItems?: number
    fontFamily?: string
    titleClassName?: string
}

type BannerProps = {
    year: number
    config: BannerConfig
}

export default function Banner({ year, config }: BannerProps) {
    const {
        title,
        imagesByYear,
        items,
        maxItems = 6,
        fontFamily = 'Staatliches',
        titleClassName = 'tracking-wider',
    } = config

    const imgSrc = imagesByYear[year] ?? imagesByYear.default
    const list = (typeof items === 'function' ? items(year) : items).slice(0, maxItems)

    return (
        <div className="relative">
            <img src={imgSrc} alt="banner" className="w-full object-cover" />

            <div className="absolute bottom-0 w-full pb-8" style={{ fontFamily }}>
                <h3 className={`text-7xl font-bold text-nowrap text-zinc-300 ${titleClassName}`}>{title}</h3>

                <div className="flex gap-x-8">
                    {list.map((node, i) => (
                        <h4 key={i}>{node}</h4>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function YearSelection({ setSelectedYear }: { setSelectedYear: (year: number) => void }) {
    return (
        <>
            <Select onValueChange={(value) => setSelectedYear(Number(value))}>
                <SelectTrigger className="rounded-sm border border-zinc-700 bg-transparent text-zinc-300 hover:bg-transparent hover:text-zinc-100 hover:border-zinc-500">
                    <SelectValue placeholder="Select the year"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Years</SelectLabel>
                        {Array.from({ length: currentYear - 2021 }, (_, i) => 2022 + i).map((year, index) => (
                            <SelectItem key={index} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}
