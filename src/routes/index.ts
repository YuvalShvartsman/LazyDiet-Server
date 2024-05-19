import express from 'express'

import { usersRouter } from './usersRouter'

const routes = express()

routes.use("/users/",usersRouter)

export default routes
