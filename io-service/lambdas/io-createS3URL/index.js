import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const REGION = "us-east-1"

const s3Client = new S3Client({ region: REGION })

export const handler = async (event) => {
	const key = event.pathParameters.mod_id

	const signedUrl = await createSignedUrl(key)

	console.log(key)
	console.log(signedUrl)

	return {
		statusCode: 200,
		body: JSON.stringify(signedUrl),
	}
}

const createSignedUrl = async (modId) => {
	const command = new PutObjectCommand({
		Bucket: "orbit-mods",
		Key: `${modId}/`,
		ContentType: "binary/octet-stream",
	})

	const signedUrl = await getSignedUrl(s3Client, command, {
		expiresIn: 3600,
	})

	return signedUrl
}

// console.log(await handler({ pathParameters: { modId: "345a8829fde0" } }))
