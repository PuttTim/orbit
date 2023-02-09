import { useEffect } from "react"
import fetcher from "../utils/fetcher"
import useSWR from "swr"
import Mod from "../interfaces/Mod"
import { ModCard } from "../components/ModCard"
import { Box, Flex, Text, Title } from "@mantine/core"

const Mods = () => {
    const { data, error, isLoading } = useSWR<Mod[], Error>(
        "/mods/all",
        fetcher,
    )

    useEffect(() => {
        if (data) {
            console.log(data[0])
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
                <Title order={1} td="underline">
                    Filter
                </Title>
            </Flex>
            <>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <Flex direction="column" gap="16px" w="100%">
                        {data
                            ?.sort((a, b) => {
                                return a.downloads - b.downloads
                            })
                            .map(mod => {
                                return <ModCard key={mod.mod_id} {...mod} />
                            })}
                    </Flex>
                )}
            </>
        </Flex>
    )
}

export default Mods
