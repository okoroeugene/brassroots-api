var sockets = {};
const firestore = require('../../config');
const leaveSession = require('../../src/services/leaveSession');

let connected = {};

sockets.init = function (server) {
    // socket.io setup
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket) {
        socket.on('init', id => {
            connected[socket.id] = id;
        })

        socket.on('disconnect', async function (err) {
            console.log("user just got disconnected");
            const id = connected[socket.id];

            var user = await (await firestore.collection('users').doc(id).get()).data();
            // console.log(user)
            if (user && user.currentSession) {
                const sessionDoc = await firestore.collection('sessions').doc(user.currentSession).get();
                // const trackDoc = await firestore.collection('tracks').doc(sessionDoc.data().currentTrackID).get();
                // console.log("sesssssssiiiioooonn")
                // console.log(sessionDoc.data())

                const sessionToLeave = {
                    coords: sessionDoc.data().coords,
                    total: sessionDoc.data().totals.listeners,
                    // track: trackDoc.data(),
                    chatUnsubscribe: () => console.log('chat'),
                    infoUnsubscribe: () => console.log('info'),
                    queueUnsubscribe: () => console.log('queue'),
                    id: user.currentSession,
                };

                const owner = {
                    id: sessionDoc.data().owner.id,
                    name: sessionDoc.data().owner.name,
                    image: sessionDoc.data().owner.image,
                };

                if (
                    owner
                    && id
                    && typeof sessionToLeave.total === 'number'
                    // && sessionToLeave.track
                    && sessionToLeave.chatUnsubscribe
                    && sessionToLeave.infoUnsubscribe
                    && sessionToLeave.queueUnsubscribe
                ) {
                    await leaveSession(id, sessionToLeave, owner);
                } else {
                    console.log("there was an error while removing user from session (parameters may be missing)");
                }
            } else {
                console.log("user does not have an active session");
            }
        });
    });
}

module.exports = sockets;