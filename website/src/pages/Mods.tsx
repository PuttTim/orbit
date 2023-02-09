import { SetStateAction, useEffect, useState, Dispatch } from "react"
import fetcher from "../utils/fetcher"
import useSWR from "swr"
import Mod from "../interfaces/Mod"
import { ModCard } from "../components/ModCard"
import {
    Box,
    Button,
    Center,
    Flex,
    Input,
    Loader,
    Text,
    TextInput,
    Title,
    Select,
} from "@mantine/core"
import { Search } from "react-feather"
import { useDebouncedState } from "@mantine/hooks"

const Mods = () => {
    const { data, error, isLoading } = useSWR<Mod[], Error>(
        "/mods/all",
        fetcher,
    )

    const [allMods, setAllMods] = useDebouncedState<Mod[] | undefined>(
        undefined,
        50,
    )

    const [search, setSearch] = useState<string>("")
    const [sort, setSort] = useState<string | null>("")

    useEffect(() => {
        let resultData

        resultData = data?.filter(mod => {
            return mod.name.toLowerCase().includes(search.toLowerCase())
        })

        switch (sort) {
            case "downloads":
                resultData = resultData?.sort((a, b) => {
                    return b.downloads - a.downloads
                })
                console.log("sort by downloads")
                break
            case "name":
                resultData = resultData?.sort((a, b) => {
                    return a.name.localeCompare(b.name)
                })
                console.log("sort by name")
                break
            case "updated":
                resultData = resultData?.sort((a, b) => {
                    return a.last_updated - b.last_updated
                })
                console.log("sort by updated")
                break
            case "created":
                resultData = resultData?.sort((a, b) => {
                    return parseInt(a.created_on) - parseInt(b.created_on)
                })
                console.log("sort by created")
                break
        }

        setAllMods(resultData)
    }, [search, sort])

    useEffect(() => {
        if (data) {
            console.log(data[0])
            setAllMods(data)
            setSort("downloads")
        }
    }, [data])

    // sort mods array by downloads
    // const sortedMods =

    return (
        <Flex gap="16px" mt="16px">
            <Flex
                w="250px"
                h="100%"
                py="20px"
                px="20px"
                bg="primary.9"
                sx={{ borderRadius: "8px" }}>
                <Title order={2} td="underline">
                    Filter
                </Title>
            </Flex>
            <Flex w="100%" gap="16px" direction="column">
                <Flex
                    w="100%"
                    h="100%"
                    px="20px"
                    py="20px"
                    bg="primary.9"
                    gap="16px"
                    justify="space-between"
                    sx={{ borderRadius: "8px" }}>
                    <Title order={2}>Search</Title>
                    <TextInput
                        w="50%"
                        onChange={event => {
                            setSearch(event.target.value)
                        }}
                        variant="filled"
                        placeholder="Mod name..."
                        styles={theme => ({
                            input: {
                                "::placeholder": {
                                    color: "rgba(255, 255, 255, 0.5)",
                                },
                                color: theme.colors.dark[0],
                                backgroundColor: theme.colors.secondary[7],

                                "&:hover": {
                                    backgroundColor: theme.colors.secondary[8],
                                },
                            },
                        })}
                    />
                    {/* <Button leftIcon={<Search />} color="accent.4" onClick={()}>
                        <Text fz="xl">Search</Text>
                    </Button> */}
                    <Title order={2} w="fill">
                        Sort By:
                    </Title>
                    <Select
                        onChange={setSort}
                        w="20%"
                        transitionDuration={100}
                        placeholder="Sort by"
                        defaultValue={"downloads"}
                        value={sort}
                        data={[
                            { label: "Most Downloads", value: "downloads" },
                            { label: "Name", value: "name" },
                            { label: "Recently Updated", value: "updated" },
                            { label: "Recently Created", value: "created" },
                        ]}
                        styles={theme => ({
                            input: {
                                color: theme.colors.dark[0],
                                backgroundColor: theme.colors.secondary[9],
                            },
                            dropdown: {
                                backgroundColor: theme.colors.secondary[9],
                                color: theme.colors.dark[0],
                            },
                            item: {
                                // applies styles to selected item
                                "&[data-selected]": {
                                    "&, &:hover": {
                                        backgroundColor: theme.colors.accent[2],
                                        color: theme.white,
                                    },
                                },

                                // applies styles to hovered item (with mouse or keyboard)
                                "&[data-hovered]": {
                                    "&, &:hover": {
                                        backgroundColor: theme.colors.accent[5],
                                        color: theme.white,
                                    },
                                },
                            },
                        })}
                    />
                </Flex>
                {isLoading ? (
                    <Flex
                        direction="column"
                        w="100%"
                        justify="center"
                        align="center"
                        gap="32px"
                        mt="48px">
                        <Loader />
                        <Title>Loading mods...</Title>
                    </Flex>
                ) : (
                    <Flex direction="column" gap="16px" w="100%">
                        {allMods?.map(mod => {
                            return <ModCard key={mod.mod_id} {...mod} />
                        })}
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
}

export default Mods
