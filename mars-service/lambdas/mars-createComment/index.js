import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { nanoid } from "nanoid"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	const commentId = nanoid(8)
	const modId = event.pathParameters.mod_id
	const commentData = JSON.parse(event.body)

	let res

	if (await checkModId(modId)) {
		const data = await insertComment(modId, commentId, commentData)

		if (data) {
			res = {
				statusCode: 201,
				body: JSON.stringify({ message: "Comment created successfully", comment_id: commentId }),
			}
		} else {
			res = {
				statusCode: 500,
				body: JSON.stringify({ message: "Failed to create comment" }),
			}
		}
	} else {
		res = {
			statusCode: 404,
			body: JSON.stringify({ message: "Mod not found" }),
		}
	}

	return res
}

const insertComment = async (modId, commentId, commentData) => {
	const params = {
		TableName: "comments",
		Item: {
			comment_id: commentId,
			mod_id: modId,
			timestamp: Date.now(),
			...commentData,
		},
	}
	try {
		await ddbDocClient.send(new PutCommand(params))
		console.log(`✅: Successfully created comment for Mod: ${modId}`)
		return true
	} catch (err) {
		console.log(`❌: Failed to create comment for Mod: ${modId}`)
		console.log(err)
		return false
	}
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

// await handler({
// 	pathParameters: {
// 		mod_id: "345a8829fde0",
// 	},
// 	body: JSON.stringify({
// author: "Putt",
// content: "I want to request a new block: An item stand",
// ftr_tag: "Unreviewed",
// type: "FTR",
// 	}),
// }).then((res) => console.log(res))
