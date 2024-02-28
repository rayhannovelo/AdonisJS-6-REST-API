/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.get('/', async () => {
      return { success: true, message: 'I AM YOUR FATHER!' }
    })

    // auth, generate token
    router.post('/auth', [AuthController, 'login'])

    router
      .group(() => {
        // user auth
        router.get('auth/user', [AuthController, 'user'])
        router.get('auth/refresh-token', [AuthController, 'refresh_token'])
        router.post('auth/logout', [AuthController, 'logout'])

        // users
        router.get('/users', [UsersController, 'index'])
        router.get('/users/:id', [UsersController, 'show'])
        router.post('/users', [UsersController, 'store'])
        router.put('/users/:id', [UsersController, 'update'])
        router.delete('/users/:id', [UsersController, 'destroy'])
      })
      .use(middleware.auth())
  })
  .prefix('/api')
