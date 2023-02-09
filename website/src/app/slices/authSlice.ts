import { StateCreator } from "zustand"
import jwt_decode from "jwt-decode"

export interface AuthSlice {
    token: string
    data: any
    fetchToken: (token: string) => void
    wipeData: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = set => ({
    token: "",
    data: {},
    fetchToken: (authCode: string) => {
        try {
            console.log("Auth code: ", authCode)

            const res = fetch(
                "https://orbitapp.auth.us-east-1.amazoncognito.com/oauth2/token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        grant_type: "authorization_code",
                        code: authCode,
                        client_id: "5osduaqufcophqc1cbkb2hqgpl",
                        client_secret: import.meta.env
                            .VITE_ORBIT_SECRET as string,
                        redirect_uri: import.meta.env.DEV
                            ? "http://localhost:3000/auth/"
                            : "https://main.d2jcn6poen8bj9.amplifyapp.com/auth/",
                    }),
                },
            )
            res.then(res => {
                res.json().then(data => {
                    const decodedData = jwt_decode(data.id_token)
                    set({ token: data.access_token, data: decodedData })
                })
            })
        } catch {}
    },
    wipeData: () => {
        set({ token: "", data: {} })
    },
})
