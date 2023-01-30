import { useState } from "react"
import { Button, Container, Text, Box, Paper } from "@mantine/core"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Mods from "./pages/Mods"
import Mod from "./pages/Mod"
import PageNotFound from "./pages/PageNotFound"

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mods" element={<Mods />} />
                <Route path="/mod/:mod_name" element={<Mod />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    )
}

export default App
