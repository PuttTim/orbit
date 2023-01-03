import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { nanoid } from "nanoid"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	const version_id = nanoid(8)
	const mod_id = event.pathParameters.mod_id
	const releaseData = JSON.parse(event.body)

	if (await insertRelease(mod_id, version_id, releaseData)) {
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Version Release created successfully",
				modId: mod_id,
				versionId: version_id,
			}),
		}
	} else {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Failed to insert release info" }),
		}
	}
}

const insertRelease = async (mod_id, version_id, releaseData) => {
	const params = {
		TableName: "version_releases",
		Item: {
			mod_id: mod_id,
			version_id: version_id,
			downloads: 0,
			timestamp: Date.now(),
			...releaseData,
		},
	}

	try {
		await ddbDocClient.send(new PutCommand(params))
		console.log("✅: Successfully inserted release info")
		return true
	} catch (err) {
		console.log("❌: Failed to insert release info", err)
		return false
	}
}

await handler({
	pathParameters: {
		mod_id: "7d01f55d95eb",
	},
	body: JSON.stringify({
		game_version: "1.19.3",
		mod_version: "0.10.4",
		stage: "beta",
	}),
}).then((data) => [console.log(data)])
