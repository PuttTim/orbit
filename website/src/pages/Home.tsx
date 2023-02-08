import {
    Button,
    Flex,
    Box,
    Stack,
    Container,
    Paper,
    Text,
    Grid,
    Image,
    Center,
} from "@mantine/core"
import Hero from "../assets/orbit_hero.svg"
import { ArrowRight } from "react-feather"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()

    return (
        <Box
            h="100%"
            w="100%"
            mt="16px"
            py="20px"
            px="40px"
            bg="primary.9"
            sx={{ borderRadius: "8px" }}>
            <Flex justify="space-between">
                <Flex
                    direction="column"
                    justify="space-around"
                    w="40%"
                    gap="4vh">
                    <Text lh="normal" fz="5vh">
                        Gravitate to 00 mods that{" "}
                        <Text span color="accent.9">
                            Orbit
                        </Text>{" "}
                        our platform for your{" "}
                        <Text span lh="normal" color="highlight.4">
                            Minecraft
                        </Text>{" "}
                        <Text span lh="normal" color="highlight.5">
                            World
                        </Text>{" "}
                        today!
                    </Text>
                    <Button
                        onClick={() => navigate("/mods")}
                        maw="max-content"
                        size="xl"
                        color="accent.9"
                        rightIcon={<ArrowRight />}>
                        Explore now!
                    </Button>
                    <Text lh="normal" fz="3vh">
                        The go to system for all your favourite{" "}
                        <Text span lh="normal" color="highlight.1">
                            Technology
                        </Text>
                        ,{" "}
                        <Text span lh="normal" color="highlight.2">
                            Adventure
                        </Text>
                        ,{" "}
                        <Text span lh="normal" color="highlight.3">
                            Magic
                        </Text>
                        , (and more!) Minecraft Mods.
                    </Text>
                </Flex>
                <Box w="50%">
                    <Image src={Hero} />
                </Box>
            </Flex>
        </Box>
    )
}

export default Home
