const form = document.getElementById('restoreForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => {
        obj[key] = value
    });

    fetch('/api/sessions/restore', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            result.json();
            alert("Password restored successfully")
            window.location.replace('/users/login');
        } else {
            alert(`Error restoring password`)
        }
    }).then(
        json => console.log(json));
});