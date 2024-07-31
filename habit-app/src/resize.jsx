import React, { useState, useEffect } from "react";
import Form from './form.jsx'
 
function Resize() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
 
    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
 
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
 
    return (
        <div>
            <Form width = {windowWidth}/>
        </div>
    );
}
 
export default Resize;