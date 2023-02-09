import React from "react"
import Mod, { CategoryNames, EnvTags } from "../interfaces/Mod"
import { AspectRatio, Box, Flex, Grid, Image, Text, Title } from "@mantine/core"
import {
    Icon,
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
import numeral from "numeral"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"

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

export const ModCard = (mod: Mod) => {
    const navigate = useNavigate()

    return (
        <Flex
            onClick={() => {
                navigate(`/mod/${mod.name}`)
            }}
            w="100%"
            h="100%"
            px="16px"
            py="16px"
            bg="primary.9"
            gap="16px"
            sx={{ borderRadius: "8px", cursor: "pointer" }}>
            <Image
                maw="128px"
                radius={8}
                src={`${import.meta.env.VITE_ORBIT_THUMBNAIL_URI}${
                    mod.thumbnail_url
                }`}
            />
            <Grid w="100%" justify="space-between">
                <Grid.Col span={8}>
                    {" "}
                    <Flex
                        w="500px"
                        h="100%"
                        direction="column"
                        justify="space-between">
                        <Title order={2}>{mod.name}</Title>
                        <Text mah="3em" lh="1.5em" fz="xl" lineClamp={2}>
                            {mod.summary}
                        </Text>

                        <Flex w="100%" direction="row" gap="8px">
                            {mod.category_tags.map((tag, index) => {
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
                            })}
                        </Flex>
                    </Flex>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Flex
                        w="100%"
                        h="100%"
                        direction="column"
                        align="flex-end"
                        justify="space-between">
                        <Flex gap="4px">
                            <Download />
                            <Title fz="xl" align="right" w="100%">
                                {numeral(mod.downloads).format("0,0a")}{" "}
                                downloads
                            </Title>
                        </Flex>
                        <Flex gap="4px">
                            <Calendar />
                            <Text fw={500}>
                                {`${dayjs(
                                    parseInt(mod.created_on) * 1000,
                                ).format("DD/MM/YYYY")} created on`}
                            </Text>
                        </Flex>
                        <Flex gap="4px">
                            <RefreshCw />
                            <Text fw={500}>
                                {`${dayjs(mod.last_updated * 1000).format(
                                    "DD/MM/YYYY",
                                )} last updated`}
                            </Text>
                        </Flex>
                        <Flex direction="row" gap="8px">
                            {mod.env_tags.map((tag, index) => {
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
                </Grid.Col>
            </Grid>
        </Flex>
    )
}
