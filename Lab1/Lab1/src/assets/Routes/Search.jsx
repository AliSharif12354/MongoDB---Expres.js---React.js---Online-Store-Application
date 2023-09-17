import { useState } from "react";

function Search(props) {
    const [name, setName] = useState("");
    const [result, setResult] = useState('');
    const [items, setItems] = useState([]);

    const [checkedOne, setCheckedOne] = useState(false);

    const handleChangeOne = () => {
        setCheckedOne(!checkedOne);
    };



    const apiUrl = 'http://localhost:8000'; // Update the URL as needed

    async function search() {
        await fetch(apiUrl + "/NameSearch?name=" + name + "&inStock=" + checkedOne)
            .then((response) => response.json())
            .then((data) => {
                setItems(data)
                if (data.length === 0)
                    setResult('No items were found')
                else
                    setResult('Following Items found:')
            })
            .catch(() => { setResult('No items were found') })
    }

    return (
        <div>
            <h2>Product Search</h2>
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
            <button onClick={search}>Search</button>
            <div>
                <span>In Stock items only? (Press press search after checking): </span>
                <span>Yes </span>
                <input
                    label="Value 1"
                    name='inStock'
                    type="radio"
                    value={checkedOne}
                    onChange={handleChangeOne}
                />
            </div>
            <ul>
                <h2>{result}</h2>
                {
                    items.map((item) => (
                        <li key={item.id}>
                            <a href={`/product/${item.id}`}>{String(item.name)}, item ID: {String(item.id)}</a>
                            {/* <p>{item.price}</p>
                                <p>{item.dimensions}</p>
                                <p>{item.stock}</p> */}
                        </li>
                    )
                    )
                }
            </ul>
        </div>
    )
}

export default Search;