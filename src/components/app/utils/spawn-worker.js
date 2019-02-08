function spawnWorker(fn) {
    return new Worker(URL.createObjectURL(new Blob(['(' + fn + ')()'],{type: 'text/javascript'})));
}

export function spawn(fn, count) {

    count = count || 1;

    if (typeof fn !== 'function') {
        throw Error('A function must be passed into a worker as a first argument');
    }

    if (count > 1) {

        var workers = [];

        for (var i = 0; i < count; i++) {

            workers.push(spawnWorker(fn));
        }

        return workers;
    } else {

        return spawnWorker(fn);
    }
}
