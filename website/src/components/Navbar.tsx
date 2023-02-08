import { Box, Button, Flex, Image, Stack, Text } from "@mantine/core"
import Icon from "../assets/orbit_icon.svg"
import theme from "../Theme"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

interface NavbarItems {
    pageTitle: string
    pageUrl: string
}

const pages: NavbarItems[] = [
    {
        pageTitle: "Home",
        pageUrl: "",
    },
    {
        pageTitle: "Mods",
        pageUrl: "mods",
    },
]

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [currentPath, setCurrentPath] = useState(
        location.pathname.split("/")[location.pathname.split("/").length - 1],
    )

    useEffect(() => {
        setCurrentPath(
            location.pathname.split("/")[
                location.pathname.split("/").length - 1
            ],
        )
        console.log(currentPath === "" ? "Home" : currentPath)
    }, [location])

    return (
        <Box
            h="50px"
            w="100%"
            bg="primary.9"
            px="15px"
            py="30px"
            sx={{ borderRadius: "8px" }}>
            <Flex h="100%" w="100%" align="center" justify="space-between">
                <Flex dir="row" align="center" columnGap="20px">
                    <Image src={Icon} maw="40px" mah="40px" />
                    <Text
                        fz="2rem"
                        fw={700}
                        variant="gradient"
                        gradient={{
                            from: "accent.9",
                            to: "accent.6",
                            deg: 45,
                        }}>
                        Orbit
                    </Text>
                    {pages.map(page => (
                        <Button
                            key={page.pageUrl}
                            onClick={() => navigate(`/${page.pageUrl}`)}
                            variant={
                                page.pageUrl === currentPath
                                    ? "filled"
                                    : "subtle"
                            }
                            styles={theme => ({
                                root: {
                                    color: theme.colors.dark[0],
                                    backgroundColor:
                                        page.pageUrl === currentPath
                                            ? theme.colors.secondary[7]
                                            : theme.colors.dark[1],
                                    "&:hover": {
                                        backgroundColor:
                                            theme.colors.secondary[8],
                                    },
                                },
                            })}>
                            <Text
                                fw={page.pageUrl === currentPath ? 700 : 500}
                                fz="lg">
                                {page.pageTitle}
                            </Text>
                        </Button>
                    ))}
                </Flex>
                <Flex>
                    <Button
                        onClick={() => {
                            const URI = `${
                                import.meta.env.VITE_ORBIT_AUTH_URI
                            }${
                                import.meta.env.DEV
                                    ? "http://localhost:3000/auth/"
                                    : "https://main.d2jcn6poen8bj9.amplifyapp.com/auth/"
                            }`

                            // console.log(URI)
                            window.open(URI, "_self")
                        }}
                        color="secondary.7">
                        <Text fw={700} fz="lg">
                            Login | Register
                        </Text>
                    </Button>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Navbar
