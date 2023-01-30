import React from "react"
import { useParams } from "react-router-dom"

const Mod = () => {
    let { mod_name } = useParams()

    console.log(mod_name)

    return <div>{mod_name}</div>
}

export default Mod
