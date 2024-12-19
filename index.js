const { 
    //getAssetPropertyValue,
    listAssetProperties,
    putAssetPropertyValue,
    listAssetModels,
    createModel,
    createAssets,
    listAllAssets,

    deleteAssets,
} = require("./asset/asset.js");



const {
    runSpeedSim,
    runGenericSim
} = require("./simulations/simulations.js");

const { 
    STATION_PUMP_MOTOR_MODEL_NAME,
    STATION_PUMP_MOTOR_MODEL_DESCRIPTION,    
    STATION_PUMP_MOTOR_MODEL_PROPERTIES 
} = require("./models/motor_models.js")


// Data quality (GOOD, BAD, or UNCERTAIN)
const PUMP_STATION_MOTOR_ASSETS = [
    { name: "Pump_Station_Motor_1", description: "Pump Station Motor 1"},
    //{ name: "Pump_Station_Motor_2", description: "Pump Station Motor 2" },
    //{ name: "Pump_Station_Motor_3", description: "Pump Station Motor 3" },
];

// await putAssetPropertyValue();
// await getAssetPropertyValue()
// await listAssetProperties(ASSET_ID);
//await putAssetPropertyValue(ASSET_ID,ASSET_MOTOR1_SPEED_ID,ASSET_MOTOR1_SPEED_ALIAS,1300.0,"GOOD");
//await putAssetPropertyValue(ASSET_ID,ASSET_MOTOR1_TEMPERATIURE_ID,ASSET_MOTOR1_TEMPERATIURE_ALIAS,21.5,"GOOD");

const PUMP1_ASSET_ID = 'd5820351-59eb-4c94-a9e0-b17921da8d50';
const PUMP1_ASSET_SPEED_ID = 'c7aaac15-32d8-44b1-9e3e-a41f05a58a10';
const PUMP1_ASSET_TEMP_ID = 'ed66b0fc-cb30-4fae-a1a0-55dd4d2f2134';

const runSimulations = async (iterations,pollRate) => {
    for(let i=0; i < iterations;i++) {
        await runGenericSim(PUMP1_ASSET_ID,PUMP1_ASSET_SPEED_ID,1,1180,1210,"GOOD",pollRate);
        await runGenericSim(PUMP1_ASSET_ID,PUMP1_ASSET_TEMP_ID,1,18.5,21.2,"GOOD",pollRate);
    }
}

(async () => {

    // await createModel(STATION_PUMP_MOTOR_MODEL_NAME, STATION_PUMP_MOTOR_MODEL_DESCRIPTION, STATION_PUMP_MOTOR_MODEL_PROPERTIES);    
    
    // await createAssets(STATION_PUMP_MOTOR_MODEL_NAME,PUMP_STATION_MOTOR_ASSETS,STATION_PUMP_MOTOR_MODEL_PROPERTIES);
    await runSimulations(5,3000)
    
    // await deleteAssets(STATION_PUMP_MOTOR_MODEL_NAME)

    // await listAssetModels();
    // await listAllAssets();
})();
