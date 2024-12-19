const { 
    putAssetPropertyValue,
} = require("../asset/asset.js");


const getRN = (min, max) => Math.random() * (max - min) + min;

const runGenericSim = async (assetId,propertyId,runCount,low,high,quality,pollInterval) => {
    for(let i=0; i < runCount; i++) {
        const rn = getRN(low,high)

        console.log(assetId,propertyId,`run: ${i} of ${runCount}`,rn)

        await putAssetPropertyValue(assetId,propertyId,rn,quality);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
}

module.exports = { 
    runGenericSim
}