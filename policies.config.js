
module.exports = [

    {
        name: "auth_policy",
        operations: ["read", "write"],
        type: "check",
        graph: ["people", "kais"],

        check(instance, data) {

            if (instance.auth() === data.auth()) return true;

            if (instance.auth() !== data.auth()) return false;

        }

    }

];