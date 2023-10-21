
interface policy {
    type: "check"|"smart",
    operations: Array<"get"|"put"|"delete"|"all">,
    graph: string,
    check: Function
}

function build_policy (
    type:"check"|"smart", 
    operations:Array<"get"|"put"|"delete"|"all">, 
    graph:string, 
    cb:Function
)
{

    if (operations.indexOf("all") > -1) {
        operations = ["get", "put", "delete"];
    }

    var pol:policy = {
        type,
        operations,
        graph,
        check: cb
    }

    return pol;

}

module.exports = build_policy;