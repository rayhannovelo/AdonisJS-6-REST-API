import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#controllers/base_controller'
import Post from '#models/post'
import { existsRule } from '#rules/exists'

export default class PostsController extends BaseController {
  /**
   * Display a list of resource
   */
  async index() {
    const data = await Post.all()

    this.response('Posts retrieved successfully', data)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth }: HttpContext) {
    const user = await auth.authenticate()
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        user_id: vine.number().use(existsRule({ table: 'users', column: 'id' })),
        title: vine.string(),
        body: vine.string(),
      })
    )
    const output = await validator.validate({ user_id: user.id, ...payload })
    const data = await Post.create(output)

    this.response('Post created successfully', data)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await Post.findOrFail(params.id)
    await data.load('user')
    await data.user.load('user_role')
    await data.user.load('user_status')

    this.response('Post retrieved successfully', data)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, auth }: HttpContext) {
    const user = await auth.authenticate()
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        id: vine.number().use(existsRule({ table: 'posts', column: 'id' })),
        user_id: vine.number().use(existsRule({ table: 'users', column: 'id' })),
        title: vine.string(),
        body: vine.string(),
      })
    )
    const output = await validator.validate({ id: params.id, user_id: user.id, ...payload })
    const data = await Post.findOrFail(params.id)

    await data?.merge(output).save()

    this.response('Post updated successfully', data)
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const data = await Post.findOrFail(params.id)
    await data?.delete()

    this.response('Post deleted successfully')
  }
}
