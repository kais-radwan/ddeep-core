
import { HfInference } from "@huggingface/inference";
import opt from '../../ddeep.config';

// Process AI text classification
async function classify (data: any) {

    var hf:any = opt.hf;
    var classes:any = {};

    // Make data a string if It's not
    if (typeof data === "object"){
        data = data[Object.keys(data)[0]];
        var val:Array<any> = [];
        for (var key in data) {
            if (key !== "_"){ 
                var keyValue:string = data[key];
                if (typeof keyValue !== "number") val.push(keyValue);
            }
        }
        data = JSON.stringify(val);
    }

    // Create a HuggingFace instance
    var instance = new HfInference(hf);

    try {

        // Classify the data
        const res = await instance.textClassification({
            model: 'SamLowe/roberta-base-go_emotions',
            inputs: data
        });

        // Throw an error if the result is invalid
        if (!res || typeof res !== 'object') {
            console.error("Smart policy processing error");
            return undefined;
        }

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

    catch (err) {
        console.error(`${err}`);
    }

}

export default classify;