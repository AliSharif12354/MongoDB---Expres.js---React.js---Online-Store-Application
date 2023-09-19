import { useEffect, useState } from "react";

function Orders() {

    const [items, setItems] = useState([]);

    const apiUrl = 'http://localhost:8000'; // Update the URL as needed

    useEffect(() => {

        async function search() {
            console.log('searching ', items)
            await fetch(apiUrl + "/Orders", { requestType: 'GET' })
                .then((response) => response.json())
                .then((data) => {
                    setItems(data)
                })
                .catch(() => { console.log('Error') })
            console.log('searched ', items)
        }

        search()

    }, [])

    return (
        <div>
            <h2>All Orders: </h2>
            <ul>
                {
                    items.map((item, index) => (
                        <li key={item.id}>
                            <p>Customer name : {item.name}</p>
                            <a href={`/Orders/${item.id}`}><p>Order Number: {item.id}</p></a>
                        </li>
                    )
                    )
                }
            </ul>
        </div>
    )
}

export default Orders;