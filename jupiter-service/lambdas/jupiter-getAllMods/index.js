import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	// TODO Limit to 20 most downloaded mods & optimise fetchLatestDownload()
	const response = {
		statusCode: 200,
		body: JSON.stringify("Hello from Lambda!"),
	}

	const mods = await fetchAllMods()

	let allMods = []

	// mods.forEach(async (mod) => {
	// 	await compileModData(mod).then((data) => allMods.push(data))
	// })

	mods.forEach((mod) => {
		allMods.push(
			new Promise(async (resolve, reject) => {
				await compileModData(mod).then((data) => resolve(data))
			})
		)
	})

	await Promise.all(allMods).then((data) => {
		allMods = data
		// console.log("All mods: ", allMods)
		response.body = JSON.stringify(allMods)
	})

	return response
}

const compileModData = async (mod) => {
	console.log("⚒️ Constructing: ", mod.mod_id, mod.name)
	const totalDownloads = await fetchDownloadCount(mod.mod_id)
	// console.log("Total downloads: ", totalDownloads, "for: ", mod.name)

	const latestVersion = await fetchLatestVersion(mod.mod_id)
	// console.log("Latest Version of: ", mod.name, ":", latestVersion)

	const data = {
		mod_id: mod.mod_id,
		name: mod.name,
		summary: mod.summary,
		creator: mod.creator,
		created_on: mod.created_on,
		last_updated: latestVersion.timestamp,
		game_version: latestVersion.game_version,
		downloads: totalDownloads,
		env_tags: mod.env_tags,
		category_tags: mod.category_tags,
	}

	console.log("✅ Constructed: ", mod.mod_id, mod.name, data)
	return data
}

const fetchAllMods = async () => {
	const params = {
		Statement: "SELECT * FROM mods",
	}

	let data
	try {
		data = await ddbDocClient.send(new ExecuteStatementCommand(params))
	} catch (error) {
		console.log(error)
	}
	return data.Items
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

console.log(await handler({}))
