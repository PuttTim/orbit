import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	const modId = event.pathParameters.mod_id
	const versionId = event.pathParameters.version_id
	const releaseData = JSON.parse(event.body)

	if ((await checkModAndVersion(modId, versionId)) === false) {
		return {
			statusCode: 404,
			body: JSON.stringify({ message: "Mod Or Version not found" }),
		}
	}

	const success = await updateReleaseInfo(modId, versionId, releaseData)

	if (success) {
		return {
			statusCode: 200,
			body: JSON.stringify({ message: "Version Release Info updated" }),
		}
	} else {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Version Release Info update failed" }),
		}
	}
}

const updateReleaseInfo = async (modId, versionId, releaseData) => {
	const itemKeys = Object.keys(releaseData).filter((k) => k !== "mod_id")

	const params = {
		TableName: "version_releases",
		UpdateExpression: `SET ${itemKeys.map((k, index) => `#field${index} = :value${index}`).join(", ")}`,
		ExpressionAttributeNames: itemKeys.reduce(
			(accumulator, k, index) => ({
				...accumulator,
				[`#field${index}`]: k,
			}),
			{}
		),
		ExpressionAttributeValues: itemKeys.reduce(
			(accumulator, k, index) => ({
				...accumulator,
				[`:value${index}`]: releaseData[k],
			}),
			{}
		),
		Key: {
			mod_id: modId,
			version_id: versionId,
		},
		ReturnValues: "ALL_NEW",
	}

	console.log("params", params)

	try {
		const result = await ddbDocClient.send(new UpdateCommand(params))
		console.log(
			`✅ ddbDocClient successfully updated Version Release (${modId}/${versionId})'s Data with `,
			releaseData,
			result
		)
		return true
	} catch (err) {
		console.log("❌ ddbDocClient failed to update Mod Page's Data", err)
		return false
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

// await handler({
// 	pathParameters: {
// 		mod_id: "345a8829fde0",
// 		version_id: "ff178445",
// 	},
// 	body: {
// 		game_version: "1.16.8",
// 	},
// }).then((res) => console.log(res))
