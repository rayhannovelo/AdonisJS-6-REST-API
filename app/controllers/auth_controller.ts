import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import BaseController from '#controllers/base_controller'
import User from '#models/user'
import { randomUUID } from 'node:crypto'

export default class AuthController extends BaseController {
  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // check user
      const user = await User.findByOrFail('email', email)

      if (!user) {
        this.responseError('Invalid credentials', [], 401)
      }

      // check password
      const login = await hash.verify(user.password, password)
      if (!login) {
        this.responseError('Invalid credentials', [], 401)
      }

      // create token
      const token = await User.accessTokens.create(user, ['user:create', 'user:read'], {
        name: randomUUID(),
      })

      this.response('Login successfully', { user, user_token: token })
    } catch (error: any) {
      this.responseError('Invalid credentials', '', error.status)
    }
  }

  async user({ auth }: HttpContext) {
    const data = await auth.authenticate()

    this.response('User retrieved successfully', data)
  }

  async refresh_token({ auth }: HttpContext) {
    const user = await auth.authenticate()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    // create new token
    const token = await User.accessTokens.create(user, ['user:create', 'user:read'], {
      name: randomUUID(),
    })

    this.response('Refresh token successfully', { user, user_token: token })
  }

  async logout({ auth }: HttpContext) {
    const user = await auth.authenticate()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    this.response('Logout successfully')
  }
}
