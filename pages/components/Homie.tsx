import { useEffect } from "react";
import * as tf from '@tensorflow/tfjs';


const Homie = () => {
    useEffect(()=>{
        fetch("/api/hello").then(r => r.json()).then(rj => console.log(rj));
    },[])
    return ( 
        <>
            <h1>Hello TensorFlow Project</h1>
        </>
     );
}
 
export default Homie;