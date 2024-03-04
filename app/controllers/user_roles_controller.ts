import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#controllers/base_controller'
import UserRole from '#models/user_role'
import { existsRule } from '#rules/exists'

export default class UserRolesController extends BaseController {
  /**
   * Display a list of resource
   */
  async index() {
    const data = await UserRole.all()

    this.response('User roles retrieved successfully', data)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        userRoleName: vine.string(),
        userRoleDescription: vine.string().optional(),
      })
    )
    const output = await validator.validate(payload)
    const data = await UserRole.create(output)

    this.response('User role created successfully', data)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await UserRole.findOrFail(params.id)

    this.response('User role retrieved successfully', data)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        id: vine.number().use(existsRule({ table: 'user_roles', column: 'id' })),
        userRoleName: vine.string(),
        userRoleDescription: vine.string().optional(),
      })
    )
    const output = await validator.validate({ id: params.id, ...payload })
    const data = await UserRole.findOrFail(params.id)

    await data?.merge(output).save()

    this.response('User updated successfully', data)
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const data = await UserRole.findOrFail(params.id)
    await data?.delete()

    this.response('User role deleted successfully')
  }
}
