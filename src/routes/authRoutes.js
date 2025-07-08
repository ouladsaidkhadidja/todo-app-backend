import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { brotliDecompress } from 'zlib'

const router = express.Router()

//Registr a new user endpoint auth/register
router.post('/register', (req, res)=>{
  //save the user name and an irreversibly encrypted password
  //save dinapite@gmail.com and hfhdughkglhv57gr8tf3de
   const {username, password} = req.body
  //encrypt password
  const hashedpassword = bcrypt.hashSync(password, 8)
  console.log(hashedpassword)
 //saving the new user and the hashpâsswored to the db
  try{
    const insertUser = db.prepare(`INSERT INTO users(username, password) values(?, ?)`)
    const result = insertUser.run(username, hashedpassword)
    res.sendStatus(201)

    //now that we have a usere, let's add their first todo
    const defaulttodo = 'hi :) Add your first todo'
    const insertTodo = db.prepare(`INSERT INTO todos(user_id, task) values(?, ?)`)
    insertTodo.run(result.lastInsertRowid, defaulttodo) // lastInsertRowid : a fiels in result that do : when we get back the id we check th id of the last row or entry added to the table in which case it's going to be the ID associated with the most recently entered new user
    //creating a token
    const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})
    res.json({token})
  }catch(err){
    console.log(err.message)
    res.sendStatus(503)
  }
  //res.sendStatus(201)
})

router.post('/login', (req,res)=> {
//we get theire email an we look up the password associated withthat email in the database
//but when we get it , we find out that it's encrypted => can't be matched with the entered password
//what to do : we one way encryptethe password the user just entered, using the same necryption algo (and the same key..duh!)=> we authenticate the user by comparing both encrypted passwords
  const {username, password} = req.body

  try{
    const getUser = db.prepare('SELECT * FROM users WHERE username = ?' ) 
    const user = getUser.get(username)

    if(!user) {return res.status(401).send({message: "User not found"})}

    const passwordIsvalid = bcrypt.compareSync(password , user.password)

    if(!passwordIsvalid) {return res.status(401).send({message: "password invalid"})}

    console.log(user)
    // then we have a successful authentification

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})

    res.json({token})

  }catch(err){
    console.log(err.message)
    res.sendStatus(503)
  }
})

export default router