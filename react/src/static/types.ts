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

export type TeamInfo = {
    name: string
    logo: string
}

export type FootballMatchType = {
    id: number
    team1: TeamInfo
    team2: TeamInfo
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
