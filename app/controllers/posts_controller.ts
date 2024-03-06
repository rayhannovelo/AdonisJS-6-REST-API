import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#controllers/base_controller'
import Post from '#models/post'
import { existsRule } from '#rules/exists'
import PostPolicy from '#policies/post_policy'

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
  async update({ params, request, auth, bouncer }: HttpContext) {
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

    if (await bouncer.with(PostPolicy).denies('edit', data)) {
      return this.responseError('Cannot edit the post')
    }

    await data?.merge(output).save()

    this.response('Post updated successfully', data)
  }

  /**
   * Delete record
   */
  async destroy({ params, bouncer }: HttpContext) {
    const data = await Post.findOrFail(params.id)

    if (await bouncer.with(PostPolicy).denies('delete', data)) {
      return this.responseError('Cannot delete the post')
    }

    await data?.delete()

    this.response('Post deleted successfully')
  }
}
