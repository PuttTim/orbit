import { useEffect, useState } from "react"
import { Button, Box, Text, Paper, Center, Flex } from "@mantine/core"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Mods from "./pages/Mods"
import Mod from "./pages/Mod"
import PageNotFound from "./pages/PageNotFound"
import Navbar from "./components/Navbar"
import Auth from "./pages/Auth"
import { useLocalStorage } from "@mantine/hooks"
import { useAppStore } from "./app/store"

function App() {
    const setData = useAppStore(state => state.setData)
    const wipeData = useAppStore(state => state.wipeData)

    useEffect(() => {
        const data = localStorage.getItem("userData")

        if (data) {
            const parsedData = JSON.parse(data)
            // console.log("data: ", parsedData)
            if (parsedData.data.exp < Date.now()) {
                setData(data)
            } else {
                wipeData()
            }
        }
    }, [])

    return (
        <>
            <Box maw={"1300px"} m="auto" mb="32px" pt="16px">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mods" element={<Mods />} />
                    <Route path="/mod/:mod_name" element={<Mod />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Box>
        </>
    )
}

export default App
