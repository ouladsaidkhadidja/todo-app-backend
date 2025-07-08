import express from 'express'
import db from '../db.js'

const router = express.Router()

//get all the todos
router.get('/', (req,res)=>{
  const gettodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
  const todos = gettodos.all(req.userId)
  res.json(todos)
})

//create a new todo
router.post('/', (req, res)=>{

  const {task} = req.body

  const insertTodo = db.prepare('INSERT INTO todos(user_id, task) values (?, ?)')

  const result = insertTodo.run(username, task)

  res.json({id: result.lastInsertRowid, task , completed: 0})
  
})

//update a todo
router.put('/:id', (req,res)=>{
  const {completed} = req.body
  const {id} = req.params
  const {page} = req.query
  //const updatedTod = db.applyChangeset('UPDATE todos SET task = ?, completed= ?')
  const updatedTodo = db.applyChangeset('UPDATE todos SET completed= ? WHERE id=?')
  updatedTodo.run(completed, id)

  res.json({message: "todo completed"})
})

//delete a todo
router.delete('/:id', (req, res)=>{
  const {id} = req.params
  const userId = req.userId
  const deletedTodo = db.prepare('DELETE FROM todos WHERE id= ? AND user_id=?')
  const result = deletedTodo.run(id, userId)

  res.send({message: "todo deleted"})
})

export default router
