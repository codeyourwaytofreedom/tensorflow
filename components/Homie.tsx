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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadModelAndDetect = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Access the webcam stream
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current!.srcObject = stream;
  
          // Load the model
          const model = await load();
  
          // Continuously detect objects on each video frame
          const detectObjects = async () => {
            // Capture the current video frame
            const video = videoRef.current!;
            const canvas = canvasRef.current!;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  
            // Run object detection on the captured frame
            const predictions = await model.detect(video);
            console.log(predictions);
  
            // Draw rectangles on the canvas for each prediction
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            predictions.forEach((prediction) => {
              const [x, y, width, height] = prediction.bbox;
              ctx.beginPath();
              ctx.rect(x, y, width, height);
              ctx.stroke();
            });
  
            // Call detectObjects again for the next video frame
            requestAnimationFrame(detectObjects);
          };
  
          // Start object detection on the video stream
          detectObjects();
        }
      } catch (error) {
        console.log("Error accessing webcam:", error);
      }
    };
  
    loadModelAndDetect();
  }, []);
  

  return (
    <>
      <div className={m.frame}>
        <div className={m.frame_kernel}>
          <video ref={videoRef} autoPlay playsInline width={400} height={400} />
          <canvas ref={canvasRef} width={400} height={400}/>
        </div>
      </div>
    </>
  );
};

export default Homie;
