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
    Group,
} from "@mantine/core"
import Hero from "../assets/orbit_hero.svg"
import OfferImg from "../assets/orbit_offer.svg"
import { ArrowRight } from "react-feather"
import { useNavigate } from "react-router-dom"

interface Offer {
    title: string
    points: {
        status: boolean
        text: string
    }[]
}

const creatorOffer: Offer = {
    title: "As a Creator:",
    points: [
        {
            status: true,
            text: "A platform to showcase your work to the world",
        },
        {
            status: true,
            text: "Comment system with a creator-first approach",
        },
        {
            status: false,
            text: "A Solar System sized userbase",
        },
    ],
}

const playerOffer: Offer = {
    title: "As a Player:",
    points: [
        {
            status: true,
            text: "Intuitive UI designed for the best searching experience",
        },
        {
            status: true,
            text: "A seamless, smooth experience on the platform",
        },
        {
            status: false,
            text: "Snacks (bring your own!)",
        },
    ],
}

const Home = () => {
    const navigate = useNavigate()

    return (
        <>
            <Box
                h="100%"
                w="100%"
                mt="16px"
                py="20px"
                px="40px"
                bg="primary.9"
                sx={{ borderRadius: "8px" }}>
                <Flex justify="space-between">
                    <Flex direction="column" justify="space-around" w="40%">
                        <Text lh="normal" fz={32}>
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
                        <Text lh="normal" fz={24}>
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
            <Box
                h="100%"
                w="100%"
                mt="16px"
                py="20px"
                px="40px"
                bg="primary.9"
                sx={{ borderRadius: "8px" }}>
                <Flex direction="column">
                    <Text fz={24} mb={24}>
                        <Text span color="accent.9">
                            Orbit
                        </Text>{" "}
                        offers you this:
                    </Text>
                    <Flex w="100%" justify="space-around">
                        <Stack align="center" justify="center">
                            {" "}
                            <Image src={OfferImg} />
                        </Stack>
                        <Flex direction="column" w="100%">
                            <Flex justify="space-evenly">
                                {" "}
                                <Box w="30%">
                                    <Text fz="xl">{creatorOffer.title}</Text>
                                    {creatorOffer.points.map((point, i) => (
                                        <Text key={i} fz="lg" mt="8px">
                                            <Text
                                                span
                                                color={
                                                    point.status
                                                        ? "#98E37D"
                                                        : "#AF5456"
                                                }>
                                                {" "}
                                                {point.status ? "✔" : "✖"}
                                            </Text>{" "}
                                            {point.text}
                                        </Text>
                                    ))}
                                </Box>
                                <Box w="30%">
                                    <Text fz="xl">{playerOffer.title}</Text>
                                    {playerOffer.points.map((point, i) => (
                                        <Text key={i} fz="lg" mt="8px">
                                            <Text
                                                span
                                                color={
                                                    point.status
                                                        ? "#98E37D"
                                                        : "#AF5456"
                                                }>
                                                {" "}
                                                {point.status ? "✔" : "✖"}
                                            </Text>{" "}
                                            {point.text}
                                        </Text>
                                    ))}
                                </Box>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export default Home
