import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { nanoid } from "nanoid"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const ddbClient = new DynamoDBClient({ region: REGION })

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: false }
const unmarshallOptions = { wrapNumbers: false }

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions, unmarshallOptions })

export const handler = async (event) => {
	// TODO implement

	const modId = event.pathParameters.mod_id

	const res = await insertMod(modId, JSON.parse(event.body))

	return { ...res, headers }
}

const insertMod = async (modId, modData) => {
	return await preventDuplicateName(modData.name).then(async (res) => {
		if (res === false) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: "Duplicate mod name found",
				}),
			}
		} else if (res === undefined) {
			return {
				statusCode: 500,
				body: JSON.stringify({
					message: "Mod page creation failed",
				}),
			}
		}

		const params = {
			TableName: "mods",
			Item: {
				mod_id: modId,
				...modData,
			},
		}

		try {
			const data = await ddbDocClient.send(new PutCommand(params))
			console.log("✅: Mod inserted")
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: "Mod page created successfully",
					modId: modId,
				}),
			}
		} catch {
			console.log("❌: Mod not inserted")
			return {
				statusCode: 500,
				body: JSON.stringify({
					message: "Mod page creation failed",
				}),
			}
		}
	})
}

const preventDuplicateName = async (modName) => {
	const params = {
		Statement: "SELECT * FROM mods WHERE name = ?",
		Parameters: [modName],
	}

	try {
		const data = await ddbDocClient.send(new ExecuteStatementCommand(params))
		if (data.Items.length > 0) {
			console.log("❌: Duplicate mod name found")
			return false
		} else {
			console.log("✅: No duplicate mod name found")
			return true
		}
	} catch (err) {
		console.log(err)
	}
}

// await handler({
// 	body: {
// 		category_tags: ["decoration"],
// 		created_on: "1668372538",
// 		creator: "RazzleberryFox",
// 		detail: "# ABOUT\n\nDecocraft adds in over 3000 decorations for your Minecraft World. This mod will definitely give you a lot more variety when decorating your builds. Many of the items are actually functional as well!\n--\n",
// 		env_tags: ["Server", "Client"],
// 		name: "fakemod2",
// 		summary:
// 			"Decocraft adds in over 3000 decorations for your Minecraft World. This mod will definitely give you a lot more variety when decorating your builds. Many of the items are actually functional as well! ",
// 	},
// }).then((res) => console.log(JSON.parse(res.body)))

// await preventDuplicateName("Decocraaaaaaft").then((res) => console.log(res))
