import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	// TODO implement
	const response = {
		statusCode: 200,
		body: "",
	}

	const modData = JSON.parse(event.body)
	const modId = event.pathParameters.mod_id

	if ((await checkModId(modId)) === false) {
		response.statusCode = 404
		response.body = JSON.stringify({
			message: "Mod Page not found",
		})
		return response
	}

	const success = await updateMod(modData, modId)

	if (success) {
		response.body = JSON.stringify({
			message: "Mod Page's Data successfully updated",
		})
	} else {
		response.statusCode = 500
		response.body = JSON.stringify({
			message: "Mod Page's Data failed to update",
		})
	}

	return response
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
const updateMod = async (modData, modId) => {
	const itemKeys = Object.keys(modData).filter((k) => k !== "mod_id")

	const params = {
		TableName: "mods",
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
				[`:value${index}`]: modData[k],
			}),
			{}
		),
		Key: {
			mod_id: modId,
		},
		ReturnValues: "ALL_NEW",
	}

	console.log("params", params)

	try {
		const result = await ddbDocClient.send(new UpdateCommand(params))
		console.log("✅ ddbDocClient successfully updated Mod Page's Data with ", modData, result)
		return true
	} catch (err) {
		console.log("❌ ddbDocClient failed to update Mod Page's Data", err)
		return false
	}
}

// await handler({
// 	pathParameters: {
// 		mod_id: "5BqZGcLbi91g",
// 	},
// 	body: JSON.stringify({
// 		name: "fakemod",
// 		contributors: "NewUser2",
// 	}),
// }).then((res) => console.log(JSON.parse(res.body)))
