
interface policy {
    type: "check"|"smart",
    operations: Array<"get"|"put"|"delete"|"all">,
    graph: string,
    check: Function
}

function policies_builder (data:Array<policy>) {

    var policies:any = {
        "get": {},
        "put": {},
        "delete": {}
    }

    data.forEach(pol => {
        pol.operations.forEach(op => {
            policies[op][pol.graph] = {
                type: pol.type,
                check: pol.check
            }
        })
    });

    return policies;

}

module.exports = policies_builder;