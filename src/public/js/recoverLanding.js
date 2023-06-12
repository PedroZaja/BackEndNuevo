const form = document.getElementById('recoverForm');

form.addEventListener('submit', event => {
    event.preventDefault();

    let password = document.getElementById('passwordInput').value;
    let token = document.getElementById('token').innerHTML;

    let data = {
        token,
        password
    }

    fetch('/api/sessions/restorePass', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            return result.json();
        } else {
            return result.json().then(json => {
                throw new Error(json.error);
            });
        }
    }).then(
        json => {
            console.log(json);
            alert(`Status: ${json.status}\nMessage: ${json.message}`);
        }).catch(error => {
            console.error(error);
            alert(`Error restoring password: ${error.message}`);
        });
});