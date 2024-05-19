'use strict';

import db from 'better-sqlite3'
const sql = new db('data/gym_chain.db', { fileMustExist: true });