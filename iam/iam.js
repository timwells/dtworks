const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION_KEY} = require("../secrets/secrets.js")
const { 
    IAMClient, 
    GetPolicyCommand, 
    GetPolicyVersionCommand,    
    ListPoliciesCommand,
    CreatePolicyCommand
} = require("@aws-sdk/client-iam");

////////////////////////////////////////////////////////////////////////////////////////////////////
const client = new IAMClient({
    region: AWS_REGION_KEY,
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY},
});

const listCustomPolicies = async () => {    
  const input = {
    Scope: "Local", // "Local" lists only customer-managed policies. Use "AWS" for AWS-managed policies.
    // MaxItems: 10, // Optional: Limit the number of policies returned per request
  };

  try {
    const command = new ListPoliciesCommand(input);
    const response = await client.send(command);

    console.log("Custom Policies:");
    response.Policies.forEach((policy) => {
      console.log(`- Name: ${policy.PolicyName}, ARN: ${policy.Arn}`);
    });
  } catch (error) {
    console.error("Error listing custom policies:", error);
  }
};
const getPolicyContent = async (policyArn) => {
  try {
    // Step 1: Get the policy details
    const getPolicyCommand = new GetPolicyCommand({ PolicyArn: policyArn });
    const policyResponse = await client.send(getPolicyCommand);

    const defaultVersionId = policyResponse.Policy.DefaultVersionId;

    // Step 2: Get the policy version content
    const getPolicyVersionCommand = new GetPolicyVersionCommand({
      PolicyArn: policyArn,
      VersionId: defaultVersionId,
    });
    const versionResponse = await client.send(getPolicyVersionCommand);

    console.log("Policy Content:");
    // console.log(JSON.stringify(versionResponse.PolicyVersion.Document, null, 2));
    const rawDocument = versionResponse.PolicyVersion.Document;
    const decodedDocument = decodeURIComponent(rawDocument);

    console.log(JSON.stringify(JSON.parse(decodedDocument), null, 2));

  } catch (error) {
    console.error("Error retrieving policy content:", error);
  }
};

const createIamPolicy = async () => {
  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
        ],
        Resource: [
          "arn:aws:s3:::my-bucket-name",
          "arn:aws:s3:::my-bucket-name/*",
        ],
      },
    ],
  };

  const input = {
    PolicyName: "MyXS3AccessPolicy", // Name of the policy
    PolicyDocument: JSON.stringify(policyDocument), // Policy document in JSON format
    Description: "Policy to allow access to my S3 bucket",
  };

  try {
    const command = new CreatePolicyCommand(input);
    const response = await client.send(command);
    console.log("Policy created successfully:", response.Policy);
  } catch (error) {
    console.error("Error creating IAM policy:", error);
  }
};

module.exports = { 
    listCustomPolicies,
    getPolicyContent,
    createIamPolicy
}
