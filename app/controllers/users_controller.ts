import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#controllers/base_controller'
import User from '#models/user'
import { uniqueRule } from '#rules/unique'
import { existsRule } from '#rules/exists'

export default class UsersController extends BaseController {
  /**
   * Display a list of resource
   */
  async index() {
    const data = await User.all()

    this.response('Users retrieved successfully', data)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        full_name: vine.string().optional(),
        email: vine
          .string()
          .email()
          .use(uniqueRule({ table: 'users', column: 'email' })),
        password: vine.string().minLength(8).maxLength(32).confirmed(),
      })
    )
    const output = await validator.validate(payload)

    const data = await User.create(output)

    this.response('User created successfully', data)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await User.findOrFail(params.id)

    this.response('User retrieved successfully', data)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        id: vine.string().use(existsRule({ table: 'users', column: 'id' })),
        full_name: vine.string(),
        email: vine
          .string()
          .email()
          .use(
            uniqueRule({ table: 'users', column: 'email', except: params.id, exceptColumn: 'id' })
          ),
        password: vine.string().minLength(8).maxLength(32).confirmed().optional(),
      })
    )
    const output = await validator.validate({ id: params.id, ...payload })

    const data = await User.find(params.id)
    await data?.merge(output).save()

    this.response('User updated successfully', data)
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const data = await User.find(params.id)
    await data?.delete()

    this.response('User deleted successfully', data)
  }
}
