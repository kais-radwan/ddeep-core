
interface UnsubscribeMsg {
    unsubscribe: {
        '#': string,
    }
}

const unsubscribe = (ws: any, data: UnsubscribeMsg): void => {

    try {
        if (ws.isSubscribed(data.unsubscribe['#'])) {
            ws.unsubscribe(data.unsubscribe['#']);
            ws.send('0');
        } else {
            ws.send('1');
        }
    }

    catch (err) {
        ws.send('1');
    }

}

export default unsubscribe;