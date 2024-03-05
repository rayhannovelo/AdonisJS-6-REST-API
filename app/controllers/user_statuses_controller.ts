import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#controllers/base_controller'
import UserStatus from '#models/user_status'
import { existsRule } from '#rules/exists'

export default class UserStatusesController extends BaseController {
  /**
   * Display a list of resource
   */
  async index() {
    const data = await UserStatus.all()

    this.response('User statuses retrieved successfully', data)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        userStatusName: vine.string(),
        userStatusDescription: vine.string().optional(),
      })
    )
    const output = await validator.validate(payload)
    const data = await UserStatus.create(output)

    this.response('User status created successfully', data)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await UserStatus.findOrFail(params.id)

    this.response('User status retrieved successfully', data)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        id: vine.number().use(existsRule({ table: 'user_statuses', column: 'id' })),
        userStatusName: vine.string(),
        userStatusDescription: vine.string().optional(),
      })
    )
    const output = await validator.validate({ id: params.id, ...payload })
    const data = await UserStatus.findOrFail(params.id)

    await data?.merge(output).save()

    this.response('User status updated successfully', data)
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const data = await UserStatus.findOrFail(params.id)
    await data?.delete()

    this.response('User status deleted successfully')
  }
}
