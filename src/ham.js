function HAM(machineState, incomingState, currentState, incomingValue, currentValue) {

    if (machineState < incomingState) return { defer: true };
    if (incomingState < currentState) return { historical: true };
    if (currentState < incomingState) return { converge: true, incoming: true };

    if (incomingState === currentState) {

        incomingValue = JSON.stringify(incomingValue) || "";
        currentValue = JSON.stringify(currentValue) || "";

        if (incomingValue === currentValue) return { state: true };
        if (incomingValue < currentValue) return { converge: true, current: true };
        if (currentValue < incomingValue) return { converge: true, incoming: true };

    }

    return { err: "Invalid CRDT Data: " + incomingValue + " to " + currentValue + " at " + incomingState + " to " + currentState };
}

HAM.mix = (change, graph) => {

    var machine = (+new Date), diff;

    Object.keys(change).forEach((soul) => {

        var node = change[soul];

        Object.keys(node).forEach((key) => {

            var val = node[key];
            if ('_' == key) return;

            var state = node._['>'][key];
            var was = (graph[soul] || { _: { '>': {} } })._['>'][key] || -Infinity;
            var known = (graph[soul] || {})[key];
            var ham = HAM(machine, state, was, val, known);

            if (!ham.incoming) {
                if (ham.defer) console.log("DEFER", key, val);
                return;
            }

            (diff || (diff = {}))[soul] = diff[soul] || node;

            graph[soul] = graph[soul] || node;
            graph[soul][key] = diff[soul][key] = val;
            graph[soul]._['>'][key] = diff[soul]._['>'][key] = state;

        });

    });

    return diff;

}

try { module.exports = HAM } catch (e) { };