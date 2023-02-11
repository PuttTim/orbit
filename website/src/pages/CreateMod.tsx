import {
    Flex,
    Title,
    Accordion,
    AccordionControlProps,
    Box,
    ActionIcon,
    Button,
    MantineTheme,
    FileInput,
    Text,
    Image,
    AspectRatio,
    Dialog,
} from "@mantine/core"
import { useEffect, useState } from "react"
import { Check, Trash, Upload, X } from "react-feather"
import useSWR from "swr"
import fetcher from "../utils/fetcher"

interface DialogText {
    content: string
    type: "error" | "success"
}

const CreateMod = () => {
    const [versionFormStatus, setVersionFormStatus] = useState<boolean>(true)
    const [thumbnailUploadStatus, setThumbnailUploadStatus] =
        useState<boolean>(false)
    const [modFormStatus, setModFormStatus] = useState<boolean>(false)
    const [modId, setModId] = useState<string>("")
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [opened, setOpened] = useState<boolean>(false)
    const [dialogText, setDialogText] = useState<DialogText>()

    const uploadThumbnail = () => {
        if (thumbnailFile !== null) {
            fetcher(`mod/new_thumbnail/${modId}`)
                .then(res => {
                    const url = res.url
                    fetch(url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "image/png",
                        },
                        body: thumbnailFile,
                    }).then(res => {
                        console.log("Uploaded thumbnail")
                        setThumbnailUploadStatus(true)
                        setDialogText({
                            content: "Thumbnail uploaded successfully",
                            type: "success",
                        })
                        setOpened(true)
                    })
                })
                .catch(err => {
                    console.log(err)
                    setDialogText({
                        content: "Failed to upload thumbnail",
                        type: "error",
                    })
                })
        }
    }

    useEffect(() => {
        fetcher("/mod/generate_id").then(res => {
            setModId(res.mod_id)
        })
    }, [])

    useEffect(() => {
        if (opened) {
            setTimeout(() => {
                setOpened(false)
            }, 2000)
        }
    }, [opened])

    return (
        <>
            <Dialog
                bg={dialogText?.type === "error" ? "highlight.0" : "green.8"}
                opened={opened}
                onClose={() => {
                    setOpened(false)
                    setDialogText(undefined)
                }}>
                <Flex
                    gap="20px"
                    onClick={() => {
                        setOpened(false)
                    }}
                    sx={{ borderRadius: "8px", cursor: "pointer" }}>
                    {dialogText?.type === "error" ? (
                        <X color="white" size={24} />
                    ) : (
                        <Check color="white" size={24} />
                    )}
                    <Title order={5}>{dialogText?.content}</Title>
                </Flex>
            </Dialog>
            <Flex
                direction="column"
                mt="16px"
                py="16px"
                px="16px"
                bg="primary.9"
                gap="20px"
                sx={{ borderRadius: "8px" }}>
                <Title order={1} td="underline">
                    Create a new Mod Project
                </Title>
                <Accordion
                    transitionDuration={200}
                    defaultValue="version"
                    radius={8}
                    variant="separated"
                    styles={theme => ({
                        control: {
                            "&:hover": {
                                borderRadius: "8px",
                                backgroundColor: theme.colors.secondary[3],
                            },
                        },
                        item: {
                            backgroundColor: theme.colors.primary[9],
                            "&[data-active]": {
                                backgroundColor: theme.colors.secondary[3],
                                border: "none",
                            },
                            "&:hover": {
                                borderRadius: "8px",
                            },
                        },
                    })}>
                    <Accordion.Item value="version">
                        <Accordion.Control>
                            <Flex
                                justify="flex-start"
                                align="center"
                                gap="16px">
                                {versionFormStatus ? (
                                    <Check color="green" />
                                ) : (
                                    <X color="red" />
                                )}
                                <Title order={3} fw={500}>
                                    Create & upload a Version Release
                                </Title>
                            </Flex>
                        </Accordion.Control>
                        <Accordion.Panel>AA</Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="thumbnail">
                        <Accordion.Control>
                            <Flex
                                justify="flex-start"
                                align="center"
                                gap="16px">
                                {thumbnailUploadStatus ? (
                                    <Check color="green" />
                                ) : (
                                    <X color="red" />
                                )}
                                <Title order={3} fw={500}>
                                    Upload Mod Thumbnail
                                </Title>
                            </Flex>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Flex direction="column" gap="16px">
                                <Text fz="lg">
                                    Thumbnail File{" "}
                                    <Text span color="red.8">
                                        *
                                    </Text>
                                </Text>
                                <FileInput
                                    onChange={(files: File | null) => {
                                        setThumbnailFile(files)
                                    }}
                                    value={thumbnailFile}
                                    icon={<Upload />}
                                    accept="
                                        image/png"
                                    variant="filled"
                                    placeholder="Select a Thumbnail to upload..."
                                    styles={theme => ({
                                        input: {
                                            backgroundColor:
                                                theme.colors.primary[9],
                                        },
                                    })}
                                />
                                <Text fz="lg">Preview</Text>
                                <Flex align="center" gap="20px">
                                    <AspectRatio
                                        ratio={160 / 160}
                                        w="240px"
                                        h="240px">
                                        <Image
                                            src={
                                                thumbnailFile !== null
                                                    ? URL.createObjectURL(
                                                          thumbnailFile,
                                                      )
                                                    : ""
                                            }
                                            withPlaceholder
                                        />
                                    </AspectRatio>
                                    <Button
                                        onClick={() => {
                                            setThumbnailFile(null)
                                        }}
                                        color="red.8"
                                        leftIcon={<Trash />}>
                                        Remove
                                    </Button>
                                </Flex>

                                <Button
                                    onClick={uploadThumbnail}
                                    disabled={thumbnailFile === null}
                                    color="accent.2"
                                    size="lg">
                                    UPLOAD
                                </Button>
                            </Flex>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="mod">
                        <Accordion.Control>
                            <Flex
                                justify="flex-start"
                                align="center"
                                gap="16px">
                                {modFormStatus ? (
                                    <Check color="green" />
                                ) : (
                                    <X color="red" />
                                )}
                                <Title order={3} fw={500}>
                                    Enter Mod Details
                                </Title>{" "}
                            </Flex>
                        </Accordion.Control>
                        <Accordion.Panel>AA</Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
                <Button
                    size="lg"
                    color="accent.4"
                    disabled={
                        !(
                            versionFormStatus &&
                            thumbnailUploadStatus &&
                            modFormStatus
                        )
                    }>
                    CREATE PROJECT
                </Button>
            </Flex>
        </>
    )
}

export default CreateMod
