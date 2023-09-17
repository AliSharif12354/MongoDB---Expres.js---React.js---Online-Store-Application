import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductReviews() {
    const { id } = useParams()
    const [reviews, setReviews] = useState([])
    const [result, setResult] = useState('');

    useEffect(() => {

        console.log('mounted product reviews')

        const apiUrl = 'http://localhost:8000'; // Update the URL as needed

        async function getReviews() {
            await fetch(apiUrl + "/getReviews?id=" + id)
                .then((response) => response.json())
                .then((data) => {
                    setReviews(data)
                    if (data.length === 0)
                        setResult('No reviews were found')
                    else
                        setResult('Following reviews found:')
                })
                .catch(() => { setResult('No reviews were found') })
        }
        getReviews()

    }, [])

    return (
        <div>
            <h1>Reviews: </h1>
            <h2>{result}</h2>
            <ul>
                {
                    reviews.map((item, index) => (
                        <li key={index}>
                            <p>Rating #{index + 1}: {String(item.rating)}</p>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ProductReviews;