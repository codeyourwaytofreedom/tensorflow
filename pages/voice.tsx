import { useEffect } from "react";
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { useState } from "react";
import * as speech from "@tensorflow-models/speech-commands";
import { SpeechCommandRecognizer } from "@tensorflow-models/speech-commands";
import * as tf from "@tensorflow/tfjs";

const Voice = () => {
  const [model, setModel] = useState<any>();
  const [rec, setRec] = useState<any>()
  const [action, setAction] = useState<string>();
  const [labels, setLabels] = useState<string[]>();

  const loadModel = async () =>{
    // start loading model
    const recognizer = speech.create("BROWSER_FFT") ;

   // check if model is loaded
    await recognizer.ensureModelLoaded();

    // store model instance to state
    setRec(recognizer);

   // store command word list to state
    setLabels(recognizer.wordLabels());

  }

  useEffect(() => {
    loadModel();
    buildModel();
  }, []);
  

  const NUM_FRAMES = 3;
  const [examples, setEx] = useState<object[]>([]);

  function collect (label:number | null) {
    if(rec){
      if (rec.isListening()) {
        return rec.stopListening();
      }
      if (label == null) {
        return;
      }
      rec.listen(async ({spectrogram: {frameSize, data}}) => {
        let vals = normalize(data.subarray(-frameSize * NUM_FRAMES));
        console.log(vals,label)
        //examples.push({vals, label});
        setEx([...examples, {vals,label}])
      }, {
        overlapFactor: 0.999,
        includeSpectrogram: true,
        invokeCallbackOnNoiseAndUnknown: true
      });
    }
   }
   
   function normalize(x:any) {
    const mean = -100;
    const std = 10;
    return x.map((x:any) => (x - mean) / std);
  }

  const INPUT_SHAPE = [NUM_FRAMES, 232, 1];

  async function train() {
    const ys = tf.oneHot(examples.map(e => e.label), 3);
    const xsShape = [examples.length, ...INPUT_SHAPE];
    const xs = tf.tensor(flatten(examples.map(e => e.vals)), xsShape);
   
    await actual_model.fit(xs, ys, {
      batchSize: 16,
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch:any, logs:any) => {
          console.log(epoch,logs)
        }
      }
    });
    tf.dispose([xs, ys]);
    console.log("train function worked")
   }


   function buildModel() {
    const newModel = tf.sequential();
    newModel.add(tf.layers.depthwiseConv2d({
      depthMultiplier: 8,
      kernelSize: [NUM_FRAMES, 3],
      activation: 'relu',
      inputShape: INPUT_SHAPE
    }));
    newModel.add(tf.layers.maxPooling2d({poolSize: [1, 2], strides: [2, 2]}));
    newModel.add(tf.layers.flatten());
    newModel.add(tf.layers.dense({units: 3, activation: 'softmax'}));
    const optimizer = tf.train.adam(0.01);
    newModel.compile({
      optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    setModel(newModel);
    console.log("model built");
   }

   function flatten(tensors:any) {
    const size = tensors[0].length;
    const result = new Float32Array(tensors.length * size);
    tensors.forEach((arr:any, i:any) => result.set(arr, i * size));
    return result;
   }


  return (
    <>
      <h1>Collect samples</h1>
      <h1>Number of samples: {examples.length}</h1>
      <button id="left" onMouseDown={()=>collect(0)} onMouseUp={()=>collect(null)}>Left</button>
      <button id="right" onMouseDown={()=>collect(1)} onMouseUp={()=>collect(null)}>Right</button>
      <button id="noise" onMouseDown={()=>collect(2)} onMouseUp={()=>collect(null)}>Noise</button>
      <h1>Train the model</h1>
      <button onClick={()=> train()}>Train</button>


    </>
  );
};

export default Voice;
