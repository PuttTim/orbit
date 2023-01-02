import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	const response = {
		statusCode: 200,
		body: "",
	}
	// console.log(event)

	let data = await fetchUserData(event.pathParameters.username)

	if (data.length > 0) {
		response.body = JSON.stringify(data[0])
	} else {
		response.statusCode = 404
		response.body = JSON.stringify({ message: "User not found" })
	}

	return response
}

const fetchUserData = async (username) => {
	const params = {
		Statement: "SELECT * FROM users WHERE username = ?",
		Parameters: [username],
	}

	try {
		const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		console.log("✅: ddbDocClient successfully fetched User's Profile", data)
		return data.Items
	} catch (err) {
		console.log("❌: ddbDocClient failed to execute command", err)
	}
}

// console.log(await handler({ pathParameters: { username: "test" } }), "FINAL")
