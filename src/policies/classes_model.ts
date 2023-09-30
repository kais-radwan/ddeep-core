
import { HfInference } from "@huggingface/inference";
import * as opt from "../../ddeep.config";

// Process AI text classification
async function getAIClasses (data:any) {

    var hf:any = opt.hf;
    var classes:any = {};

    // Make data a string if It's not
    if (typeof data === "object"){
        var val:Array<any> = [];
        for (var key in data) {
            var keyValue:string = data[key];
            val.push(keyValue);
        }
        data = JSON.stringify(val);
    }

    // Create a HuggingFace instance
    var hfInstance = new HfInference(hf);

    try {

        // Classify the data
        const res = await hfInstance.textClassification({
            model: 'SamLowe/roberta-base-go_emotions',
            inputs: data
        });

        // Throw an error if the result is invalid
        if (!res || typeof res !== "object") throw new Error("Smart policy processing error");

        // Loop over the classes and build the classes object
        for (var classification in res) {
        
            // Define field values
            var value = res[classification];
            var label = value?.label;
            var score = value?.score;

            // If the values are valid add the class to classes
            if (label && score) {
                classes[label] = score;
            }

        }

        // Return the data classes
        return classes;
    
    }

    // Catching the error. this is not useful for now but will be soon when we build errors pool
    // so you can track every error in your application
    catch (err) {

        throw new Error(`${err}`);

    }

}

module.exports = getAIClasses;