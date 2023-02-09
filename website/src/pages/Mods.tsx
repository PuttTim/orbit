import React, { useEffect } from "react"
import fetcher from "../utils/fetcher"
import useSWR from "swr"

const Mods = () => {
    const { data, error } = useSWR("/mods/all", fetcher)

    useEffect(() => {
        console.log(data)
    }, [data])

    return <div>{import.meta.env.ORBIT_SECRET}</div>
}

export default Mods
