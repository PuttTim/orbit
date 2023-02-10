type VersionStages = "alpha" | "beta" | "release"

interface Version {
    // create a Version Interface from exampleVersion
    game_version: string
    stage: VersionStages
    mod_version: string
    timestamp: string
    mod_id: string
    downloads: number
    version_id: string
    file_url: string
    message?: string
}

export type { Version, VersionStages }
