type EnvTags = "Server" | "Client"

type CategoryTags =
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
    last_updated: number
    game_version: string
    downloads: number
    env_tags: EnvTags[]
    category_tags: CategoryTags[]
}
