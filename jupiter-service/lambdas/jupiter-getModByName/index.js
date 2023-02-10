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

	console.log("modName: " + modName)

	let res

	if (await checkModName(modName)) {
		const params = {
			Statement: "SELECT * FROM mods WHERE name = ?",
			Parameters: [modName],
		}

		try {
			const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
			const mod = data.Items[0]
			const latestVersion = await fetchLatestVersion(mod.mod_id)
			res = {
				statusCode: 200,
				body: JSON.stringify({
					...mod,
					last_updated: latestVersion.timestamp,
					downloads: await fetchDownloadCount(mod.mod_id),
				}),
			}
		} catch (err) {
			console.log(err)
			res = {
				statusCode: 500,
				body: JSON.stringify({ message: "Error getting mod" }),
			}
		}
	} else {
		res = {
			statusCode: 404,
			body: JSON.stringify({ message: "No mod found" }),
		}
	}

	return { ...res, headers }
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

const fetchDownloadCount = async (modId) => {
	const params = {
		Statement: `SELECT downloads FROM version_releases WHERE mod_id = ?`,
		Parameters: [modId],
	}

	let data

	try {
		data = await ddbDocClient.send(new ExecuteStatementCommand(params))
	} catch (error) {
		console.log(error)
	}

	let totalDownloads = 0

	data.Items.forEach((item) => {
		// console.log(item.downloads)
		totalDownloads += item.downloads
	})

	return totalDownloads
}

const fetchLatestVersion = async (modId) => {
	const params = {
		Statement: `SELECT * FROM version_releases WHERE mod_id = ?`,
		Parameters: [modId],
	}

	// console.log(params)

	let data

	try {
		data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		data.Items.sort((a, b) => b.timestamp - a.timestamp)
	} catch (error) {
		console.log(error)
	}

	return data.Items[0]
}

// await handler({ pathParameters: { mod_name: "Decocraft" } }).then((res) => console.log(res))
