import { useState } from "react";

function Create(props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [depth, setDepth] = useState(0);
    const [stock, setStock] = useState(0);

    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const apiUrl = 'http://localhost:8000'; // Update the URL as needed

    function postProduct(event) {
        event.preventDefault();
        if (name === '' || price <= 0 || height <= 0 || width <= 0 || depth <= 0 || stock <= 0) {
            setShowError(true);
            setShowSuccess(false);
        }
        else {
            setShowError(false);

            fetch(apiUrl + "/Create", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: name, 
                    price: price, 
                    height: height,
                    width: width,
                    depth: depth, 
                    stock: stock 
                })
            }).then(() => {
                setShowSuccess(true);
            }).catch(() => { setShowError(true) })

        }
    }

    return (
        <>
            <form onSubmit={postProduct}>
                <h2>Create Product</h2>
                <span>Name:</span><input type="text" value={name} onChange={(event) => setName(event.target.value)} /> <br />
                <span>price:</span><input type="number" value={price} onChange={(event) => setPrice(event.target.value)} />  <br />
                <span>Height:</span><input type="number" value={height} onChange={(event) => setHeight(event.target.value)} /> <br />
                <span>Width:</span><input type="number" value={width} onChange={(event) => setWidth(event.target.value)} /> <br />
                <span>Depth:</span><input type="number" value={depth} onChange={(event) => setDepth(event.target.value)} /> <br />
                <span>Initial Stock:</span><input type="number" value={stock} onChange={(event) => setStock(event.target.value)} /> <br />
                <button type="submit">Create</button>
            </form>
            {showError ? <p style={{color: 'red'}}>Ensure proper input for fields</p> : <></>}
            {showSuccess ? <p style={{color: 'green'}}>Product created successfully</p> : <></>}
        </>
    )
}

export default Create;