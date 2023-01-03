import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { S3Client, DeleteObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })
const s3Client = new S3Client({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	const modId = event.pathParameters.mod_id
	const versionId = event.pathParameters.version_id

	let promises = []

	const s3URL = await getS3URL(modId, versionId)

	if ((await checkModAndVersion(modId, versionId)) === false) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: "Mod OR Version not found",
			}),
		}
	} else {
		console.log("✅: Mod and Version found")
		promises.push(deleteReleaseMetadata(modId, versionId))
	}

	if (s3URL !== undefined) {
		promises.push(deleteS3Object(s3URL))
	}

	let res

	await Promise.all(promises).then((data) => {
		if (data.every((item) => item === true)) {
			res = {
				statusCode: 200,
				body: JSON.stringify({
					message: `Mod ${modId}, Version ${versionId} successfully deleted`,
				}),
			}
		} else {
			res = {
				statusCode: 500,
				body: JSON.stringify({
					message: `Mod ${modId}, Version ${versionId} failed to delete`,
				}),
			}
		}
	})

	return res
}

const deleteReleaseMetadata = async (modId, releaseId) => {
	const params = {
		Statement: "DELETE FROM version_releases WHERE mod_id = ? AND version_id = ?",
		Parameters: [modId, releaseId],
	}

	try {
		const data = await ddbClient.send(new ExecuteStatementCommand(params))
		if (data.$metadata.httpStatusCode === 200) {
			return true
		}
	} catch (err) {
		console.log(err)
		return false
	}
}

const deleteS3Object = async (key) => {
	const params = {
		Bucket: "orbit-mods",
		Key: key,
	}
	try {
		await s3Client.send(new DeleteObjectCommand(params))
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

const getS3URL = async (modId, versionId) => {
	const params = {
		Statement: "SELECT file_url FROM version_releases WHERE mod_id = ? AND version_id = ?",
		Parameters: [modId, versionId],
	}

	try {
		const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		if (data.Items.length > 0) {
			return data.Items[0].file_url
		} else {
			return undefined
		}
	} catch (err) {
		console.log(err)
	}
}

const checkModAndVersion = async (modId, versionId) => {
	const params = {
		Statement: "SELECT * FROM version_releases WHERE mod_id = ? AND version_id = ?",
		Parameters: [modId, versionId],
	}

	try {
		const data = await ddbClient.send(new ExecuteStatementCommand(params))
		console.log("params", params)

		console.log("data", data)

		if (data.Items.length > 0) {
			console.log("✅: Version found")
			return true
		} else {
			console.log("❌: Version not found")
			return false
		}
	} catch (err) {
		console.log(err)
	}
}

// await getS3URL("7d01f55d95eb", "acf2f8d2").then(async (data) => {
// 	console.log("URL:::", data)
// 	await deleteS3Object(data).then((data) => {
// 		console.log("Delete:::", data)
// 	})
// })

// await deleteReleaseMetadata("7d01f55d95eb", "acf2f8d2").then((data) => {
// 	console.log("Delete:::", data)
// })

// await handler({
// 	pathParameters: {
// 		mod_id: "7d01f55d95eb",
// 		version_id: "acf2f8d2",
// 	},
// }).then((data) => {
// 	console.log("✅✅✅", data)
// })
