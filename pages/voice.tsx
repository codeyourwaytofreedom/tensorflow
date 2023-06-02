import { useEffect } from "react";
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { useState } from "react";
import * as speech from "@tensorflow-models/speech-commands";
import { SpeechCommandRecognizer } from "@tensorflow-models/speech-commands";
import * as tf from "@tensorflow/tfjs";

const Voice = () => {
  const [model, setModel] = useState<SpeechCommandRecognizer>();
  const [action, setAction] = useState<string>();
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

  useEffect(() => {
    loadModel();
  }, []);
  
  function argMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const handleSpeakButton = async () => {
    if (model) {
      // Start listening for speech commands
      model.listen(
        (result) => {
          // Process the recognized speech command result
          console.log(result);
          setAction(labels![argMax(Object.values(result.scores))]);
          return Promise.resolve();
        },
        {
          includeSpectrogram: true,
          probabilityThreshold: 0.75,
        }
      );
      setTimeout(() => model.stopListening(), 10e3);
    }
  };
  

  return (
    <>
      {action ? <div>{action}</div> : <div>No Command Detected</div>}
      <h1>Voice commands to be tested here</h1>
      <button onClick={handleSpeakButton}>Press to Speak</button>
    </>
  );
};

export default Voice;
