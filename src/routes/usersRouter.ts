import express from 'express'
import { createUser, getAllUsers } from '../controllers/usersController'

const router = express.Router()

router.get('/allUsers', getAllUsers)
router.post('/createUser', createUser)


export {router as usersRouter} 