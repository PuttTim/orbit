import { Box, Button, Flex, Image, Stack, Text } from "@mantine/core"
import Icon from "../assets/orbit_icon.svg"

const Navbar = () => {
    return (
        <Box
            h="80px"
            w="100%"
            bg="primary.9"
            px="20px"
            py="15"
            sx={{ borderRadius: "8px" }}>
            <Flex h="100%" w="100%" align="center">
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
                    <Button variant="subtle" color="dark.0">
                        Home
                    </Button>
                    <Button
                        variant="filled"
                        styles={theme => ({
                            root: {
                                color: "dark.0",
                                backgroundColor: "secondary.9",
                                "&:hover": {
                                    backgroundColor: theme.fn.darken(
                                        "secondary.9",
                                        0.05,
                                    ),
                                },
                            },
                        })}>
                        Mods
                    </Button>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Navbar
