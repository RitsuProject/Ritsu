declare module 'anilist-node' {
  export interface AiringEntry {
    airingAt: number
    timeUntilAiring: number
    episode: number
  }

  export interface AnimeEntry {
    airingSchedule: AiringEntry[]
    autoCreateForumThread: boolean
    averageScore: number
    bannerImage: string
    characters: PersonRelation[]
    countryOfOrigin: string
    coverImage: {
      large: string
      medium: string
      small: string
      color: string
    }
    description: string
    duration: number
    endDate: Date
    episodes: number
    externalLinks: string[]
    favourites: number
    format: string
    genres: string[]
    hashtag: string
    id: number
    idMal: number
    isAdult: boolean
    isFavourite: boolean
    isLicensed: boolean
    meanScore: boolean
    mediaListEntry: {
      id: number
      status: string
    }
    modNotes: string
    nextAiringEpisode: AiringEntry[] | null
    popularity: number
    rankings: {
      rank: number
      type: 'RATED' | 'POPULAR'
      context: string
      year: number
      season: 'WINTER' | 'SUMMER' | 'SPRING' | 'FALL'
    }[]
    recommendations: MediaRelation[]
    relations: MediaRelation[]
    reviews: {
      id: number
      score: number
      summary: string
      body: string
    }[]
    season: string
    seasonYear: number
    siteUrl: string
    source: string
    staff: PersonRelation[]
    startDate: Date
    stats: {
      scoreDistribution: {
        score: number
        amount: amount
      }
      statusDistribution: {
        status: number
        amount: number
      }
    }
    status: string
    streamingEpisodes: {
      title: string
      thumbnails: string
      url: string
      site: string
    }[]
    studios: {
      id: number
      name: string
      isAnimationStudio: boolean
    }[]
    synonyms: string[]
    tags: {
      name: string
      isMediaSpoiler: boolean
    }[]
    title: MediaTitle
    trailer: string | Record<string, unknown> | null
    trending: number
    trends: {
      date: number
      trending: number
      popularity: number | null
      inProgress: number | null
    }[]
    updatedAt: number
  }

  export interface CharacterEntry {
    id: number
    name: PersonName
    image: Record<string, unknown>
    description: string
    isFavourite: boolean
    siteUrl: string
    favourites: number
    media: MediaRelation[]
  }

  export interface ListActivity {
    id: number
    status: string
    type: string
    progress: number | null
    media: MediaRelation
    createdAt: number
    likeCount: number
    replies: Reply[]
  }

  export interface ListEntry {
    media: {
      id: number
      idMal: number
      title: MediaTitle
      description: string
      format: string
      tags: {
        name: string
        isMediaSpoiler: boolean
      }[]
      startDate: number
      endDate: number
      genres: string[]
      isFavourite: boolean
      isAdult: boolean
      synonyms: string[]
      siteUrl: string
      duration: number
      episodes: number
      volumes: number
      chapters: number
    }
    status:
      | 'CURRENT'
      | 'PLANNING'
      | 'COMPLETED'
      | 'PAUSED'
      | 'DROPPED'
      | 'REPEATING'
    score: number
    progress: number
    progressVolumes: number
    repeat: number
    priority: number
    private: boolean
    notes: string[]
    hiddenFromStatusLists: boolean
    advancedScores: Record<string, unknown>
    dates: {
      startedAt: string
      completedAt: string
      updatedAt: string
      createdAt: string
    }
  }

  export interface MangaEntry {
    autoCreateForumThread: boolean
    averageScore: number
    bannerImage: string
    chapters: number
    characters: PersonRelation
    countryOfOrigin: string
    coverImage: {
      large: string
      medium: string
      small: string
      color: string
    }[]
    description: string
    endDate: Date
    externalLinks: string[]
    favourites: number
    format: string
    genres: string[]
    id: number
    idMal: number
    isAdult: boolean
    isFavourite: boolean
    isLicensed: boolean
    meanScore: number
    mediaListEntry: {
      id: number
      status: string
    }
    modNotes: string
    popularity: number
    rankings: {
      rank: number
      type: 'RATED' | 'POPULAR'
      context: string
      year: number
      season: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'
    }[]
    recommendations: MediaRelation[]
    relations: MediaRelation[]
    reviews: {
      id: number
      score: number
      summary: string
      body: string
    }[]
    siteUrl: string
    staff: PersonRelation[]
    startDate: Date
    stats: {
      scoreDistribution: {
        score: number
        amount: amount
      }
      statusDistribution: {
        status: number
        amount: number
      }
    }
    status: string
    synonyms: string[]
    tags: {
      name: string
      isMediaSpoiler: boolean
    }[]
    title: MediaTitle
    trending: number
    trends: {
      date: number
      trending: number
      popularity: number | null
      inProgress: number | null
    }[]
    updatedAt: number
    volumes: number
  }

  export interface MediaRelation {
    id: number
    title: MediaTitle
    type: string
  }

  export interface MediaTitle {
    english: string
    native: string
    romaji: string
    userPreferred: string
  }

  export interface MessageActivity {
    id: number
    recipientId: number
    message: string
    type: string
    createdAt: number
    likeCount: number
    replies: Reply[]
  }

  export interface PersonName {
    english: string
    native: string
    alternative: string[]
  }

  export interface PersonRelation {
    id: number
    name: {
      english: string
    }
  }

  export interface Reply {
    id: number
    text: string
    likeCount: number
  }

  export interface SearchEntry {
    pageInfo: {
      total: number
      currentPage: number
      lastPage: number
      hasNextPage: boolean
      perPage: number
    }
    media: {
      id: number
      title: MediaTitle
      name: PersonName
      name: string
    }[]
  }

  export interface StaffEntry {
    id: number
    name: PersonName
    image: Record<string, unknown>
    description: string
    isFavourite: boolean
    siteUrl: string
    favourites: number
    language: string
    staffMedia: MediaRelation[]
    characters: PersonRelation[]
  }

  export interface StudioEntry {
    id: number
    name: string
    isAnimationStudio: boolean
    favourites: number
    media: {
      id: number
      title: MediaTitle
    }[]
    siteUrl: string
    isFavourite: boolean
  }

  export interface TextActivity {
    id: number
    userId: number
    text: string
    type: string
    createdAt: number
    likeCount: number
    replies: Reply[]
  }

  export interface UserList {
    name: string
    isCustomList: boolean
    isSplitCompletedList: boolean
    status: 'CURRENT' | 'PLANNING' | 'PAUSED' | 'DROPPED' | 'REPEATING'
    entries: ListEntry[]
  }

  export interface UserProfile {
    id: number
    name: string
    about: string
    avatar: {
      large: string
      medium: string
    }
    bannerImage: string
    isFollowing: boolean
    isBlocked: boolean
    isFollower: boolean
    bans: string[]
    options: {
      titleLanguage: string
      displayAdultContent: boolean
      airingNotifications: boolean
      profileColor: string
    }
    mediaListOptions: {
      scoreFormat: string
      rowOrder: string
      animeList: {
        sectionOrder: string[]
        splitCompletedSectionByFormat: boolean
        customLists: string[]
        advancedScoring: string[]
        advancedScoringEnabled: boolean
      }
      mangaList: {
        sectionOrder: string[]
        splitCompletedSectionByFormat: boolean
        customLists: string[]
        advancedScoring: string[]
        advancedScoringEnabled: boolean
      }
      favourites: {
        anime: MediaRelation[]
        manga: MediaRelation[]
        characters: PersonRelation[]
        staff: PersonRelation[]
        studios: {
          id: number
          name: string
        }[]
      }
      unreadNotificationCount: number
      siteUrl: string
      donatorTier: number
      moderatorStatus: string
      updatedAt: number
    }
  }

  export interface UserRelation {
    id: number
    name: string
  }

  export interface UserStats {
    anime: {
      meanScore: number
      standardDeviation: number
      count: number
      minutesWatched: number
      episodesWatched: number
      statuses: {
        count: number
        meanScore: number
        watchedTime: number
        status: string
      }[]
      formats: {
        count: number
        meanScore: number
        watchedTime: number
        format: string
      }[]
      lengths: {
        count: number
        meanScore: number
        watchedTime: number
        length: string
      }[]
      releaseYears: {
        count: number
        meanScore: number
        watchedTime: number
        releaseYear: string
      }[]
      startYears: {
        count: number
        meanScore: number
        watchedTime: number
        startYear: string
      }[]
      genres: {
        count: number
        meanScore: number
        watchedTime: number
        genre: string
      }[]
      tags: {
        count: number
        meanScore: number
        watchedTime: number
        tag: {
          id: number
          name: string
        }
      }[]
      countries: {
        count: number
        meanScore: number
        watchedTime: number
        country: string
      }[]
      voiceActors: {
        count: number
        meanScore: number
        watchedTime: number
        voiceActor: PersonRelation
      }[]
      staff: {
        count: number
        meanScore: number
        watchedTime: number
        staff: PersonRelation
      }[]
      studios: {
        count: number
        meanScore: number
        watchedTime: number
        studio: {
          id: number
          name: string
        }
      }[]
    }
    manga: {
      meanScore: number
      standardDeviation: number
      count: number
      chaptersRead: number
      volumesRead: number
      statuses: {
        count: number
        meanScore: number
        watchedTime: number
        status: string
      }[]
      formats: {
        count: number
        meanScore: number
        watchedTime: number
        format: string
      }[]
      lengths: {
        count: number
        meanScore: number
        watchedTime: number
        length: string
      }[]
      releaseYears: {
        count: number
        meanScore: number
        watchedTime: number
        releaseYear: string
      }[]
      startYears: {
        count: number
        meanScore: number
        watchedTime: number
        startYear: string
      }[]
      genres: {
        count: number
        meanScore: number
        watchedTime: number
        genre: string
      }[]
      tags: {
        count: number
        meanScore: number
        watchedTime: number
        tag: {
          id: number
          name: string
        }
      }[]
      countries: {
        count: number
        meanScore: number
        watchedTime: number
        country: string
      }[]
      voiceActors: {
        count: number
        meanScore: number
        watchedTime: number
        voiceActor: PersonRelation
      }[]
      staff: {
        count: number
        meanScore: number
        watchedTime: number
        staff: PersonRelation
      }[]
    }
  }

  export interface MediaFilterTypes {
    id?: number
    idMal?: number
    startDate?: number
    endDate?: number
    season?: 'WINTER' | 'SUMMER' | 'SPRING' | 'FALL'
    seasonYear?: number
    type?: 'ANIME' | 'MANGA'
    // TODO: Make everything like this in a Enum.
    format?:
      | 'TV'
      | 'TV_SHORT'
      | 'MOVIE'
      | 'SPECIAL'
      | 'OVA'
      | 'ONA'
      | 'MUSIC'
      | 'MANGA'
      | 'NOVEL'
      | 'ONE_SHOT'
    status?:
      | 'FINISHED'
      | 'RELEASING'
      | 'NOT_YET_RELEASED'
      | 'CANCELLED'
      | 'HIATUS'
    episodes?: number
    duration?: number
    chapters?: number
    volumes?: number
    isAdult?: boolean
    genre?: string
    tag?: number
    minimumTagRank?: number
    tagCategory?: string
    onList?: boolean
    licensedBy?: string
    averageScore?: number
    popularity?: number
    // feel free todo the rest: https://katsurin.com/docs/anilist-node/global.html#MediaFilterTypes
  }

  export default class Anilist {
    public lists: Lists

    public media: Media

    public people: People

    public user: User

    public searchEntry: SearchEntry

    public constructor(accessKey?: string)

    public search(
      type: 'anime' | 'manga' | 'character' | 'staff' | 'studio' | 'user',
      term: string,
      page?: number,
      amount?: number
    ): Promise<SearchEntry>

    public studio(studio: string | number): Promise<StudioEntry>
  }

  class SearchEntry {
    public anime(
      term: string,
      filter: MediaFilterTypes,
      page?: number,
      amount?: number
    ): Promise<SearchEntry>
  }

  class Lists {
    public anime(user: number | string): Promise<UserList>

    public manga(user: number | string): Promise<UserList>
  }

  class Media {
    public anime(id: number): Promise<AnimeEntry>

    public manga(id: number): Promise<MangaEntry>
  }

  class People {
    public character(id: number | string): Promise<CharacterEntry>

    public staff(id: number | string): Promise<StaffEntry>
  }

  class User {
    public all(
      user: number | string
    ): Promise<UserProfile & { statistics: UserStats }>

    public getRecentActivity(
      user: number
    ): Promise<(ListActivity | TextActivity | MessageActivity)[]>

    public profile(user: number | string): Promise<UserProfile>

    public stats(user: number | string): Promise<UserStats>
  }
}
