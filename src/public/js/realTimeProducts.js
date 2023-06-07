const socket = io();

//Update and render the products with websocket
socket.on('update-products', (data) => {

    const products = document.getElementById('products');
    let renderedProducts = "";

    data.forEach(p => {
        renderedProducts += `
        <div class="product-card">
        <h4>${p.titulo}</h3>
        <p>${p.descripcion}</p>
        <p>Price: $ ${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <p>Code: ${p.code}</p>
        <p>ID: ${p._id}</p>
        <button class="btn btn-danger delete-btn" data-id="${p._id}">Delete</button>
        </div>`
    })

    products.innerHTML = renderedProducts;

    // Delete an existing product
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-id');

            fetch('/realtimeproducts/' + productId, {
                method: 'DELETE'
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to delete product.');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    });
});

//Get the data from the Form and generate HTTP Request to server
const productForm = document.getElementById('product-form');
const actionSelect = document.getElementById('operation');
const idField = document.getElementById('id-field');
const idInput = document.getElementById('id');

actionSelect.addEventListener('change', (event) => {
    if (event.target.value === 'edit') {
        idField.style.display = 'block';
    } else {
        idField.style.display = 'none';
    }
});

productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(productForm);
    formData.delete("operation");
    const productData = Object.fromEntries(formData.entries());

    // Validations
    const action = actionSelect.value;

    if (action === 'add') {

        if (!productData.titulo || !productData.descripcion || !productData.precio || !productData.img || !productData.code || !productData.stock || !productData.status) {
            return alert('Please fill in all fields.');
        }
        if (isNaN(Number(productData.code)) || isNaN(Number(productData.stock))) {
            return alert('Code and stock must be integers.');
        }
        if (productData.status !== 'true' && productData.status !== 'false') {
            return alert('Status must be true or false.');
        }

        fetch('/realtimeproducts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                alert('Product added successfully!');
                productForm.reset();
            })
            .catch(error => console.error(error));

    } else if (action === 'edit') {

        if (isNaN(Number(productData.code)) || isNaN(Number(productData.stock))) {
            return alert('Code and stock must be integers.');
        }
        if (productData.status !== 'true' && productData.status !== 'false') {
            return alert('Status must be true or false.');
        }

        const id = idInput.value;

        fetch(`/realtimeproducts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })


            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                alert(`Product with ID ${id} updated successfully!`);
                productForm.reset();
            })
            .catch(error => console.error(error));

    }
});
