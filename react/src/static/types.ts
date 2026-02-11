export type TrackType = {
    id: number
    title: string
    artist: string
    album: string
    genre: string
    addition_date: string
    duration: string
    small_image: string
    mid_image: string
    big_image:string
	rank: number
    year: number
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

export type GenresCountType = {
    genre: string
    count: number
}

export type MovieType = {
    id: number
    title: string
    original_title: string
    tagline?: string | null
    genre: string
    description: string 
    release_date: string 
    country: string 
	personal_rating: number 
    rating: number 
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

export type TaskType = {
    id?: number
    title: string
    description?: string
    type: string
    difficulty?: number
    status?: string
    created_time?: string
    finished_time?: string
}

export type BookType = {
    id: number
    title: string
    author: string
    isbn: string
    released_year: string
    image: string
    personal_rating?: number | null
    average_rating?: number | null
    description?: string
    language?: string
    country?: string
    price?: string
    web_reader_link?: string
}

export type LeagueTableType = {
    number: number,
    team: string,
    tour: number,
    won: number,
    draw: number,
    lose: number,
    scored: number,
    conceded: number,
    points: number,
}

export type DiaryType = {
	id?: number
    title: string
    description: string
    created_time?: string | null
    record_type: string
}

