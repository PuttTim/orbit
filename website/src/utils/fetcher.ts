const fetcher = (route: string) => {
    return fetch(`${import.meta.env.VITE_ORBIT_API_URI}/${route}`).then(res => {
        // console.log(`${import.meta.env.VITE_ORBIT_API_URI}/${route}`)

        return res.json()
    })
}

export default fetcher
