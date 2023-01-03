import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	const modId = event.pathParameters.mod_id

	let res

	if (await checkModId(modId)) {
		await fetchAllComments(modId).then((data) => {
			if (data.Items.length > 0) {
				res = {
					statusCode: 200,
					body: JSON.stringify({
						message: "Successfully fetched all comments",
						comments: data.Items,
					}),
				}
			} else {
				res = {
					statusCode: 404,
					body: JSON.stringify({
						message: "No comments found",
					}),
				}
			}
		})
	} else {
		res = {
			statusCode: 404,
			body: JSON.stringify({
				message: "No mod found",
			}),
		}
	}

	return res
}

const fetchAllComments = async (modId) => {
	const params = {
		Statement: "SELECT * FROM comments WHERE mod_id = ?",
		Parameters: [modId],
	}

	try {
		const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		console.log(`✅: Successfully fetched all comments of mod: ${modId} `, data)
		return data
	} catch (err) {
		console.log("❌: Something went wrong with the fetch all comments command execution", err)
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

// await handler({ pathParameters: { mod_id: "345a8829fde0" } }).then((data) => console.log(data))
