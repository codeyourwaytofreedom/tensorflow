import { useEffect, useState } from "react";


const Homie = () => {
    const [duration, setDuration] = useState(0)
    useEffect(()=>{
        fetch("/api/tensorflow").then(r => r.json()).then(rj => setDuration(rj.duration));
    },[])
    return ( 
        <>
            <h1>Duration: {duration}</h1>
        </>
     );
}
 
export default Homie;