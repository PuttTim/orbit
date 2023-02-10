type EnvTags = "Server" | "Client"

type CategoryNames =
    | "Adventure"
    | "Building"
    | "Decoration"
    | "Magic"
    | "Optimisation"
    | "Technology"
    | "Utility"
    | "World Generation"

interface Mod {
    // create a Mod Interface from exampleMod
    mod_id: string
    name: string
    summary: string
    creator: string
    created_on: string
    thumbnail_url: string
    last_updated: number
    game_version: string
    downloads: number
    env_tags: EnvTags[]
    category_tags: CategoryNames[]
}

interface ModPage {
    // create a ModPage Interface from exampleModPage
    detail: string
    summary: string
    creator: string
    thumbnail_url: string
    mod_id: string
    category_tags: CategoryNames[]
    env_tags: EnvTags[]
    external_links: string[]
    name: string
    contributors: string
    created_on: string
    downloads: number
    message?: string
}

export type { Mod, ModPage }
export type { EnvTags, CategoryNames }
