
interface OPT {
    storage: true | false,
    port: number | undefined,
    whitelist: Array<string> | undefined,
    hf: string | undefined,
    checkpoint: number | undefined,
    reset_graph: number | undefined,
    reset_listeners: number | undefined
}

const options: OPT = {

    /* Set storage to true to enable persistent data storage */
    "storage": false,

    /* Set the port you want to run the peer on */
    "port": 3000,

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
        Set a reset_listeners interval timers in ms to clear the core's lisetners
        Listeners record all nodes being listened to with all peer's IDs listeting to them
        and while a peer is removed from the listeners when It's disconnected,
        It's "strongly recommended" to use 'resset_listeners' to keep things clear and avoid possible issues
        you can disable this option by setting it to undefined or 0
    */
    "reset_listeners": 6000000,

}

export default options;