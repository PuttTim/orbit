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
		const data = await fetchComments(modId)
		res = {
			statusCode: 200,
			body: JSON.stringify({
				message: "Recent 10 comments retrieved",
				comments: data,
			}),
		}
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

const fetchComments = async (modId) => {
	const params = {
		Statement: "SELECT * FROM comments WHERE mod_id = ?",
		Parameters: [modId],
	}

	let data

	try {
		data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		data.Items.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
		data.Items.splice(5)
	} catch (err) {
		console.log(err)
	}

	return data.Items
}

const checkModId = async (modId) => {
	const params = {
		Statement: "SELECT * FROM comments WHERE mod_id = ?",
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

// await handler({ pathParameters: { mod_id: "345a8829fde0" } }).then((res) => console.log(res))
