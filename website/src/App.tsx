import { useState } from "react"
import { Button, Box, Text, Paper, Center, Flex } from "@mantine/core"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Mods from "./pages/Mods"
import Mod from "./pages/Mod"
import PageNotFound from "./pages/PageNotFound"
import Navbar from "./components/Navbar"

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Box maw={"1300px"} m="auto" pt="16px">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mods" element={<Mods />} />
                    <Route path="/mod/:mod_name" element={<Mod />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Box>
        </>
    )
}

export default App
