import { useEffect, useRef, useState } from "react";

import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import serve from "./serve.jpeg";
import bird from "./bird.jpeg";
import h from "./h.jpeg";
import b from "./b.jpeg";
import { DetectedObject } from "@tensorflow-models/coco-ssd";

import Image from "next/image";

import { load } from "@tensorflow-models/coco-ssd";

const Homie = () => {
  const im = useRef<HTMLImageElement>(null);
  const canv = useRef<HTMLCanvasElement>(null)
  const [result,setResult] = useState<DetectedObject[]>([]);

  useEffect(() => {
    (async () => {
      // Load the model.
      const model = await load();

      // Classify the image.
      const predictions = await model.detect(im.current!);
      setResult(predictions)
        
      console.log(predictions);

        // Draw rectangles on the canvas
        const canvas = canv.current!;
        const ctx = canvas.getContext("2d");

        ctx!.clearRect(0, 0, canvas.width, canvas.height);

        // Draw rectangles for each prediction
        predictions.forEach((prediction) => {
        const { bbox } = prediction;
        const [x, y, width, height] = bbox;

        // Set the style for the rectangle
        ctx!.strokeStyle = "red";
        ctx!.lineWidth = 2;

        // Draw the rectangle
        ctx!.beginPath();
        ctx!.rect(x, y, width, height);
        ctx!.stroke();
        });

      
    })();
  }, []);


  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const constraints = { video: true };

    // Function to handle the video stream
    const handleStream = (stream: MediaStream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    // Function to handle errors
    const handleError = (error: any) => {
      console.error("Error accessing webcam:", error);
    };

    // Access the webcam stream
/*     navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleStream)
      .catch(handleError); */
  }, []);

  return (
    <>
        <div style={{ position: "relative", display: "inline-block" }}>
            <Image src={b} alt="serve" ref={im} />
            <canvas ref={canv} style={{ position: "absolute", top: 0, left: 0 }} />
        </div>
      <h1>{result.length}</h1>
      <video ref={videoRef} autoPlay playsInline />
    </>
  );
};

export default Homie;
