import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Product(props) {
  const [product, setProduct] = useState(null);
  const apiUrl = "http://localhost:8000"; // Update the URL as needed
  let { id } = useParams(); // Get the ID from the URL

  props.id ? id = props.id : null

  async function addReview(event) {
    event.preventDefault();
    const rating = event.target[0].value;

    await fetch(apiUrl + "/addReview", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, rating: rating })
    }).catch(() => { console.log('Error') })
    window.location.reload();
  }

  useEffect(() => {
    // Fetch the product data when the component loads
    async function fetchProduct() {
      try {
        const response = await fetch(`${apiUrl}/getProduct?id=${id}`, {
          headers:
            { Accept: "application/json" }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchProduct();
  }, []); // Execute the effect whenever the 'id' prop changes

  return (
    <div>
      <h2>Product Details</h2>
      {product ? (
        <div>
          <p>ID: {product.id}</p>
          <p>Name: {product.name}</p>
          <p>Price: {product.price}</p>
          <p>Stock: {product.stock}</p>
          {product.reviews ? (
            <div>
              <h3>Reviews</h3>
              <div>
                {product.reviews.map((review, index) => (
                  <p key={index}>Rating #{index + 1}: {review.rating}</p>
                ))}
              </div>
            </div>
          ) : null
          }
          <form onSubmit={addReview}>
                <span>Add your own rating: </span>
                <input type="number" min="1" max="10" placeholder="Rating" />
                <button>Submit</button>
          </form>
          <a href={`/product/${id}/reviews`}>Check all reviews!</a>
          {/* Add more product details as needed */}
        </div>
      ) : (
        <p>Loading product data...</p>
      )}
    </div>
  );
}

export default Product;