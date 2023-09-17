import React from "react";

function Feature(props) {
    function redirect() {
        window.location.href = props.url;
    }
    return (
        <div>
            <button style={{marginBottom: '10px'}} onClick={redirect}>{props.name}</button>
        </div>
    )
}

export default Feature;