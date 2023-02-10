import {
    Box,
    Button,
    Container,
    Divider,
    Flex,
    Grid,
    Space,
    Text,
    Title,
    Image,
} from "@mantine/core"
import fetcher from "../utils/fetcher"
import useSWR from "swr"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import {
    CategoryNames,
    ExternalLinks,
    LinkNames,
    ModPage,
    EnvTags,
} from "../interfaces/Mod"
import {
    Edit2,
    Edit3,
    GitHub,
    Info,
    MessageSquare,
    Trash,
    Trash2,
    Box as BoxIcon,
    Compass,
    Home,
    Edit,
    Zap,
    Cpu,
    Bookmark,
    Map,
    Download,
    RefreshCw,
    Calendar,
    Monitor,
    Server,
} from "react-feather"
import { Version } from "../interfaces/Version"
import dayjs from "dayjs"
import VersionCard from "../components/VersionCard"
import numeral from "numeral"

interface TabItems {
    tabName: string
    tabValue: string
}

interface LinkIcon {
    type: LinkNames
    icon: any
}

const tabs: TabItems[] = [
    {
        tabName: "Details",
        tabValue: "details",
    },
    {
        tabName: "Versions",
        tabValue: "versions",
    },
    {
        tabName: "Comments",
        tabValue: "comments",
    },
]

const LinkIcons: LinkIcon[] = [
    {
        type: "discord",
        icon: <MessageSquare />,
    },
    {
        type: "wiki",
        icon: <Info />,
    },
    {
        type: "github",
        icon: <GitHub />,
    },
]

interface TagIcon {
    name: CategoryNames | EnvTags
    icon: any
}

const CategoryTags: TagIcon[] = [
    {
        name: "Adventure",
        icon: <Compass />,
    },
    {
        name: "Building",
        icon: <Home />,
    },
    {
        name: "Decoration",
        icon: <BoxIcon />,
    },
    {
        name: "Magic",
        icon: <Edit />,
    },
    {
        name: "Optimisation",
        icon: <Zap />,
    },
    {
        name: "Technology",
        icon: <Cpu />,
    },
    {
        name: "Utility",
        icon: <Bookmark />,
    },
    {
        name: "World Generation",
        icon: <Map />,
    },
]

const EnvTags: TagIcon[] = [
    {
        name: "Client",
        icon: <Monitor />,
    },
    {
        name: "Server",
        icon: <Server />,
    },
]

const mod: ModPage = {
    detail: "#Optimisation Mod for your game\n**Optimise your performance with an easy to install mod**\nInstallation instructions:\n--\n",
    summary: "Optimises your game on the client side",
    creator: "mezz",
    thumbnail_url: "/thumbnail/4w81f55d90ly/icon.png",
    mod_id: "4w81f55d90ly",
    category_tags: ["Optimisation", "Utility"],
    env_tags: ["Client"],
    external_links: [
        {
            link: "https://jellysquid.me/discord",
            type: "discord",
        },
        {
            link: "https://github.com/CaffeineMC/lithium-fabric/wiki",
            type: "wiki",
        },
        {
            link: "https://github.com/CaffeineMC/lithium-fabric",
            type: "github",
        },
    ],
    name: "JEI",
    contributors: ["CFGrafanaStats"],
    created_on: "1672965740",
    last_updated: "1623965325",
    downloads: 20000,
}

const modVersions: Version[] = [
    {
        game_version: "1.7.10",
        stage: "beta",
        mod_version: "2.4.2",
        timestamp: "1666965625",
        mod_id: "345a8829fde0",
        downloads: 50000,
        version_id: "e068eaaf",
        file_url: "345a8829fde0/Decocraft-2.4.2_1.7.10.jar",
    },
    {
        game_version: "1.7.10",
        stage: "release",
        mod_version: "2.4.1",
        timestamp: "1616965295",
        mod_id: "345a8829fde0",
        downloads: 2300,
        version_id: "28ba67ff",
        file_url: "345a8829fde0/Decocraft-2.4.2_1.7.10.jar",
    },
    {
        game_version: "1.8.19",
        stage: "release",
        mod_version: "3.6.23",
        timestamp: "1665965255",
        mod_id: "345a8829fde0",
        downloads: 780005,
        version_id: "ff178445",
        file_url: "345a8829fde0/Decocraft-2.4.2_1.7.10.jar",
    },
    {
        game_version: "1.8.9",
        stage: "beta",
        mod_version: "0.6.1",
        timestamp: "1672367225",
        mod_id: "345a8829fde0",
        downloads: 1230,
        version_id: "7d8563a5",
        file_url: "345a8829fde0/Decocraft-2.4.2_1.7.10.jar",
    },
    {
        game_version: "1.7.10",
        stage: "alpha",
        mod_version: "2.3.1",
        timestamp: "1665965245",
        mod_id: "345a8829fde0",
        downloads: 12372,
        version_id: "b4a2bc48",
        file_url: "345a8829fde0/Decocraft-2.4.2_1.7.10.jar",
    },
]

const Mod = () => {
    const params = useParams()
    const navigate = useNavigate()
    const { data, error, isLoading } = useSWR<ModPage, Error>(
        `mod/${params.mod_name}`,
        fetcher,
    )
    const [currentTab, setCurrentTab] = useState<TabItems>(tabs[0])

    useEffect(() => {
        console.log(typeof data)
        console.log(data)
        if (data) {
            if (data.message === "No mod found") {
                navigate("/404")
            }
        }
    }, [data])

    useEffect(() => {
        console.log(error)
    }, [error])

    return (
        <Flex direction="column" mt="16px" w="100%" gap="20px">
            <Flex justify="center" gap="20px">
                <Flex
                    w="60rem"
                    bg="primary.9"
                    px="16px"
                    py="16px"
                    align="flex-start"
                    gap="16px"
                    sx={{ borderRadius: "8px" }}>
                    <Image
                        radius={8}
                        maw="10rem"
                        src={`${import.meta.env.VITE_ORBIT_THUMBNAIL_URI}${
                            mod.thumbnail_url
                        }`}
                    />
                    <Flex h="100%" direction="column" justify="space-around">
                        <Title>{mod.name}</Title>
                        <Title
                            order={5}
                            fw={500}
                            mah="6em"
                            lh="1.5em"
                            lineClamp={3}>
                            {mod.summary}
                        </Title>
                        <Flex w="100%" direction="row" gap="8px">
                            {mod.category_tags.map(
                                (tag: CategoryNames, index: number) => {
                                    return (
                                        <Flex
                                            gap="4px"
                                            justify="center"
                                            align="center"
                                            key={index}>
                                            {
                                                CategoryTags.find(
                                                    category =>
                                                        category.name === tag,
                                                )?.icon
                                            }
                                            <Text>{tag}</Text>
                                        </Flex>
                                    )
                                },
                            )}
                            {mod.env_tags.map((tag: EnvTags, index: number) => {
                                return (
                                    <Flex
                                        gap="4px"
                                        justify="center"
                                        align="center"
                                        key={index}>
                                        {
                                            EnvTags.find(
                                                env => env.name === tag,
                                            )?.icon
                                        }
                                        <Text>{tag}</Text>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </Flex>
                </Flex>
                <Box w="20rem" bg="accent.4" sx={{ borderRadius: "8px" }}>
                    <Flex
                        w="100%"
                        h="100%"
                        px="16px"
                        direction="column"
                        justify="center"
                        align="center"
                        gap="8px">
                        <Download size="48px" />
                        <Title order={2} fw={500}>
                            {numeral(mod.downloads).format("0,0a")}
                        </Title>
                        <Title align="center" order={2} fw={500}>
                            Total Downloads
                        </Title>
                    </Flex>
                </Box>
                <Box w="20rem" bg="highlight.6" sx={{ borderRadius: "8px" }}>
                    <Flex
                        w="100%"
                        h="100%"
                        direction="column"
                        px="16px"
                        gap="8px"
                        justify="center"
                        align="center">
                        <Flex gap="8px">
                            <Calendar size="48px" />
                            <Flex direction="column" align="center">
                                <Title order={4}>Created On</Title>
                                <Title order={3}>
                                    {dayjs(
                                        parseInt(mod.created_on) * 1000,
                                    ).format("DD/MM/YYYY")}
                                </Title>
                            </Flex>
                        </Flex>
                        <Divider
                            w="80%"
                            size="md"
                            color="dark.0"
                            sx={{ borderRadius: "16px" }}
                        />
                        <Flex gap="8px">
                            <Flex direction="column" align="center">
                                <Title order={4}>Last Updated</Title>
                                <Title order={3}>
                                    {dayjs(
                                        parseInt(mod.last_updated) * 1000,
                                    ).format("DD/MM/YYYY")}
                                </Title>
                            </Flex>
                            <RefreshCw size="48px" />
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
            <Flex h="5vh" justify="space-between" gap="16px">
                <Box
                    bg="primary.9"
                    px="16px"
                    py="16px"
                    sx={{ borderRadius: "8px" }}>
                    <Flex h="100%" align="center" justify="space-between">
                        <Flex gap="16px">
                            {tabs.map((tab: TabItems, index: number) => (
                                <>
                                    <Button
                                        key={tab.tabValue}
                                        onClick={() => setCurrentTab(tab)}
                                        variant="subtle"
                                        styles={theme => ({
                                            root: {
                                                color: theme.colors.dark[0],

                                                "&:hover": {
                                                    backgroundColor:
                                                        theme.colors
                                                            .secondary[8],
                                                },
                                            },
                                        })}>
                                        <Text
                                            fw={tab === currentTab ? 700 : 500}
                                            td={
                                                tab === currentTab
                                                    ? "underline"
                                                    : "none"
                                            }
                                            fz="lg">
                                            {tab.tabName}
                                        </Text>
                                    </Button>
                                    {index !== tabs.length - 1 ? (
                                        <Divider orientation="vertical" />
                                    ) : (
                                        <></>
                                    )}
                                </>
                            ))}
                        </Flex>
                    </Flex>
                </Box>
                {mod.external_links !== undefined ? (
                    <Box
                        bg="primary.9"
                        px="16px"
                        py="16px"
                        sx={{ borderRadius: "8px" }}>
                        <Flex h="100%" align="center" justify="space-between">
                            <Flex gap="8px">
                                {mod.external_links.map(
                                    (
                                        linkItem: ExternalLinks,
                                        index: number,
                                    ) => {
                                        return (
                                            <>
                                                <Button
                                                    leftIcon={
                                                        LinkIcons.find(
                                                            icon =>
                                                                icon.type ===
                                                                linkItem.type,
                                                        )?.icon
                                                    }
                                                    color="dark.0"
                                                    variant="subtle"
                                                    component="a"
                                                    href={linkItem.link}
                                                    styles={theme => ({
                                                        root: {
                                                            color: theme.colors
                                                                .dark[0],

                                                            "&:hover": {
                                                                backgroundColor:
                                                                    theme.colors
                                                                        .secondary[8],
                                                            },
                                                        },
                                                    })}>
                                                    {linkItem.type.toUpperCase()}
                                                </Button>
                                                {mod.external_links?.at(-1) !==
                                                linkItem ? (
                                                    <Divider orientation="vertical" />
                                                ) : (
                                                    <></>
                                                )}
                                            </>
                                        )
                                    },
                                )}
                            </Flex>
                        </Flex>
                    </Box>
                ) : (
                    <></>
                )}
            </Flex>

            <Flex gap="20px">
                <Box
                    w="70rem"
                    h="100%"
                    bg="primary.9"
                    sx={{ borderRadius: "8px" }}>
                    a
                </Box>
                <Flex w="30rem" h="100%" direction="column" gap="20px">
                    <Flex
                        py="8px"
                        px="8px"
                        direction="column"
                        bg="primary.9"
                        h="100%"
                        gap="8px"
                        sx={{ borderRadius: "8px" }}>
                        <Title order={3} td="underline">
                            Project Members:
                        </Title>
                        <Flex direction="column" gap="4px">
                            <Flex direction="column">
                                <Text fw={600}>{mod.creator}*</Text>
                                <Text> Project Owner</Text>
                            </Flex>
                            {mod.contributors
                                ?.slice(0, 5)
                                .map((contributor, index) => {
                                    return (
                                        <Flex direction="column">
                                            <Text fw={600}>{contributor}</Text>
                                            <Text> Contributor</Text>
                                        </Flex>
                                    )
                                })}
                        </Flex>
                    </Flex>
                    <Flex
                        py="8px"
                        px="8px"
                        direction="column"
                        bg="primary.9"
                        h="100%"
                        gap="16px"
                        sx={{ borderRadius: "8px" }}>
                        <Title order={3} td="underline">
                            Mod Versions:
                        </Title>
                        <Flex direction="column" gap="8px">
                            {modVersions
                                .sort((a, b) => {
                                    return b.downloads - a.downloads
                                })
                                .slice(0, 3)
                                .map((version: Version, index: number) => {
                                    return (
                                        <VersionCard
                                            version={version}
                                            currentMod={mod}
                                        />
                                    )
                                })}
                        </Flex>
                    </Flex>
                    {/* TODO: REPLACE WITH USER'S AUTH CHECKING */}
                    {true ? (
                        <>
                            <Button
                                leftIcon={<Trash2 />}
                                styles={theme => ({
                                    root: {
                                        color: theme.colors.dark[0],
                                        backgroundColor: theme.colors.red[5],

                                        "&:hover": {
                                            backgroundColor:
                                                theme.colors.red[8],
                                        },
                                    },
                                })}>
                                Delete Project
                            </Button>
                            <Button
                                leftIcon={<Edit />}
                                styles={theme => ({
                                    root: {
                                        color: theme.colors.dark[0],
                                        backgroundColor: theme.colors.accent[2],

                                        "&:hover": {
                                            backgroundColor:
                                                theme.colors.accent[5],
                                        },
                                    },
                                })}>
                                Edit Page
                            </Button>
                        </>
                    ) : (
                        <></>
                    )}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Mod
