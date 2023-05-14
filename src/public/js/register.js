const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => {
        console.log(result)
        if (result.status === 201) {
            window.location.replace('/users/login');

        } else if (result.status === 401) {
            console.log(result);
            alert("Invalid login, check your credentials!");
        } else {
            console.log(result);
            alert(`Error: creating the user`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

});