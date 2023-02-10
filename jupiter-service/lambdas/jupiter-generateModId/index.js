import { nanoid } from "nanoid"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

export const handler = async (event) => {
	return {
		statusCode: 200,
		headers,
		body: JSON.stringify({ mod_id: nanoid(12) }),
	}
}

// console.log(await handler({}))
