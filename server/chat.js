const admin = require('firebase-admin')
let serviceAccount = require('your chat-socket.json files here')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chat-socket-f2ab3.firebaseio.com"
});

let db = admin.firestore()
let ref =  db.collection('/messages')


// Chat functions
const sendMessage = (from, message) => {

    return new Promise((resolve, reject) => {
        ref.get()
            .then((snapshot) => {
                let num = 0
                snapshot.forEach((doc) => num++)

                let newSms = ref.doc(`${num}`).set({
                    from,
                    id: num ,
                    message,
                })
                resolve(true)

            })
            .catch((err) => {
                console.log('Error getting messages', err)
                reject(err)
            });
    })

}

let newMessage = []
const readMessages =  (io) => {
    let messages = []
    ref.orderBy('id', 'asc').get()
        .then(snapshot => {
            snapshot.forEach((doc) => messages.push(doc.data()))

            newMessage = messages[messages.length -1]
            io.emit('messages', newMessage)

        })
        .catch(err => {
            console.log(`Encountered error: ${err}`);
        });

}


module.exports = {
    sendMessage,
    readMessages
}