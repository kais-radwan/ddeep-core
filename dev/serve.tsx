const server = Bun.serve({

    fetch(req, server) {

        const success = server.upgrade(req);

        if (success) {
            return undefined;
        }

        return new Response('ddeep-core: open websocket connections please...');

    },

    websocket: {

        open(ws) {
            ws.subscribe('demo');
        },

        message(ws, message) {
            ws.publish('demo', message);
        },

        close(ws) {
            ws.unsubscribe('demo');
        }

    }

})

console.log(`ddeep-core is listening on ${server.hostname}:${server.port}`);