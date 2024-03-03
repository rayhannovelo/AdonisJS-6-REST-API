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

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const UserRolesController = () => import('#controllers/user_roles_controller')
const UserStatusesController = () => import('#controllers/user_statuses_controller')

router.get('/', async ({ response }) => {
  response.redirect().toPath('/api')
})

router
  .group(() => {
    router.get('/', async () => {
      return { success: true, message: 'I AM YOUR FATHER!' }
    })

    // auth, generate token
    router.post('/auth', [AuthController, 'login'])

    router
      .group(() => {
        // auth
        router.get('auth/user', [AuthController, 'user'])
        router.put('auth/user', [AuthController, 'update_user'])
        router.get('auth/refresh-token', [AuthController, 'refresh_token'])
        router.post('auth/logout', [AuthController, 'logout'])

        // user statuses
        router.get('/user-statuses', [UserStatusesController, 'index'])
        router.post('/user-statuses', [UserStatusesController, 'store'])
        router.get('/user-statuses/:id', [UserStatusesController, 'show'])
        router.put('/user-statuses/:id', [UserStatusesController, 'update'])
        router.delete('/user-statuses/:id', [UserStatusesController, 'destroy'])

        // user roles
        router.get('/user-roles', [UserRolesController, 'index'])
        router.post('/user-roles', [UserRolesController, 'store'])
        router.get('/user-roles/:id', [UserRolesController, 'show'])
        router.put('/user-roles/:id', [UserRolesController, 'update'])
        router.delete('/user-roles/:id', [UserRolesController, 'destroy'])

        // users
        router.get('/users', [UsersController, 'index'])
        router.post('/users', [UsersController, 'store'])
        router.get('/users/:id', [UsersController, 'show'])
        router.put('/users/:id', [UsersController, 'update'])
        router.delete('/users/:id', [UsersController, 'destroy'])
      })
      .use(middleware.auth())
  })
  .prefix('/api')

/*
|--------------------------------------------------------------------------
| Uploaded Files Routes
|--------------------------------------------------------------------------
*/

import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)
  const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('uploads', normalizedPath)
  return response.download(absolutePath)
})
