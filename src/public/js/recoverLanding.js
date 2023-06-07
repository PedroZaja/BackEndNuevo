const form = document.getElementById('recoverForm');

form.addEventListener('submit', event => {
    event.preventDefault();

    let password = document.getElementById('passwordInput').value;
    let token = document.getElementById('token').innerHTML;

    let data = {
        token,
        password
    }

    fetch('/api/session/restorePass', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            return result.json();
        } else {
            alert(`Error restoring password`)
            throw new Error('Error restoring password');
        }
    }).then(
        json => {
            console.log(json);
            alert("The password has been restored succesfully");
        })
});