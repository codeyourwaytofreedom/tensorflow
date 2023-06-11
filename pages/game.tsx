import Image from "next/image";
import { useState } from "react";
import g from "../styles/Main.module.css";
import { ReactNode, useEffect } from "react";
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as speech from "@tensorflow-models/speech-commands";
import * as tf from "@tensorflow/tfjs";

const Game = () => {
    const [index,setIndex] = useState<number>(4);
    const [model, setModel] = useState<any>();
    const [rec, setRec] = useState<any>()
    const [detected, setDetected] = useState<number>();

    const handke_forth = () => {
        if(index === 9){
            setIndex(1)
        }
        else{
            setIndex(index => index+1)
        }
    }

  const loadRecognizer = async () =>{
    const recognizer = speech.create("BROWSER_FFT") ;
    await recognizer.ensureModelLoaded();
    setRec(recognizer);
  }


    const load_or_build_model = async () => {
              const loadedModel = await tf.loadLayersModel('localstorage://gunshot');
              const optimizer = tf.train.adam(0.01);
              loadedModel.compile({
                optimizer,
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
              });
              setModel(loadedModel);
              console.log("existing model loaded")
      };
    
    
    
      useEffect(() => {
        loadRecognizer();   
        load_or_build_model();  
      }, []);

      useEffect(() => {
        if(rec){
            listen();
        }
      }, [rec]);

      const [fired, setFired] = useState<number>(0);
   
      useEffect(() => {
       let timer:ReturnType<typeof setTimeout>;
   
       if (detected === 0) {
         timer = setTimeout(() => {
           console.log("0 oldu");
           setFired(fired => fired+1);
         }, 350);
       }
     
       return () => clearTimeout(timer);
   
     }, [detected]);

     useEffect(()=>{
        handke_forth();
     },[fired])


      async function action_funct(labelTensor:any) {
        const label = (await labelTensor.data())[0];
          setDetected(label);
       }
    const INPUT_SHAPE = [3, 232, 1];

    function normalize(x:any) {
        const mean = -100;
        const std = 10;
        return x.map((x:any) => (x - mean) / std);
      }

      function listen() {
        if (rec && rec.isListening()) {
          rec.stopListening();
          return;
        }   
        if(rec){
            rec.listen(async ({spectrogram: {frameSize, data}}) => {
                const vals = normalize(data.subarray(-frameSize * 3));
                const input = tf.tensor(vals, [1, ...INPUT_SHAPE]);
                const probs = model.predict(input);
                const predLabel = probs.argMax(1);
                await action_funct(predLabel);
                tf.dispose([input, probs, predLabel]);
              }, {
                overlapFactor: 0.999,
                includeSpectrogram: true,
                invokeCallbackOnNoiseAndUnknown: true
              });
        }
       }

    return (
        <>
            <div className={g.game}>
                <div className={g.game_motto}>
                  <Image alt={"no"} src={"/tf.png"} width={100} height={100}/>
                  <h1>Sound-controlled Image Slider</h1>
                </div>
                
                <div className={g.game_mainline}>
                    <div className={g.game_mainline_jumper}>
                        <Image alt={"no"} src={`/bb${index}.png`} width={100} height={100}/>
                    </div>
                </div>
                <div className={g.game_arrows}>
                    <div><button >&#10094;</button></div>
                    <div><button >&#10095;</button></div>
                </div>
            </div>
        </>
     );
}
 
export default Game;