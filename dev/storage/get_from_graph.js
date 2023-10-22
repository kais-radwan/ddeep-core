const get_from_graph = (lex, graph) => {
  const soul = lex['#']
  const key = lex['.']
  let node = graph[soul]
  const ack = {}

  if (!node) { return null };

  if (!key) {
    ack[soul] = node;
    return ack;
  }

  let tmp = node[key]
  if (!tmp) { return null };

  (node = { _: node._ })[key] = tmp
  tmp = node._['>'];
  (node._['>'] = {})[key] = tmp[key]

  ack[soul] = node;
  return ack;
}

module.exports = get_from_graph
