import { useEffect } from "react";
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { useState } from "react";
import * as speech from "@tensorflow-models/speech-commands";
import { SpeechCommandRecognizer } from "@tensorflow-models/speech-commands";

const Voice = () => {
  const [model, setModel] = useState<SpeechCommandRecognizer>();
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState<string[]>();

  const loadModel = async () =>{
    // start loading model
    const recognizer = speech.create("BROWSER_FFT") ;

   // check if model is loaded
    await recognizer.ensureModelLoaded();

    // store model instance to state
    setModel(recognizer);

   // store command word list to state
    setLabels(recognizer.wordLabels());

  }

  useEffect(()=>{
    loadModel();
  }, []);


  return (
    <>
      <h1>Voice commands to be tested here</h1>
    </>
  );
};

export default Voice;
