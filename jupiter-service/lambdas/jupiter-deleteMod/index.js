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

	return await executeDeleteCommands(modId)
}

const executeDeleteCommands = async (modId) => {
	const modIdCheck = await checkModId(modId)
	let res
	if (modIdCheck) {
		await Promise.all([deleteModPageData(modId), deleteS3Thumbnail(modId), deleteS3Versions(modId)]).then(
			(data) => {
				console.log(data)
				if (data.every((item) => item === true)) {
					res = {
						statusCode: 200,
						body: JSON.stringify({ message: "Mod deleted successfully" }),
					}
				} else {
					res = {
						statusCode: 500,
						body: JSON.stringify({ message: "Mod delete failed" }),
					}
				}
			}
		)
	} else {
		res = {
			statusCode: 404,
			body: JSON.stringify({ message: "Mod not found" }),
		}
	}

	return res
}

const deleteModPageData = async (modId) => {
	const params = new ExecuteStatementCommand({
		Statement: "DELETE FROM mods WHERE mod_id = ?",
		Parameters: [modId],
	})

	try {
		const data = await ddbDocClient.send(params)
		console.log(`✅: Mod Page Data for modId: ${modId} deleted successfully`, data)
		return true
	} catch (err) {
		console.log(`❌: Mod Page Data for modId: ${modId} delete failed`, err)
		return false
	}
}

const deleteS3Thumbnail = async (modId) => {
	const command = new DeleteObjectCommand({
		Bucket: "orbit-image",
		Key: `thumbnail/${modId}/icon.png`,
	})

	try {
		const data = await s3Client.send(command)
		console.log(`✅: S3 image folder for modId: ${modId} deleted successfully`, data)
		return true
	} catch (err) {
		console.log(`❌: S3 image folder for modId: ${modId} delete failed`, err)
		return false
	}
}

const deleteS3Versions = async (modId) => {
	const listParams = new ListObjectsCommand({
		Bucket: "orbit-mods",
		Prefix: `${modId}/`,
	})

	try {
		await s3Client.send(listParams).then(async (data) => {
			console.log(data)

			let deleteCommands = []
			if (data.Contents.length === 0) {
				return false
			}
			await data.Contents.forEach(async (content) => {
				const deleteParams = new DeleteObjectCommand({
					Bucket: "orbit-mods",
					Key: content.Key,
				})
				s3Client
					.send(deleteParams)
					.then((data) =>
						console.log(
							`✅: S3 mods folder for modId: ${modId} version: ${content.Key} deleted successfully`,
							data
						)
					)
			})
		})
		return true
	} catch (err) {
		console.log(`❌: S3 mods folder for modId: ${modId} delete failed`, err)
		return false
	}
}

const checkModId = async (modId) => {
	const params = {
		Statement: "SELECT * FROM mods WHERE mod_id = ?",
		Parameters: [modId],
	}

	try {
		const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		if (data.Items.length > 0) {
			console.log("✅: Mod is found")
			return true
		} else {
			console.log("❌: No mod found")
			return false
		}
	} catch (err) {
		console.log(err)
	}
}

// await handler({ pathParameters: { mod_id: "1" } }).then((data) => console.log("✅✅✅✅✅", data))
// await deleteModPageData("1").then((data) => console.log(data))
// await deleteS3Thumbnail("1").then((data) => console.log(data))
// await deleteS3Versions("1").then((data) => console.log(data))
