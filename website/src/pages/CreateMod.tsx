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
    TextInput,
    Select,
    Radio,
} from "@mantine/core"
import { useEffect, useState } from "react"
import { Check, Trash, Upload, X } from "react-feather"
import useSWR from "swr"
import fetcher from "../utils/fetcher"
import { useAppStore } from "../app/store"
import { useNavigate } from "react-router-dom"
import { useForm } from "@mantine/form"

interface DialogText {
    content: string
    type: "error" | "success"
}

const CreateMod = () => {
    const navigate = useNavigate()

    // Form validation states
    const [versionFormStatus, setVersionFormStatus] = useState<boolean>(false)
    const [thumbnailUploadStatus, setThumbnailUploadStatus] =
        useState<boolean>(false)
    const [modFormStatus, setModFormStatus] = useState<boolean>(false)

    // Form related states
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [versionFile, setVersionFile] = useState<File | null>(null)
    const versionForm = useForm({
        validateInputOnChange: true,
        initialValues: {
            mod_version: "",
            game_version: "",
            stage: "",
        },
        validate: {
            mod_version: value => {
                if (value === "") {
                    return "Mod version is required"
                }
            },
            game_version: value => {
                if (value === "") {
                    return "Game version is required"
                }
            },
            stage: value => {
                if (value === "") {
                    return "Stage is required"
                }
            },
        },
    })

    // General use states
    const [modId, setModId] = useState<string>("")
    const [opened, setOpened] = useState<boolean>(false)
    const [dialogText, setDialogText] = useState<DialogText>()
    const userData = useAppStore(state => state.data)

    const uploadThumbnail = () => {
        if (thumbnailFile !== null) {
            console.log("Uploading thumbnail")
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

    const uploadVersion = () => {
        // console.log(versionFile)
        // console.log(versionForm.values)
        if (versionFile !== null && versionForm.isValid()) {
            console.log("Uploading version")
            fetch(
                `${import.meta.env.VITE_ORBIT_API_URI}/version/create/${modId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...versionForm.values,
                        file_url: `${modId}/${versionFile.name}`,
                    }),
                },
            ).then(res => {
                res.json().then(value => {
                    fetcher(
                        `version/new_file/${modId}/${value.versionId}/${versionFile.name}`,
                    )
                        .then(res => {
                            const url = res.url
                            fetch(url, {
                                method: "PUT",
                                body: versionFile,
                            }).then(res => {
                                console.log("Uploaded version")
                                setVersionFormStatus(true)
                                setDialogText({
                                    content:
                                        "Version Release created & uploaded successfully",
                                    type: "success",
                                })
                                setOpened(true)
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            setOpened(true)
                            setDialogText({
                                content: "Failed to upload version",
                                type: "error",
                            })
                        })
                })
            })
        }
    }

    useEffect(() => {
        fetcher("/mod/generate_id").then(res => {
            setModId(res.mod_id)
        })

        // if (userData["cognito:username"] === undefined) {
        //     console.log("User is not logged in")
        //     navigate("/")
        // }
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
                        <Accordion.Panel>
                            <Flex direction="column" gap="16px">
                                <TextInput
                                    onChange={event => {
                                        versionForm.setFieldValue(
                                            "mod_version",
                                            event.target.value,
                                        )
                                    }}
                                    withAsterisk
                                    label={"Mod Version"}
                                    variant="filled"
                                    styles={theme => ({
                                        input: {
                                            backgroundColor:
                                                theme.colors.primary[9],
                                        },
                                    })}
                                />
                                <TextInput
                                    onChange={event => {
                                        versionForm.setFieldValue(
                                            "game_version",
                                            event.target.value,
                                        )
                                    }}
                                    withAsterisk
                                    label={"Game Version"}
                                    variant="filled"
                                    styles={theme => ({
                                        input: {
                                            backgroundColor:
                                                theme.colors.primary[9],
                                        },
                                    })}
                                />
                                <Radio.Group
                                    onChange={value => {
                                        versionForm.setFieldValue(
                                            "stage",
                                            value,
                                        )
                                    }}
                                    name="stage"
                                    label="Select Release Stage">
                                    <Radio
                                        value="alpha"
                                        label="Alpha"
                                        color="accent"
                                    />
                                    <Radio
                                        value="beta"
                                        label="Beta"
                                        color="accent"
                                    />
                                    <Radio
                                        value="release"
                                        label="Release"
                                        color="accent"
                                    />
                                </Radio.Group>
                                <FileInput
                                    withAsterisk
                                    label="File"
                                    onChange={(files: File | null) => {
                                        console.log(files?.name)

                                        setVersionFile(files)
                                    }}
                                    value={versionFile}
                                    icon={<Upload />}
                                    accept="
                                        .txt,.jar"
                                    variant="filled"
                                    placeholder="Select a File to upload..."
                                    styles={theme => ({
                                        input: {
                                            backgroundColor:
                                                theme.colors.primary[9],
                                        },
                                    })}
                                />
                                <Button
                                    onClick={uploadVersion}
                                    disabled={
                                        !(versionForm.isValid() && versionFile)
                                    }
                                    color="accent.2"
                                    size="lg">
                                    CREATE VERSION RELEASE
                                </Button>
                            </Flex>
                        </Accordion.Panel>
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
                                <FileInput
                                    withAsterisk
                                    label="Thumbnail"
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
                                <Text fz="md">Preview</Text>
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
