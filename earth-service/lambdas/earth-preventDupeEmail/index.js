import { ListUsersCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"

const REGION = "us-east-1"

const cognitoClient = new CognitoIdentityProviderClient({
	region: REGION,
})

export const handler = async (event) => {
	const {
		userPoolId,
		request: { userAttributes },
	} = event
	const email = userAttributes["email"]

	const comm = new ListUsersCommand({
		UserPoolId: userPoolId,
		Filter: `email = "${email}"`,
	})

	const { Users } = await cognitoClient.send(comm)

	if (Users && Users.length > 0) {
		throw Error("Email already in use")
	}

	return event
}
