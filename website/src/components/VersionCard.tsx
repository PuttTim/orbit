import React from "react"
import { Version } from "../interfaces/Version"
import { Button, Flex, Text, Title } from "@mantine/core"
import dayjs from "dayjs"
import { ModPage } from "../interfaces/Mod"
import { Download } from "react-feather"
import fetcher from "../utils/fetcher"

interface VersionCardProps {
    version: Version
    currentMod?: ModPage
}

const VersionCard = (props: VersionCardProps) => {
    const { version, currentMod } = props

    const incrementDownloadCount = () => {
        fetcher(
            `version/increment/${currentMod?.mod_id}/${version.version_id}`,
        ).then(res => {
            console.log(res)
        })
    }

    return (
        <Flex
            px="8px"
            bg="secondary.4"
            gap="12px"
            justify="space-between"
            align="center"
            sx={{ borderRadius: "8px" }}>
            <Flex
                w="5rem"
                h="3rem"
                bg={
                    version.stage === "release"
                        ? "green"
                        : version.stage === "alpha"
                        ? "pink"
                        : "blue"
                }
                align="center"
                justify="center"
                sx={{
                    borderRadius: "8px",
                }}>
                <Text color="dark">{version.stage.at(0)?.toUpperCase()}</Text>
            </Flex>
            <Flex w="100%" direction="column">
                <Title
                    td="underline"
                    order={
                        5
                    }>{`${currentMod?.name} ${version.mod_version}`}</Title>
                <Title order={6} fw={700}>
                    {`MC ${version.game_version}`}
                </Title>
                <Title order={6} fw={400}>
                    {dayjs(parseInt(version.timestamp) * 1000).format(
                        "DD/MM/YYYY",
                    )}
                </Title>
            </Flex>

            <Button
                onClick={() => {
                    window.open(
                        `${import.meta.env.VITE_ORBIT_VERSION_URI}/${
                            version.file_url
                        }`,
                    )
                    incrementDownloadCount()
                }}
                color="green"
                pl={10}
                pr={0}
                leftIcon={<Download color="green" />}
            />
        </Flex>
    )
}

export default VersionCard
