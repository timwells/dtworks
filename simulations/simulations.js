
const { 
    putAssetPropertyValue,
} = require("../asset/asset.js");


const getRN = (min, max) => Math.random() * (max - min) + min;

const runGenericSim = async (assetId,propertyId,runCount,low,high,pollInterval) => {
    for(let i=0; i < runCount; i++) {
        const speed = getRN(low,high)

        console.log(assetId,propertyId,`run: ${i} of ${runCount}`,speed)

        await putAssetPropertyValue(assetId,propertyId,speed,"GOOD");
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
}

module.exports = { 
    runGenericSim
}