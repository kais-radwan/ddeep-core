
interface LexData {
    '#': any,
    '.': any
};

const get_from_graph = (lex: LexData, graph: any) => {

    if (!graph || !lex) { return undefined };
    
    let soul = lex['#'];
    let key = lex['.'];
    let node = graph[soul];
    let ack: any = {};

    if (!node) { return null };

    if (!key) {
        ack[soul] = node;
        return ack;
    }

    let tmp = node[key];
    if (!tmp) { return null };

    (node = { _: node._ })[key] = tmp;
    tmp = node._['>'];
    (node._['>'] = {})[key] = tmp[key];

    ack[soul] = node;
    return ack;
}

export default get_from_graph;