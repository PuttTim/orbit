import React, { useEffect, useState } from "react"
import { useAppStore } from "../app/store"
import { useNavigate } from "react-router-dom"
import { Alert, Box, Center, Flex, Loader, Text } from "@mantine/core"
import { Frown, X } from "react-feather"

const Auth = () => {
    const navigate = useNavigate()
    const [authCode, setAuthCode] = useState<string | null>(null)
    const setToken = useAppStore(state => state.fetchToken)
    const userData = useAppStore(state => state.data)

    useEffect(() => {
        const url = window.location.href

        setAuthCode(url.split("code=")[1])
    }, [])

    useEffect(() => {
        if (authCode) {
            console.log(authCode)
            setToken(authCode)
        }
    }, [authCode])

    useEffect(() => {
        if (userData["cognito:username"] !== undefined) {
            navigate("/")
        }
    }, [userData])

    return (
        <>
            <Flex
                h="70vh"
                w="100%"
                justify="center"
                align="center"
                direction="column"
                gap="lg">
                {authCode ? (
                    <>
                        <Loader color="accent.9" />
                        <Text fz="3vh">Loading user profile...</Text>
                    </>
                ) : (
                    <>
                        <Frown color="#AF5456" />
                        <Text fz="3vh">
                            Something went wrong, please try again
                        </Text>
                    </>
                )}
            </Flex>
        </>
    )
}

export default Auth
