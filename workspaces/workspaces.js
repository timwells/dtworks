const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION_KEY} = require("../secrets/secrets.js")
const { 
    IoTTwinMakerClient, 
    CreateWorkspaceCommand,
    ListScenesCommand
} = require("@aws-sdk/client-iottwinmaker");

const client = new IoTTwinMakerClient({
    region: AWS_REGION_KEY,
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY},
  });


const createWorkspace = async () => {

  const input = {
    workspaceId: "MyWorkspace",
    //s3Location: "s3://dt-pumpingstation/",
    //role: "arn:aws:iam::123456789012:role/MyTwinMakerRole",
  };

  try {
    const command = new CreateWorkspaceCommand(input);
    const response = await client.send(command);

    console.log("Workspace created:", response);

  } catch (error) {
    console.error("Error creating workspace:", error);
  }
};

const listScenes = async () => {

  try {
    const command = new ListScenesCommand({ workspaceId: "FactoryWorkspace" });
    const response = await client.send(command);

    console.log("Scenes in workspace:", response.sceneSummaries);
  
    } catch (error) {
    console.error("Error listing scenes:", error);
  }
};



module.exports = { 
    createWorkspace,
    listScenes,
}
