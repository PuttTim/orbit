import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	const modName = event.pathParameters.mod_name

	console.log("modName: " + modName)

	if (await checkModName(modName)) {
		const params = {
			Statement: "SELECT * FROM mods WHERE name = ?",
			Parameters: [modName],
		}

		try {
			const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
			const mod = data.Items[0]
			return {
				statusCode: 200,
				body: JSON.stringify(mod),
			}
		} catch (err) {
			console.log(err)
			return {
				statusCode: 500,
				body: JSON.stringify({ message: "Error getting mod" }),
			}
		}
	} else {
		return {
			statusCode: 404,
			body: JSON.stringify({ message: "No mod found" }),
		}
	}
}

const checkModName = async (modName) => {
	const params = {
		Statement: "SELECT * FROM mods WHERE name = ?",
		Parameters: [modName],
	}

	try {
		const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		if (data.Items.length > 0) {
			console.log("✅: Mod found")

			return true
		} else {
			console.log("❌: No mod found")

			return false
		}
	} catch (err) {
		console.log(err)
	}
}

// await handler({ queryStringParameters: { modName: "Decocraft" } }).then((res) => console.log(res))
