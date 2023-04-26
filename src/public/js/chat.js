// CommonJS
const socket = io();


const chatBox = document.getElementById('textIn');

let user;

Swal.fire({
    icon: "info",
    title: "Identificate, por favor.",
    text: "Ingresa el usuario para identificarte en el chat",
    input: "text",
    inputValidator: (value) => {
        if (!value) {
            return "Debes ingresar un nombre para comenzar el chat."
        } else {
            socket.emit("userConnected", {user: value});
        }
    },
    allowOutsideClick: false
}).then(result => {

    user = result.value;
    console.log(result.value);

});

//Parte dos: Guardar mensajes por socketid.
chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user: user, message: chatBox.value }); //{user: Juan, message: "Hola"}
            chatBox.value = ""
        } else {
            Swal.fire({
                icon: "warning",
                title: "Alerta",
                text: "Por favor escribe una palabra, los espacios no son un mensaje valido."
            });
        }
    }
});

socket.on('userConnected', data=>{
    console.log(data);
    let message = `Usuario nuevo conectado: ${data}`;
    Swal.fire({
        icon: "info",
        title: "Nuevo usuario entra al chat!",
        text: message,
        toast: true,
        color: '#716add'
    });
});

socket.on('messageLogs', data => {
    const messageLog = document.getElementById('log');
    let logs = '';
    data.forEach(log => {
        logs += `${log.user} dice: ${log.message}<br/>`
    })
    messageLog.innerHTML = logs;
});
