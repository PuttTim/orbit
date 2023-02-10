import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	const modName = event.pathParameters.mod_name

	const modId = await checkModName(modName)

	console.log("🚀: modName", modName)

	let res

	if (modId) {
		console.log("🚀: modId", modId)
		await fetchAllRelease(modId).then((data) => {
			if (data.Items.length > 0) {
				res = {
					statusCode: 200,
					body: JSON.stringify(data.Items),
				}
			} else {
				res = {
					statusCode: 404,
					body: JSON.stringify({ message: "No releases found" }),
				}
			}
		})
	} else {
		res = {
			statusCode: 404,
			body: JSON.stringify({ message: "No mod found" }),
		}
	}

	return { ...res, headers }
}

const fetchAllRelease = async (modId) => {
	const params = {
		Statement: "SELECT * FROM version_releases WHERE mod_id = ?",
		Parameters: [modId],
	}

	try {
		const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		console.log("✅: Successfully fetched all releases", data)
		return data
	} catch (err) {
		console.log("❌: Something went wrong with the fetch all releases command execution", err)
	}
}

const checkModName = async (modName) => {
	const params = {
		Statement: "SELECT mod_id FROM mods WHERE name = ?",
		Parameters: [modName],
	}

	try {
		const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		if (data.Items.length > 0) {
			console.log("✅: Mod is found")
			console.log("✅: Mod id", data.Items[0].mod_id)
			return data.Items[0].mod_id
		} else {
			console.log("❌: No mod found")
			return undefined
		}
	} catch (err) {
		console.log(err)
	}
}

const fetchModId = async (modName) => {
	const params = {
		Statement: "SELECT mod_id FROM mods WHERE name = ?",
		Parameters: [modName],
	}

	try {
		const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		if (data.Items.length > 0) {
			console.log("✅: Successfully fetched mod id")
			return data.Items[0].id
		} else {
			console.log("❌: No mod found")
			return false
		}
	} catch (err) {
		console.log(err)
	}
}

// await handler({ pathParameters: { mod_name: "Decocraft" } }).then((data) => console.log(data))
