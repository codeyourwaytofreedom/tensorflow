import Image from "next/image";
import { useState } from "react";
import g from "../styles/Main.module.css";


const Game = () => {
    const [index,setIndex] = useState<number>(4)
    return (
        <>
            <div className={g.game}>
                <div className={g.game_mainline}>
                    <div className={g.game_mainline_jumper}>
                        <Image alt={"no"} src={`/b${index}.png`} width={100} height={100}/>
                    </div>
                </div>
                <div className={g.game_arrows}>
                    <div><button>&#10094;</button></div>
                    <div><button>&#10095;</button></div>
                </div>
            </div>
        </>
     );
}
 
export default Game;