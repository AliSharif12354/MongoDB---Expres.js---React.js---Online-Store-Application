import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function OrderSpecific() {
    const [order, setOrder] = useState(null);
    const apiUrl = "http://localhost:8000"; // Update the URL as needed
    let { id } = useParams(); // Get the ID from the URL


    useEffect(() => {
        // Fetch the product data when the component loads
        async function fetchOrder() {

            try {
                const response = await fetch(`${apiUrl}/Orders/${id}`, {});

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                console.log(response)

                const orderData = await response.json();
                setOrder(orderData);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchOrder();
    }, []); // Execute the effect whenever the 'id' prop changes

    return (
        <div>
            <h2>Order Details</h2>
            {console.log("test")}
            {order ? (
                <div>
                    <p>UserName: {order.name}</p>
                    {order.order ? (
                        <div>
                            <div>
                                {order.order.map((item, index) => (
                                    <>
                                        <p key={index}>Product Name: {item.name}</p>
                                        <p key={index}>Order Quantity: {item.quantity}</p>
                                    </>
                                ))}
                            </div>
                        </div>
                    ) : null
                    }
                    {/* Add more product details as needed */}
                </div>
            ) : (
                <p>Loading product data...</p>
            )}
        </div>
    );
}

export default OrderSpecific;