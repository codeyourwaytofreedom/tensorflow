import { useEffect, useRef, useState } from "react";

import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import serve from "./serve.jpeg";
import Image from "next/image";

import { load } from "@tensorflow-models/coco-ssd";

const Homie = () => {
  const im = useRef<HTMLImageElement>(null);

  useEffect(() => {
    (async () => {
      // Load the model.
      const model = await load();

      // Classify the image.
      const predictions = await model.detect(im.current!);

      console.log(predictions);
    })();
  }, []);

  return (
    <>
      <Image src={serve} alt="serve" ref={im} />
    </>
  );
};

export default Homie;
