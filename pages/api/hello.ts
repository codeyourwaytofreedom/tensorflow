// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as tf from '@tensorflow/tfjs-node';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const startTime = performance.now();

  // Code to measure
  const first_tensor = tf.tensor([1, 2, 3, 4], [1, 4]);
  first_tensor.print();
  console.log(first_tensor.shape);
  
  // End the performance timer
  const endTime = performance.now();
  
  // Calculate the duration in milliseconds
  const duration = endTime - startTime;
  
  // Log the duration
  console.log(`Code execution time: ${duration} milliseconds`);
  res.status(200).json({ duration:  duration, value: first_tensor.toString()})
}
