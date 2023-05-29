// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as tf from '@tensorflow/tfjs-node';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const startTime = performance.now();

  
 const t = tf.tensor([1,2,3,4,5,6],[2,3]);
 console.log(t.arraySync());

  const endTime = performance.now();
  
  const duration = endTime - startTime;

  const startMemory = tf.memory();
console.log('Memory before creating tensors:');
console.log(startMemory);

// Create and manipulate tensors
const t1 = tf.tensor([1, 2, 3, 4, 5, 6], [2, 3]);
const t2 = tf.tensor([7, 8, 9, 10, 11, 12], [2, 3]);
const sum = tf.add(t1, t2);

/* t.dispose();
t1.dispose();
t2.dispose();
sum.dispose(); */


const endMemory = tf.memory();
console.log('Memory after creating tensors:');
console.log(endMemory);

// Calculate memory usage difference
const memoryDiff = endMemory.numBytes - startMemory.numBytes;
console.log('Memory difference:');
console.log(memoryDiff);
  
  console.log(`Code execution time: ${duration} milliseconds`);
  res.status(200).json({ duration:  duration})
}
