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
    MultiSelect,
    Modal,
} from "@mantine/core"
import {
    Check,
    Edit,
    GitHub,
    Info,
    Loader,
    MessageSquare,
    Save,
    Trash,
    Upload,
    X,
} from "react-feather"
import useSWR from "swr"
import fetcher from "../utils/fetcher"
import { useAppStore } from "../app/store"
import { useNavigate } from "react-router-dom"
import { useForm } from "@mantine/form"
import {
    CategoryNames,
    EnvTags,
    ExternalLinks,
    LinkNames,
    ModPage,
} from "../interfaces/Mod"
import MDEditor from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize"
import { useEffect, useState } from "react"

interface DialogText {
    content: string
    type: "error" | "success" | "loading"
}

const selectStyles = (theme: any) => ({
    input: {
        color: theme.colors.dark[0],
        backgroundColor: theme.colors.primary[9],
    },
    dropdown: {
        backgroundColor: theme.colors.primary[9],
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
})

interface UpdateModProps {
    modData: ModPage
    close: () => void
}

const UpdateMod = (props: UpdateModProps) => {
    const modData = props.modData
    const navigate = useNavigate()
    // Form related states
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [versionFile, setVersionFile] = useState<File | null>(null)
    const [externalLinks, setExternalLinks] = useState<ExternalLinks[]>(
        modData.external_links || [],
    )
    const [envTags, setEnvTags] = useState<string[]>(modData.env_tags)
    const [categoryTags, setCategoryTags] = useState<string[]>(
        modData.category_tags,
    )
    const [contributors, setContributors] = useState<string[]>(
        modData.contributors || [],
    )
    const modForm = useForm({
        validateInputOnChange: true,
        initialValues: {
            name: modData.name,
            summary: modData.summary,
            detail: modData.detail,
            creator: modData.creator,
        },
        validate: {
            detail: (value: string) => {
                if (value === "") {
                    return "Detail is required"
                }
            },
            name: (value: string) => {
                if (value === "") {
                    return "Name is required"
                }
            },
            summary: (value: string) => {
                if (value === "") {
                    return "Summary is required"
                }
            },
            creator: (value: string) => {
                if (value === "") {
                    return "Creator is required"
                }
            },
        },
    })

    // General use states
    const [modId, setModId] = useState<string>(modData.mod_id)
    const [openedDialog, setOpenedDialog] = useState<boolean>(false)
    const [openedModal, setOpenedModal] = useState<boolean>(false)
    const userData = useAppStore(state => state.data)
    const [dialogText, setDialogText] = useState<DialogText>()

    const updateExternalLinks = (type: LinkNames, link: string) => {
        if (externalLinks.find(el => el.type === type)) {
            setExternalLinks(
                externalLinks.map(el => {
                    if (el.type === type) {
                        return {
                            ...el,
                            link,
                        }
                    }
                    return el
                }),
            )
            return
        } else {
            setExternalLinks([
                ...externalLinks,
                {
                    link,
                    type,
                },
            ])
        }
    }

    const externalLinkHandler = (type: LinkNames, link: string) => {
        try {
            const uri = new URL(link)
            if (uri.protocol !== "http:" && uri.protocol !== "https:") {
                throw new Error("Invalid protocol")
            } else {
                // console.log("Valid protocol")
                // console.log(uri)

                switch (type) {
                    case "github":
                        if (uri.hostname !== "www.github.com") {
                            throw new Error("Invalid hostname")
                        }
                        break
                    case "discord":
                        if (
                            uri.hostname !== "discord.com" &&
                            uri.hostname !== "discord.gg"
                        ) {
                            throw new Error("Invalid hostname")
                        }

                        break
                    case "wiki":
                        break
                }
                console.log("Valid URL")
                if (type !== "wiki") {
                    setDialogText({
                        content: "Valid URL",
                        type: "success",
                    })
                    setOpenedDialog(true)
                }

                updateExternalLinks(type, link)
            }
        } catch {
            console.log("Invalid URL")
            setDialogText({
                content: "Invalid URL",
                type: "error",
            })
            setOpenedDialog(true)
        }
    }

    const updateMod = () => {
        console.log("Updating mod")
        let data
        data = {
            ...modForm.values,
            external_links: externalLinks,
            env_tags: envTags,
            category_tags: categoryTags,
            contributors,
            created_on: Date.now(),
        }
        console.log(data)

        fetch(`${import.meta.env.VITE_ORBIT_API_URI}/mod/update/${modId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(res => {
            console.log(res)
            if (res.status === 200) {
                console.log("Mod updated")
                navigate(`/mods`)
            }
        })

        // console.log(data)
    }

    return (
        <>
            <Dialog
                bg={
                    dialogText?.type === "error"
                        ? "highlight.0"
                        : dialogText?.type === "success"
                        ? "green.8"
                        : "accent.9"
                }
                opened={openedDialog}
                onClose={() => {
                    setOpenedDialog(false)
                    setDialogText(undefined)
                }}>
                <Flex
                    gap="20px"
                    onClick={() => {
                        setOpenedDialog(false)
                    }}
                    sx={{ borderRadius: "8px", cursor: "pointer" }}>
                    {dialogText?.type === "error" ? (
                        <X color="white" size={24} />
                    ) : dialogText?.type === "success" ? (
                        <Check color="white" size={24} />
                    ) : (
                        <Loader color="white" size={24} />
                    )}
                    <Title order={5}>{dialogText?.content}</Title>
                </Flex>
            </Dialog>
            <Modal
                centered
                size="60%"
                overlayOpacity={0.7}
                title="Your mod Details (in Markdown)"
                opened={openedModal}
                onClose={() => {
                    setOpenedModal(false)
                }}
                styles={theme => ({
                    modal: {
                        borderRadius: "8px",
                        backgroundColor: theme.colors.primary[9],
                    },
                })}>
                <Flex direction="column" gap="16px" h="100%">
                    <MDEditor
                        height={500}
                        value={modForm.values.detail}
                        onChange={value => {
                            modForm.setFieldValue("detail", value || "")
                        }}
                        previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                        }}
                    />
                    <Button
                        onClick={() => {
                            setOpenedModal(false)
                        }}
                        leftIcon={<Save />}
                        w="100%"
                        color="accent.2">
                        SAVE
                    </Button>
                </Flex>
            </Modal>
            <Flex direction="column" gap="16px">
                <Flex w="100%" h="100%" gap="40px">
                    <Flex direction="column" gap="8px" w="50%" h="100%">
                        <TextInput
                            value={modForm.values.name}
                            onChange={event => {
                                modForm.setFieldValue(
                                    "name",
                                    event.target.value,
                                )
                            }}
                            withAsterisk
                            placeholder="Quark"
                            label="Mod Name"
                            variant="filled"
                            styles={theme => ({
                                input: {
                                    backgroundColor: theme.colors.primary[9],
                                },
                            })}
                        />
                        <TextInput
                            value={modForm.values.summary}
                            onChange={event => {
                                modForm.setFieldValue(
                                    "summary",
                                    event.target.value,
                                )
                            }}
                            withAsterisk
                            placeholder="Useful mod for Minecraft"
                            label="Short Summary"
                            variant="filled"
                            styles={theme => ({
                                input: {
                                    backgroundColor: theme.colors.primary[9],
                                },
                            })}
                        />
                        <TextInput
                            value={modForm.values.creator}
                            onChange={event => {
                                console.log("do nothing")
                            }}
                            disabled
                            label="Project Owner"
                            variant="filled"
                            withAsterisk
                            styles={theme => ({
                                input: {
                                    backgroundColor: theme.colors.primary[9],
                                },
                            })}
                        />
                        <TextInput
                            value={contributors}
                            placeholder="Vazkii, RWTema, ..."
                            onChange={event => {
                                setContributors(
                                    event.target.value
                                        .replace(/ /g, "")
                                        .split(","),
                                )
                            }}
                            label="Project Contributors"
                            variant="filled"
                            styles={theme => ({
                                input: {
                                    backgroundColor: theme.colors.primary[9],
                                },
                            })}
                        />
                        <Flex direction="column">
                            <Text fz="md" mb="8px">
                                Project Details{" "}
                                <Text span color="red">
                                    *
                                </Text>
                            </Text>
                            <Button
                                onClick={() => {
                                    setOpenedModal(true)
                                }}
                                leftIcon={<Edit />}
                                w="50%"
                                color="primary.9">
                                Open Details Editor
                            </Button>
                        </Flex>
                    </Flex>
                    <Flex direction="column" gap="8px" w="50%" h="100%">
                        {" "}
                        <MultiSelect
                            value={categoryTags}
                            withAsterisk
                            maxSelectedValues={3}
                            label="Category Tags"
                            variant="filled"
                            onChange={event => {
                                setCategoryTags(event)
                            }}
                            placeholder="Select Category"
                            data={[
                                "Adventure",
                                "Building",
                                "Decoration",
                                "Magic",
                                "Optimisation",
                                "Technology",
                                "Utility",
                                "World Generation",
                            ]}
                            styles={selectStyles}
                        />
                        <MultiSelect
                            value={envTags}
                            withAsterisk
                            label="Mod Environment Tags"
                            variant="filled"
                            onChange={event => {
                                setEnvTags(event)
                            }}
                            placeholder="Server..."
                            data={["Server", "Client"]}
                            styles={selectStyles}
                        />
                        <TextInput
                            value={
                                externalLinks.find(
                                    link => link.type === "github",
                                )?.link
                            }
                            label="GitHub Link"
                            placeholder="https://github.com/VazkiiMods/Quark"
                            icon={<GitHub />}
                            onChange={event => {
                                externalLinkHandler(
                                    "github",
                                    event.target.value,
                                )
                            }}
                            variant="filled"
                            styles={theme => ({
                                input: {
                                    backgroundColor: theme.colors.primary[9],
                                },
                            })}
                        />
                        <TextInput
                            value={
                                externalLinks.find(link => link.type === "wiki")
                                    ?.link
                            }
                            label="Mod Wiki"
                            placeholder="https://quarkmod.net/#features"
                            icon={<Info />}
                            onChange={event => {
                                externalLinkHandler("wiki", event.target.value)
                            }}
                            variant="filled"
                            styles={theme => ({
                                input: {
                                    backgroundColor: theme.colors.primary[9],
                                },
                            })}
                        />
                        <TextInput
                            value={
                                externalLinks.find(
                                    link => link.type === "discord",
                                )?.link
                            }
                            label="Discord Server"
                            placeholder="https://discord.gg/quark"
                            icon={<MessageSquare />}
                            onChange={event => {
                                externalLinkHandler(
                                    "discord",
                                    event.target.value,
                                )
                            }}
                            variant="filled"
                            styles={theme => ({
                                input: {
                                    backgroundColor: theme.colors.primary[9],
                                },
                            })}
                        />
                    </Flex>
                </Flex>
                <Button
                    disabled={!modForm.isValid()}
                    onClick={() => {
                        if (modForm.isValid()) {
                            updateMod()
                        }
                    }}
                    color="accent.4">
                    CONFIRM UPDATE
                </Button>
            </Flex>
        </>
    )
}

export default UpdateMod
