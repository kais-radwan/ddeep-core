/*
    This file was not modified, for license see https://github.com/amark/gun/blob/master/LICENSE.md
*/
function HAM (machineState, incomingState, currentState, incomingValue, currentValue) {
  if (machineState < incomingState) { 
    return { defer: true };
  }
  
  else if (incomingState < currentState) {
    return { historical: true };
  }

  else if (currentState < incomingState) {
    return { converge: true, incoming: true };
  }

  else if (incomingState === currentState) {

    incomingValue = JSON.stringify(incomingValue) || ''
    currentValue = JSON.stringify(currentValue) || '';

    if (incomingValue === currentValue) {
      return { state: true }
    }

    else if (incomingValue < currentValue) {
      return { converge: true, current: true }
    }

    else if (currentValue < incomingValue) {
      return { converge: true, incoming: true }
    }

  }

  return {
    err: `Invalid CRDT Data: ${incomingValue} to ${currentValue} at ${incomingState} to ${currentState}`
  }

}

HAM.mix = (change, graph) => {
  const machine = (+new Date()); let diff

  Object.keys(change).forEach((soul) => {
    const node = change[soul]

    Object.keys(node).forEach((key) => {
      const val = node[key]
      if (key === '_') { return };

      const state = node._['>'][key]
      const was = (graph[soul] || { _: { '>': {} } })._['>'][key] || -Infinity
      let known = {};
      if (graph[soul]) {
        known = graph[soul][key];
      }else {
        known = known[key]
      }
      const ham = HAM(machine, state, was, val, known);

      if (!ham.incoming && ham.defer) {
        console.error('DEFER', key, val);
        return;
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

module.exports = HAM;