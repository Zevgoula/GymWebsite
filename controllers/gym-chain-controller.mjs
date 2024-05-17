// import { Task as MyTask } from '../model/task.js'
import dotenv from 'dotenv';
// const userId = "mitsos";

if (process.env.NODE_ENV !== 'production') {
   dotenv.config();
}

/* Διαλέξτε το κατάλληλο μοντέλο στο αρχείο .env */
const model = await import(`../model/${process.env.MODEL}/gym-chain-model-${process.env.MODEL}.mjs`);
