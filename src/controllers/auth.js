const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
global.fetch = require('node-fetch');

const AWS_REGION = process.env.AWS_REGION;
const AWS_CLIENT_ID = process.env.AWS_CLIENT_ID;
const AWS_USER_POOL_ID = process.env.AWS_USER_POOL_ID;

const poolData = {
	UserPoolId: AWS_USER_POOL_ID,
	ClientId: AWS_CLIENT_ID
};
const poolRegion = AWS_REGION || 'eu-west-1';
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		let attributeList = [];

		attributeList.push(
			new AmazonCognitoIdentity.CognitoUserAttribute({
				Name: 'email',
				Value: email
			})
		);

		attributeList.push(
			new AmazonCognitoIdentity.CognitoUserAttribute({
				Name: 'name',
				Value: name
			})
		);

		userPool.signUp(email, password, attributeList, null, function(
			err,
			result
		) {
			if (err) {
				console.log(err);
				return;
			}
			cognitoUser = result.user;
			console.log('user name is ' + cognitoUser.getUsername());
			return res.status(200).json({ success: true });
		});
	} catch (error) {
		return res.status(500).json({ code: 'ERROR', message: error.message });
	}
};

const confirmEmail = async (req, res) => {
	try {
		const { email, code } = req.body;

		const userData = {
			Username: email,
			Pool: userPool
		};

		const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

		cognitoUser.confirmRegistration(code, false, (error, result) => {
			if (error) {
				return res.status(500).json({ code: 'ERROR', message: error.message });
			}

			return res.status(200).json({ result });
		});
	} catch (error) {
		return res.status(500).json({ code: 'ERROR', message: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
			{
				Username: email,
				Password: password
			}
		);

		const userData = {
			Username: email,
			Pool: userPool
		};

		const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function(result) {
				console.log('access token + ' + result.getAccessToken().getJwtToken());
				console.log('id token + ' + result.getIdToken().getJwtToken());
				console.log('refresh token + ' + result.getRefreshToken().getToken());
				return res.status(200).json({
					accessToken: result.getAccessToken().getJwtToken(),
					refreshToken: result.getRefreshToken().getToken(),
					idToken: result.getIdToken().getJwtToken()
				});
			},
			onFailure: function(err) {
				console.log(err);
				return res.status(403).json({ code: 'ERROR', message: err.message });
			}
		});
	} catch (error) {
		return res.status(500).json({ code: 'ERROR', message: error.message });
	}
};

module.exports = {
	registerUser,
	login,
	confirmEmail
};
