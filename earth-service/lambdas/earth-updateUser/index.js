import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb"

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

	const body = JSON.parse(event.body)
	const userId = body.user_id

	console.log("body", body)

	let success = await updateUser(userId, body)

	if (success) {
		response.body = JSON.stringify({ message: "User updated successfully" })
	} else {
		response.statusCode = 500
		response.body = JSON.stringify({ message: "Failed to update user" })
	}

	return response
}

const updateUser = async (userId, body) => {
	const itemKeys = Object.keys(body).filter((k) => k !== "user_id")

	const params = {
		TableName: "users",
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
				[`:value${index}`]: body[k],
			}),
			{}
		),
		Key: {
			user_id: userId,
		},
		ReturnValues: "ALL_NEW",
	}

	console.log("params", params)

	try {
		const data = await ddbDocClient.send(new UpdateCommand(params))
		console.log("✅ ddbDocClient successfully updated User's Data with ", body, data)
		return true
	} catch (err) {
		console.log("❌ ddbDocClient failed to update User's Data", err)
		return false
	}
}

// console.log(
// 	await handler({
// 		body: JSON.stringify({
// 			id: "0c1c72ed-c4e0-40db-b6d3-0503ed259703",
// 			bio: "I am a bio4",
// 			external_links: ["twitter.com/author123", "github.com/author123"],
// 		}),
// 	})
// )
