/*
import {DatabaseSync} from 'node:sqlite'
const db = new DatabaseSync(':memory:')

//excute sql statements from strings 
db.exec(`
  CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`)

db.exec(`
  CREATE TABLE todos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    task TEXT,
    completed BOOLEAN DEFAULT 0,
    FORIEGN KEY(user_id) REFRENCES users(id)
  )
`)

export default db //to allow other files of the project to interact with the data base db 
//so we can import it in the other files to interact with the data base
*/

import { DatabaseSync } from 'node:sqlite'
const db = new DatabaseSync(':memory:')

// Execute SQL statements from strings
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`)

db.exec(`
    CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )    
`)

export default db