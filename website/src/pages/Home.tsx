import { Button, Container, Paper, Text } from "@mantine/core"

const Home = () => {
    return (
        <div>
            <Text>
                Gravitate to 00 mods that
                <Text span color="accent.9">
                    {" "}
                    Orbit{" "}
                </Text>
                our platform for your Minecraft World today!
            </Text>
            <Container size="md" bg="secondary.9">
                HELLO
            </Container>
            <Paper p="md" bg="primary.9">
                <Text>
                    Gravitate to 00 mods that Orbit our platform for your
                    Minecraft World today!
                </Text>
                <Button color="accent.2">Explore now!</Button>
            </Paper>
        </div>
    )
}

export default Home
