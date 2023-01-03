import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	const modId = event.pathParameters.mod_id
	const versionId = event.pathParameters.version_id

	const downloadCount = await fetchDownloadCount(modId, versionId)

	if (downloadCount === undefined) {
		return {
			statusCode: 404,
			body: JSON.stringify({ message: "Mod or Version not found" }),
		}
	}

	const success = await updateReleaseInfo(modId, versionId, downloadCount)

	if (success) {
		return {
			statusCode: 200,
			body: JSON.stringify({ message: "Download count went up!" }),
		}
	} else {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Download count update failed" }),
		}
	}
}

const updateReleaseInfo = async (modId, versionId, downloadCount) => {
	const params = {
		Statement: "UPDATE version_releases SET downloads = ? WHERE mod_id = ? AND version_id = ?",
		Parameters: [downloadCount + 1, modId, versionId],
	}

	try {
		const result = await ddbDocClient.send(new ExecuteStatementCommand(params))
		console.log(
			`✅ ddbDocClient successfully updated Version Release (${modId}/${versionId})'s Data with `,
			downloadCount + 1,
			result
		)
		return true
	} catch (err) {
		console.log("❌ ddbDocClient failed to update Mod Page's Data", err)
		return false
	}
}

const fetchDownloadCount = async (modId, versionId) => {
	const params = {
		Statement: "SELECT downloads FROM version_releases WHERE mod_id = ? AND version_id = ?",
		Parameters: [modId, versionId],
	}

	try {
		const data = await ddbClient.send(new ExecuteStatementCommand(params))
		console.log("params", params)

		if (data.Items.length > 0) {
			console.log("✅: Version found")
			return data.Items[0].downloads
		} else {
			console.log("❌: Version not found")
			return undefined
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
// }).then((res) => console.log(res))
