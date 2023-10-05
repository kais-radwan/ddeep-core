var get_from_graph = (lex, graph) => {

    var soul = lex['#'];
    var key = lex['.'];
    var node = graph[soul];
    var ack = {};

    if (!node) {return null};

    if (key) {

        var tmp = node[key];
        if (!tmp) {return null};

        (node = { _: node._ })[key] = tmp;
        tmp = node._['>'];
        (node._['>'] = {})[key] = tmp[key];

    }

    ack[soul] = node;
    return ack;

}

module.exports = get_from_graph;