export type TrackType = {
    id: number
    title: string
    artist: string
    album: string
    genre: string
    date: string
    duration: string
    image: string
}

export type ArtistType = {
    name: string
    genre: string
    image: string
    followers: number
    popularity: number
}

export type TeamInfo = {
    name: string
    logo: string
}

export type Goal = {
    minute: number
    scorer: string
}

export type TeamStats = {
    xg: number
    shots: number
    shots_on_target: number
    possession: number
    goals: Goal[]
}

export type FootballMatchType = {
    id: number
    team1: TeamInfo & TeamStats
    team2: TeamInfo & TeamStats
    score: string
    stadium: string
    date: string
    tournament: string
    image: string
    stage: string
}

export type ArtistCountType = {
    artist: string
    count: number
}

export type GenresCountType = {
    genre: string
    count: number
}

export type MovieType = {
    id: number
    title: string
    original_title: string
    tagline: string
    genre: string
    description: string
    release_date: number
    country: string
    rating: number
    personal_rating: number
    image: string
}

export type SeriesType = {
    id: number
    title: string
    original_title: string
    tagline: string | null
    genre: string
    description: string
    release_date: string  
    country: string
    rating: number
    personal_rating: number
    image: string
    season_number: number
    episodes_count: number
    season_overview: string
    season_poster: string
}


export type YearData = {
    artist: ArtistType | null
    track: TrackType | null
}

export type AvgRating = {
    rating: number
    personal_rating: number
}

export type UserType = {
    email: string
    username: string
    password: string
}
