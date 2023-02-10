import {
    Box,
    Button,
    Divider,
    Flex,
    Text,
    Title,
    Image,
    Loader,
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
    GitHub,
    Info,
    MessageSquare,
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
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { useAppStore } from "../app/store"

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

const Mod = () => {
    const params = useParams()
    const navigate = useNavigate()
    const {
        data: modFetchData,
        error: modFetchError,
        isLoading: modFetchIsLoading,
    } = useSWR<ModPage, Error>(`mod/${params.mod_name}`, fetcher)
    const {
        data: versionFetchData,
        error: versionFetchError,
        isLoading: versionFetchIsLoading,
    } = useSWR<Version[], Error>(`versions/all/${params.mod_name}`, fetcher)
    const [currentTab, setCurrentTab] = useState<TabItems>(tabs[0])
    const [modData, setModData] = useState<ModPage>()
    const [modVersions, setModVersions] = useState<Version[]>()
    const userData = useAppStore(state => state.data)

    useEffect(() => {
        console.log(typeof modFetchData)
        console.log(modFetchData)
        if (modFetchData) {
            if (modFetchData.message === "No mod found") {
                navigate("/404")
            }

            setModData(modFetchData)
            console.log("mod data set", modData)
        }
    }, [modFetchData])

    useEffect(() => {
        if (versionFetchData) {
            setModVersions(versionFetchData)
        }
    }, [versionFetchData])

    // useEffect(() => {
    //     console.log("useffect", modData)
    // }, [modData])

    // useEffect(() => {
    //     console.log("fetch version", versionFetchData)
    // }, [versionFetchData])

    return (
        <>
            {modFetchIsLoading || modData === undefined ? (
                <Flex
                    direction="column"
                    w="100%"
                    justify="center"
                    align="center"
                    gap="32px"
                    mt="48px">
                    <Loader />
                    <Title>Loading mod page...</Title>
                </Flex>
            ) : (
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
                                src={`${
                                    import.meta.env.VITE_ORBIT_THUMBNAIL_URI
                                }${modData.thumbnail_url}`}
                            />
                            <Flex
                                h="100%"
                                direction="column"
                                justify="space-around">
                                <Title>{modData.name}</Title>
                                <Title
                                    order={5}
                                    fw={500}
                                    mah="6em"
                                    lh="1.5em"
                                    lineClamp={3}>
                                    {modData.summary}
                                </Title>
                                <Flex w="100%" direction="row" gap="8px">
                                    {modData.category_tags.map(
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
                                                                category.name ===
                                                                tag,
                                                        )?.icon
                                                    }
                                                    <Text>{tag}</Text>
                                                </Flex>
                                            )
                                        },
                                    )}
                                    {modData.env_tags.map(
                                        (tag: EnvTags, index: number) => {
                                            return (
                                                <Flex
                                                    gap="4px"
                                                    justify="center"
                                                    align="center"
                                                    key={index}>
                                                    {
                                                        EnvTags.find(
                                                            env =>
                                                                env.name ===
                                                                tag,
                                                        )?.icon
                                                    }
                                                    <Text>{tag}</Text>
                                                </Flex>
                                            )
                                        },
                                    )}
                                </Flex>
                            </Flex>
                        </Flex>
                        <Box
                            w="20rem"
                            bg="accent.4"
                            sx={{ borderRadius: "8px" }}>
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
                                    {numeral(modData.downloads).format("0,0a")}
                                </Title>
                                <Title align="center" order={2} fw={500}>
                                    Total Downloads
                                </Title>
                            </Flex>
                        </Box>
                        <Box
                            w="20rem"
                            bg="highlight.6"
                            sx={{ borderRadius: "8px" }}>
                            <Flex
                                w="100%"
                                h="100%"
                                direction="column"
                                px="16px"
                                gap="8px"
                                justify="center"
                                align="center">
                                <Flex gap="8px" align="center" justify="center">
                                    <Calendar size="48px" />
                                    <Flex direction="column" align="center">
                                        <Title order={4}>Created On</Title>
                                        <Title order={3}>
                                            {dayjs(
                                                parseInt(modData.created_on) *
                                                    1000,
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
                                <Flex gap="8px" align="center" justify="center">
                                    <Flex direction="column" align="center">
                                        <Title order={4}>Last Updated</Title>
                                        <Title order={3}>
                                            {dayjs(
                                                parseInt(modData.last_updated) *
                                                    1000,
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
                            <Flex
                                h="100%"
                                align="center"
                                justify="space-between">
                                <Flex gap="16px">
                                    {tabs.map(
                                        (tab: TabItems, index: number) => (
                                            <Flex key={index}>
                                                <Button
                                                    key={tab.tabValue}
                                                    onClick={() =>
                                                        setCurrentTab(tab)
                                                    }
                                                    variant="subtle"
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
                                                    <Text
                                                        fw={
                                                            tab === currentTab
                                                                ? 700
                                                                : 500
                                                        }
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
                                            </Flex>
                                        ),
                                    )}
                                </Flex>
                            </Flex>
                        </Box>
                        {modData.external_links !== undefined &&
                        modData.external_links.length > 0 ? (
                            <Box
                                bg="primary.9"
                                px="16px"
                                py="16px"
                                sx={{ borderRadius: "8px" }}>
                                <Flex
                                    h="100%"
                                    align="center"
                                    justify="space-between">
                                    <Flex gap="8px">
                                        {modData.external_links.map(
                                            (
                                                linkItem: ExternalLinks,
                                                index: number,
                                            ) => {
                                                return (
                                                    <Flex key={index}>
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
                                                                    color: theme
                                                                        .colors
                                                                        .dark[0],

                                                                    "&:hover": {
                                                                        backgroundColor:
                                                                            theme
                                                                                .colors
                                                                                .secondary[8],
                                                                    },
                                                                },
                                                            })}>
                                                            {linkItem.type.toUpperCase()}
                                                        </Button>
                                                        {modData.external_links?.at(
                                                            -1,
                                                        ) !== linkItem ? (
                                                            <Divider orientation="vertical" />
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Flex>
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
                            py="16px"
                            px="16px"
                            sx={{ borderRadius: "8px" }}>
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => (
                                        <Title order={1} {...props} />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <Title order={2} {...props} />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <Title order={3} {...props} />
                                    ),
                                    h4: ({ node, ...props }) => (
                                        <Title order={4} {...props} />
                                    ),
                                    h5: ({ node, ...props }) => (
                                        <Title order={5} {...props} />
                                    ),
                                    h6: ({ node, ...props }) => (
                                        <Title order={6} {...props} />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <Title order={5} fw={500} {...props} />
                                    ),
                                }}
                                children={`${modData.detail}`}
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            />
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
                                        <Text fw={600}>{modData.creator}*</Text>
                                        <Text> Project Owner</Text>
                                    </Flex>
                                    {modData.contributors
                                        ?.slice(0, 5)
                                        .map((contributor, index) => {
                                            return (
                                                <Flex
                                                    key={index}
                                                    direction="column">
                                                    <Text fw={600}>
                                                        {contributor}
                                                    </Text>
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
                                {versionFetchIsLoading ? (
                                    <Flex justify="center" py="32px">
                                        <Loader />
                                    </Flex>
                                ) : (
                                    <Flex direction="column" gap="8px">
                                        {modVersions
                                            ?.sort((a, b) => {
                                                return b.downloads - a.downloads
                                            })
                                            .slice(0, 3)
                                            .map(
                                                (
                                                    version: Version,
                                                    index: number,
                                                ) => {
                                                    return (
                                                        <VersionCard
                                                            key={index}
                                                            version={version}
                                                            currentMod={modData}
                                                        />
                                                    )
                                                },
                                            )}
                                    </Flex>
                                )}
                            </Flex>
                            {/* TODO: REPLACE WITH USER'S AUTH CHECKING */}
                            {userData !== undefined &&
                            userData["cognito:username"] === modData.creator ? (
                                <>
                                    <Button
                                        leftIcon={<Trash2 />}
                                        styles={theme => ({
                                            root: {
                                                color: theme.colors.dark[0],
                                                backgroundColor:
                                                    theme.colors.red[5],

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
                                                backgroundColor:
                                                    theme.colors.accent[2],

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
            )}
        </>
    )
}

export default Mod
