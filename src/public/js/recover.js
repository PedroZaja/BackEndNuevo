const form = document.getElementById('restoreForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => {
        obj[key] = value
    });

    fetch('/api/sessions/recover', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
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
            alert("An email has been sent to reset your password");
        })
});