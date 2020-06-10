const firestore = require('../../config');
const moment = require('moment');

module.exports = async function (
    userID,
    session,
    owner,
) {
    const geoRef = await firestore.collection('geo');
    const sessionRef = await firestore.collection('sessions').doc(session.id);
    const userRef = await firestore.collection('users').doc(userID);

    let batch = await firestore.batch();

    try {
        const timeLeft = moment().format('ddd, MMM D, YYYY, h:mm:ss a');

        if (owner.id === userID) {
            if (session.total === 1) {
                console.log("leaving session ooo====================================================")
                batch.update(sessionRef, { live: false, "totals.listeners": 0, paused: true });
            } else {
                const sessionUsers = await sessionRef.collection('users').where('active', '==', true).get();
                const newOwnerDoc = sessionUsers.docs[Math.floor(Math.random() * sessionUsers.docs.length)];

                batch.update(
                    sessionRef,
                    {
                        "totals.listeners": session.total - 1,
                        "owner.id": newOwnerDoc.data().id,
                        "owner.name": newOwnerDoc.data().displayName,
                        "owner.image": newOwnerDoc.data().profileImage,
                    }
                );
            }
        } else {
            batch.update(sessionRef, { 'totals.listeners': session.total - 1 });
        }

        batch.update(sessionRef.collection('users').doc(userID), { timeLeft, active: false, paused: true });
        batch.update(userRef, { currentSession: null, online: false });
        batch.update(userRef.collection('sessions').doc(session.id), { timeLeft });

        await batch.commit();
        console.log("committed jare!!!")
    } catch (err) {
        console.log("error: " + err);
    }
}