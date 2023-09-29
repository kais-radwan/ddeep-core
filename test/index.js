var peer = new WebSocket('ws://localhost:9999');

peer.onopen = function(o){ 
	console.log('open', o);
    var msg = {
      '#': dup.track(Dup.random()),
      get: {'#': 'people'},//, '.': 'species'},
			auth: true
    }
    peer.send(JSON.stringify(msg));
  //},2000);
  
}
peer.onmessage = (data) => {
	console.log(data);
}

peer.onopen = function(o){ 
	console.log('open', o);
    var msg = {
      '#': dup.track(Dup.random()),
      put: {
        people: {_: {'#': 'people', '>': {name: 2, boss: 2}},
          name: "Kais"
        }
      },
			auth: true
    }
    peer.send(JSON.stringify(msg));
  //},2000);
  
}
