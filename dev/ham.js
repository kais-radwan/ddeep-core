/*
    This file was not modified, for license see https://github.com/amark/gun/blob/master/LICENSE.md
*/
function HAM (machineState, incomingState, currentState, incomingValue, currentValue) {
  if (machineState < incomingState) return { defer: true }
  if (incomingState < currentState) return { historical: true }
  if (currentState < incomingState) return { converge: true, incoming: true }

  if (incomingState === currentState) {
    let res

    incomingValue = JSON.stringify(incomingValue) || ''
    currentValue = JSON.stringify(currentValue) || '';

    (incomingValue === currentValue)
      ? res = { state: true }
      : (incomingValue < currentValue)
          ? res = { converge: true, current: true }
          : (currentValue < incomingValue)
              ? res = { converge: true, incoming: true }
              : res = false

    if (res) { return res };
  }

  return { err: 'Invalid CRDT Data: ' + incomingValue + ' to ' + currentValue + ' at ' + incomingState + ' to ' + currentState }
}

HAM.mix = (change, graph) => {
  const machine = (+new Date()); let diff

  Object.keys(change).forEach((soul) => {
    const node = change[soul]

    Object.keys(node).forEach((key) => {
      const val = node[key]
      if (key === '_') return

      const state = node._['>'][key]
      const was = (graph[soul] || { _: { '>': {} } })._['>'][key] || -Infinity
      const known = (graph[soul] || {})[key]
      const ham = HAM(machine, state, was, val, known)

      if (!ham.incoming) {
        if (ham.defer) console.log('DEFER', key, val)
        return
      }

      (diff || (diff = {}))[soul] = diff[soul] || node

      graph[soul] = graph[soul] || node
      graph[soul][key] = diff[soul][key] = val
      graph[soul]._['>'][key] = diff[soul]._['>'][key] = state
    })
  })

  process.graph = diff
  return diff
}

try { module.exports = HAM } catch (e) { };
