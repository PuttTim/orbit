import React, { useEffect } from "react"
import fetcher from "../utils/fetcher"
import useSWR from "swr"
import Mod from "../interfaces/Mod"

const Mods = () => {
    const { data, error, isLoading } = useSWR<Mod[], Error>(
        "/mods/all",
        fetcher,
    )

    useEffect(() => {
        if (data) {
            console.log(data[1])
        }
    }, [data])

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {data?.map(mod => (
                        <div key={mod.mod_id}>{mod.name}</div>
                    ))}
                </>
            )}
        </>
    )
}

export default Mods
