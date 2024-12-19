const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION_KEY} = require("../secrets/secrets.js")
const { 
    IoTSiteWiseClient, 
    BatchPutAssetPropertyValueCommand,
    GetAssetPropertyValueCommand,
    ListAssetPropertiesCommand,
    ListAssetModelsCommand,
    CreateAssetModelCommand,
    CreateAssetCommand,
    DescribeAssetCommand,
    ListAssetsCommand,

    UpdateAssetCommand,
    DeleteAssetCommand,
    UpdateAssetPropertyCommand
} = require("@aws-sdk/client-iotsitewise");

// Initialize the IoTSiteWise client with hardcoded credentials
const client = new IoTSiteWiseClient({
  // region: "eu-west-1", // Replace with your AWS region
  region: AWS_REGION_KEY,
  credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY},
});

function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const listAssetProperties = async (assetId) => {
  try {
      // Send the command to IoT SiteWise
      const data = await client.send(new ListAssetPropertiesCommand({ assetId: assetId,}));

      // Print the list of properties
      //console.log('Asset Properties:', data.assetPropertySummaries);  
      return  data.assetPropertySummaries;
    } catch (error) {
      console.error('Error listing asset properties:', error);
  }
};

const putAssetPropertyValue = async (assetId,propertyId,doubleValue,quality) => {
  const propertyBody = {
    entries: [
      {
        entryId: generateGUID(),
        assetId: assetId, 
        // propertyAlias: propertyAlias,
        propertyId: propertyId,
        propertyValues: [
          {
            value: { doubleValue: doubleValue },
            timestamp: {
              timeInSeconds: Math.floor(Date.now() / 1000), // Current time
              offsetInNanos: 0, // Optional
            },
            quality: quality // "GOOD", // Data quality (GOOD, BAD, or UNCERTAIN)
          },
        ],
      }
    ]
  }

  try {
    const cmd = new BatchPutAssetPropertyValueCommand(propertyBody);
    const res = await client.send(cmd);
    // console.log(`${propertyAlias} - Property values updated successfully:`, res);
  }
  catch(error) {
    console.error("Error updating property values:", error);
  }
}

const createModel = async (modelName, modelDescription, properties) => {
  try {
    // Define the input parameters for the CreateAssetModelCommand
    const input = {
      assetModelName: modelName,
      assetModelDescription: modelDescription,
      assetModelProperties: properties // Array of properties to define on the model
    };

    // Create the command object
    const command = new CreateAssetModelCommand(input);

    // Send the command to create the asset model
    const response = await client.send(command);

    console.log("Model Created Successfully:", response);
    return response; // Contains the model ID and status
  } catch (err) {
    console.error("Error Creating Model:", err);
    throw err;
  }
};

const listAssetModels = async () => {
  try {
    let nextToken = null; // For handling pagination
    console.log("Fetching IoT SiteWise Asset Models...");

    do {
      // Prepare the command with optional pagination token
      const command = new ListAssetModelsCommand({
        nextToken: nextToken, // Retrieve the next page if available
        maxResults: 10        // Number of results per page (adjust as needed)
      });

      // Send the command
      const response = await client.send(command);

      // Display the asset models
      if (response.assetModelSummaries && response.assetModelSummaries.length > 0) {
        response.assetModelSummaries.forEach(model => {
          console.log(`Model Name: ${model.name}`);
          console.log(`Model ID: ${model.id}`);
          console.log(`Model ARN: ${model.arn}`);
          console.log(`Creation Date: ${model.creationDate}`);
          console.log('-----------------------------');
        });
      } else {
        console.log("No asset models found.");
      }

      // Set the nextToken for pagination
      nextToken = response.nextToken;

    } while (nextToken); // Continue fetching if there's another page

    console.log("Finished listing asset models.");
  } catch (err) {
    console.error("Error listing asset models:", err);
  }
};

const listAllAssets = async () => {
  try {
    let assetModels = [];
    let nextToken = null;

    console.log("Fetching all asset models...");

    // Step 1: List all Asset Models
    do {
      const listAssetModelsCommand = new ListAssetModelsCommand({
        nextToken: nextToken,
        maxResults: 50
      });

      const response = await client.send(listAssetModelsCommand);
      assetModels = assetModels.concat(response.assetModelSummaries);
      nextToken = response.nextToken;

    } while (nextToken);

    console.log(`Found ${assetModels.length} asset models.`);

    // Step 2: List assets for each asset model
    for (const model of assetModels) {
      console.log(`\nListing assets for Asset Model: ${model.name} (ID: ${model.id})`);

      let assetNextToken = null;
      do {
        const listAssetsCommand = new ListAssetsCommand({
          assetModelId: model.id,
          nextToken: assetNextToken,
          maxResults: 50
        });

        const assetResponse = await client.send(listAssetsCommand);
        assetResponse.assetSummaries.forEach((asset) => {
          console.log("Asset:",asset);
          
          //console.log(`Asset Name: ${asset.name}`);
          //console.log(`Asset ID: ${asset.id}`);
          //console.log(`Asset Status: ${asset.status.state}`);
          //console.log(`Model ID: ${model.id}`);
          console.log("----------------------------------");
        });

        assetNextToken = assetResponse.nextToken;

      } while (assetNextToken);
    }

    console.log("\nAll assets listed successfully.");
  } catch (error) {
    console.error("Error listing assets across models:", error);
  }
};


const getModelUUIDByName = async (modelName) => {
  let nextToken = undefined;
  try {
    // Continuously fetch all pages of models
    do {
      const command = new ListAssetModelsCommand({
        nextToken: nextToken
      });

      const data = await client.send(command);

      // Check if the model exists in this page
      const model = data.assetModelSummaries.find(model => model.name === modelName);
      if (model) {
        console.log(`Model UUID: ${model.id}`);
        return model.id // Stop once the model is found
      }

      // Set the nextToken for the next page, if present
      nextToken = data.nextToken;
    } while (nextToken); // Continue until there are no more pages

    // If we finish all pages and don't find the model
    console.log("Model not found.");
  } catch (error) {
      console.error("Error fetching model: ", error);
  }
}

const createAsset = async (modelId,name,description) => {
  console.log(modelId,name,description)
  
  try {
      // Prepare the input for the CreateAssetCommand
      const input = {
          assetName: name,
          assetModelId: modelId,
          assetDescription: description,  
          assetExternalId: name + "_EXT",         
      };

      // Send the CreateAssetCommand
      const command = new CreateAssetCommand(input);
      const response = await client.send(command);

      await pollStateChange(response.assetId,"ACTIVE")
      const assetProperties = await listAssetProperties(response.assetId)

      // ENABLE Topics
      await updateAssetProperties(response.assetId,assetProperties)

      console.log("Asset created successfully:",response);
      return response; // Return the response object for further processing if needed
  } catch (error) {
      console.error("Error creating asset:", error);
      throw error;
  }
}

const createAssets = async (modelName,assets) => {
  const modelId = await getModelUUIDByName(modelName)
  if(modelId.length>0) {
    for(i=0; i< assets.length; i++) {
      await createAsset(modelId,assets[i].name,assets[i].description)
    }
  }
}

const pollStateChange = async (assetId, desiredState, pollInterval = 2800, maxRetries = 20) => {
  let retries = 0;
  console.log(`Polling asset state for Asset ID: ${assetId}`);

  while (retries < maxRetries) {
      try {
          // Describe the asset to check its current state
          const command = new DescribeAssetCommand({ assetId });
          const response = await client.send(command);

          const currentState = response.assetStatus.state;
          console.log(`Current asset state: ${assetId} is ${currentState}`);

          // Check if the asset state is ACTIVE
          if (currentState === desiredState) {
              console.log(`Asset ${assetId} is now ${currentState}`);
              return response; // Return the asset details
          }

          // If not ACTIVE, wait for the next poll
          retries++;
          await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
          console.error("Error describing asset:", error);
          throw error;
      }
  }

  throw new Error(`Asset did not reach ACTIVE state within ${maxRetries} retries.`);
};

const updateAssetProperties = async (assetId,assetProperties) => {
  for (let i=0; i < assetProperties.length; i++) {
    // console.log(`Enabling MQTT for PropertyId: ${assetProperties[i].id} Topic: ${assetProperties[i].notification.topic}...`);
    await client.send(
      new UpdateAssetPropertyCommand({
        assetId: assetId,
        propertyId: assetProperties[i].id,
        propertyAlias: `/station/pump/${generateGUID()}`,

        propertyNotificationState: "ENABLED", // Enable MQTT notifications
        propertyNotificationTopic: assetProperties[i].notification.topic, // Use the provided MQTT topic
      })
    );
    console.log(`Property ${assetProperties[i].id} set to MQTT active.`);
  }
}

const listAllAssetsByModelId = async (modelId) => {
  let nextToken = undefined; // Initialize nextToken for pagination
  const allAssets = []; // Array to store all assets

  try {
    do {
      // Fetch the current page of assets
      const command = new ListAssetsCommand({
        assetModelId: modelId, // Filter by the provided ModelId
        nextToken: nextToken, // For pagination
      });

      const response = await client.send(command);

      // Add the assets from this page to the array
      allAssets.push(...response.assetSummaries);

      // Update nextToken to fetch the next page
      nextToken = response.nextToken;
    } while (nextToken); // Continue as long as nextToken is present

    // Log the total list of assets
    if (allAssets.length > 0) {
      // console.log(`Found ${allAssets.length} assets for ModelId ${modelId}:`);
      //for(let i=0; i < allAssets.length; i++) {
      //  console.log(`- Asset Name: ${allAssets[i].name}, Asset ID: ${allAssets[i].id}`)
      //}
      return allAssets
    } else {
      console.log(`No assets found for ModelId ${modelId}.`);
    }
  } catch (error) {
    console.error("Error listing assets: ", error);
  }
  return allAssets
}

const deleteAssets = async (modelName) => {
  const modelId = await getModelUUIDByName(modelName)
  console.log("ModelId:",modelId)
  const assets = await listAllAssetsByModelId(modelId);

  for(let i=0; i < assets.length; i++) {//
    await deleteAsset(assets[i].id,assets[i].name)
  }
}

const deleteAsset = async (assetId,name) => {
  console.log("DELETE Asset:",assetId)

  try {
    // Step 1: Update the asset state to DEPRECATED
    //console.log(`Updating asset ${assetId} to DEPRECATED state...`);
    //const updateCommand = new UpdateAssetCommand({
    //  assetId: assetId,
    //  assetName: name,      
    //  assetStatus: { state: "DEPRECATED" },
    //})

    //await client.send(updateCommand);

    //await pollStateChange(assetId,"DEPRECATED")
    // console.log(`Asset ${assetId} updated to DEPRECATED state.`);

    // Step 2: Delete the asset
    console.log(`Deleting asset ${assetId}...`);
    const deleteCommand = new DeleteAssetCommand({ 
      assetId: assetId,
      assetName: name,      
    });
    await client.send(deleteCommand);

    console.log(`Asset ${assetId} successfully deleted.`);
  } catch (error) {
    console.error(`Error deleting asset ${assetId}:`, error);
  }
}


/*
Notification will be published to topic 
$aws/sitewise/asset-models/030f486a-d3b2-4112-8848-52e426823278/assets/2b24423e-3f32-4bd5-a19a-c0e44a522497/properties/c986ef7c-cfef-4695-945c-646fb6920db1.
*/

module.exports = { 
  createModel,
  createAssets,
  getModelUUIDByName,
  deleteAssets,


  putAssetPropertyValue,
  // getAssetPropertyValue,
  listAssetProperties,

  listAssetModels,
  listAllAssets
};
