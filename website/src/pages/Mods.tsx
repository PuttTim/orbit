import React from "react"

const Mods = () => {
    console.log(import.meta.env.VITE_ORBIT_SECRET)
    return <div>{import.meta.env.ORBIT_SECRET}</div>
}

export default Mods
