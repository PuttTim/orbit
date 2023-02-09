const fetcher = (route: string) => {
    return fetch(`${import.meta.env.VITE_ORBIT_API_URI}/${route}`).then(res => {
        return res.json()
    })
}

export default fetcher
