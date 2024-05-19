// import { Task as MyTask } from '../model/task.js'
import dotenv from 'dotenv';
import e from 'express';
// const userId = "mitsos";

if (process.env.NODE_ENV !== 'production') {
   dotenv.config();
}

/* Διαλέξτε το κατάλληλο μοντέλο στο αρχείο .env */
const model = await import(`../model/gym-chain-model-${process.env.MODEL}.mjs`);

export async function about_classes(req, res) {
    res.render('about_classes', { layout: 'main' });
}

export async function about_page(req, res) {
    res.render('about_page', { layout: 'main' });
}

export async function services(req, res) {
    res.render('services', { layout: 'main' });
}

export async function home(req, res) {
   res.render('home', { layout: 'main' });
}

export async function memberships(req, res) {
    res.render('memberships', { layout: 'main' });
}

export async function personal_info(req, res) {
    res.render('personal_info', { layout: 'main' });
}

export async function payment_info(req, res) {
    res.render('payment_info', { layout: 'main' });
}

export async function login(req, res) {
    res.render('login', { layout: 'main' });
}

export async function createAccount(req, res) {
    res.render('create-account', { layout: 'main' });
}

export async function joinNow(req, res) {
    res.render('joinNow', { layout: 'main' });
}

export async function contact(req, res) {
    res.render('contact', { layout: 'main' });
}