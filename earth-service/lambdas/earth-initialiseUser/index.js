import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

const lambdaResponse = {
	version: "1",
	region: "us-east-1",
	userPoolId: "us-east-1_wRXf1XCAk",
	userName: "Putt2",
	callerContext: {
		awsSdkVersion: "aws-sdk-unknown-unknown",
		clientId: "5osduaqufcophqc1cbkb2hqgpl",
	},
	triggerSource: "PostConfirmation_ConfirmSignUp",
	request: {
		userAttributes: {
			sub: "5p2p72ed-c4e0-40db-b6d3-0503ed259703",
			email_verified: "true",
			"cognito:user_status": "CONFIRMED",
			email: "2100014F@student.tp.edu.sg",
		},
	},
	response: {},
}

export const handler = async (event, context, callback) => {
	// TODO implement
	const response = {
		statusCode: 200,
		body: JSON.stringify("Hello from Lambda!"),
	}

	const sub = event.request.userAttributes.sub
	const userName = event.userName

	console.log("primaryKey: " + sub)
	console.log("userName: " + userName)

	await createDDdbUserEntry(sub, userName)

	// if (!success) {
	// 	response.statusCode = 500
	// 	response.body = JSON.stringify("Error creating user entry in DynamoDB")
	// 	callback(null, event)
	// } else {
	// 	callback(null, event)
	// }

	callback(null, event)

	return response
}

const createDDdbUserEntry = async (sub, userName) => {
	const params = {
		TableName: "users",
		Item: {
			user_id: sub,
			username: userName,
		},
	}

	try {
		const data = await ddbDocClient.send(new PutCommand(params))
		console.log("Success", data)
		return true
	} catch (err) {
		console.log("Error", err)
		return false
	}
}

// handler(lambdaResponse)
