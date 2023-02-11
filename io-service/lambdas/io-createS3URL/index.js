import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const s3Client = new S3Client({ region: REGION })

export const handler = async (event) => {
	const modId = event.pathParameters.mod_id
	const fileName = event.pathParameters.file_name
	const versionId = event.pathParameters.version_id

	const signedUrl = await createSignedUrl(modId, versionId, fileName)

	console.log(modId)
	console.log(signedUrl)

	return {
		statusCode: 200,
		headers,
		body: JSON.stringify({
			url: signedUrl,
		}),
	}
}

const createSignedUrl = async (modId, versionId, fileName) => {
	const command = new PutObjectCommand({
		Bucket: "orbit-mods",
		Key: `${modId}/${versionId}/${fileName}`,
		ContentType: "binary/octet-stream",
	})

	const signedUrl = await getSignedUrl(s3Client, command, {
		expiresIn: 3600,
	})

	return signedUrl
}

// console.log(await handler({ pathParameters: { modId: "345a8829fde0" } }))
