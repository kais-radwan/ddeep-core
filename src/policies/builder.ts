
type Operation = 'get' | 'put' | 'delete' | 'all';
type PolicyType = 'check' | 'smart' | undefined;

export interface Policy {
    type: PolicyType,
    operations: Array<Operation>,
    graph: string,
    check: Function
}

interface Builder {
    build: Function,
    one: Function
}

let builder: Builder = {

    build: (data: Array<Policy>): any => {

        let policies: any = {
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

    },

    one: (type: PolicyType, operations: Array<Operation>, graph: string, cb: Function): Policy => {

        if (operations.indexOf("all") > -1) {
            operations = ["get", "put", "delete"];
        }
    
        let pol: Policy = {
            type,
            operations,
            graph,
            check: cb
        }
    
        return pol;
    
    }

}

export default builder;