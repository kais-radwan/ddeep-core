
interface OPT {
    storage: true | false,
    whitelist: Array<string> | undefined,
    hf: string | undefined,
    checkpoint: number | undefined,
    reset_graph: number | undefined,
    encryption_cost: number
}

const options: OPT = {

    /* Set storage to true to enable persistent data storage */
    "storage": false,

    /*
        Set a list of IP adresses (of peers, servers, or websites) that are able to connect to this core
        this can help prevent cross-site connections to your core
    */
    "whitelist": [],

    /* Add your huggingFace token to be used with AI smart policies */
    "hf": undefined,

    /*
        Set a checkpoint interval timer in ms to make a recovery checkpoint of the database
        example: setting "checkpoint" to 60000 will make a point of recover every minute
        this works onyl with persistent storage enabled
    */
    "checkpoint": undefined,

    /*
        Set a reset_graph interval timer in ms to clear the core's cached graph
        example: setting "reset_graph" to 60000 will clear the graph data cache every minute
    */
    "reset_graph": undefined,

    /*
        Set the number of cycles to use in the password hashing algorithm (bcrypt).
        set a number between 4 to 31 (NOT USED AS FOR NOW)
    */
    "encryption_cost": 7

}

export default options;