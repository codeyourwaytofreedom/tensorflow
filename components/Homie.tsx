import { useEffect, useRef, useState } from "react";
import m from "../styles/Main.module.css";
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { DetectedObject } from "@tensorflow-models/coco-ssd";
import serve from "./serve.jpeg";
import bird from "./bird.jpeg";
import h from "./h.jpeg";
import b from "./b.jpeg";
import boat from "./boat.jpeg";
import c from "./c.webp";

import Image from "next/image";
import { load } from "@tensorflow-models/coco-ssd";

const Homie = () => {
  const im = useRef<HTMLImageElement>(null);
  const canv = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [result, setResult] = useState<DetectedObject[]>([]);

  useEffect(() => {
    (async () => {
      // Load the model.
      //const model = await load();

      // Classify the image.
      //const predictions = await model.detect(im.current!);

      //console.log(predictions)

      // Draw rectangles on the canvas
      const canvas = canv.current!;
      const ctx = canvas.getContext("2d");

      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rectangles for each prediction
/*       predictions.forEach((prediction) => {
        const { bbox } = prediction;
        const [x, y, width, height] = bbox;

        // Adjust the position and scale of the rectangles based on image dimensions
        const imageElement = im.current!;
        const scaleX = canvas.width / imageElement.width;
        const scaleY = canvas.height / imageElement.height;
        const rectX = x * scaleX;
        const rectY = y * scaleY;
        const rectWidth = width * scaleX;
        const rectHeight = height * scaleY;

        // Set the style for the rectangle
        ctx!.strokeStyle = "red";
        ctx!.lineWidth = 2;

        // Draw the rectangle
        ctx!.beginPath();
        ctx!.rect(rectX, rectY, rectWidth, rectHeight);
        ctx!.stroke();
      }); */

    })();
  }, []);

/*   useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Access the webcam stream
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Set the video source to the stream
          videoRef.current!.srcObject = stream;
        }).then( async ()=> {
          const model = await load();
          const predictions = await model.detect(videoRef.current!);
          console.log(predictions)
        })
        .catch((error) => {
          console.log("Error accessing webcam:", error);
        });
    }
  }, []); */

  return (
    <>
      <div className={m.frame}>
        <div className={m.frame_kernel}>
          <video ref={videoRef} autoPlay playsInline />
          <canvas ref={canv} />
        </div>
      </div>
    </>
  );
};

export default Homie;
