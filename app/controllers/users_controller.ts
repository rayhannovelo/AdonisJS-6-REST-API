import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import vine from '@vinejs/vine'
import BaseController from '#controllers/base_controller'
import User from '#models/user'
import { uniqueRule } from '#rules/unique'
import { existsRule } from '#rules/exists'
import fs from 'node:fs'

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
        userStatusId: vine.number().use(existsRule({ table: 'user_statuses', column: 'id' })),
        userRoleId: vine.number().use(existsRule({ table: 'user_roles', column: 'id' })),
        username: vine.string().use(
          uniqueRule({
            table: 'users',
            column: 'username',
          })
        ),
        password: vine
          .string()
          .minLength(8)
          .maxLength(32)
          .confirmed({
            confirmationField: 'passwordConfirmation',
          })
          .optional(),
        name: vine.string(),
        photo: vine.string().optional(),
        email: vine
          .string()
          .email()
          .use(uniqueRule({ table: 'users', column: 'email' })),
      })
    )
    const output = await validator.validate(payload)

    const photo = request.file('photo', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    // upload photo
    if (photo) {
      if (!photo.isValid) {
        this.responseError('Validation error', photo.errors, 422)
        return
      }

      await photo.move(app.makePath('uploads/user-photo'), {
        name: `${cuid()}.${photo.extname}`,
      })

      output.photo = photo.fileName!
    }

    const data = await User.create(output)

    this.response('User created successfully', data)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await User.findOrFail(params.id)
    await data.load('user_role')
    await data.load('user_status')
    await data.load('posts')

    this.response('User retrieved successfully', data)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        id: vine.number().use(existsRule({ table: 'users', column: 'id' })),
        userStatusId: vine.number().use(existsRule({ table: 'user_statuses', column: 'id' })),
        userRoleId: vine.number().use(existsRule({ table: 'user_roles', column: 'id' })),
        username: vine.string().use(
          uniqueRule({
            table: 'users',
            column: 'username',
            except: params.id,
            exceptColumn: 'id',
          })
        ),
        password: vine
          .string()
          .minLength(8)
          .maxLength(32)
          .confirmed({
            confirmationField: 'passwordConfirmation',
          })
          .optional(),
        name: vine.string(),
        photo: vine.string().optional(),
        email: vine
          .string()
          .email()
          .use(
            uniqueRule({ table: 'users', column: 'email', except: params.id, exceptColumn: 'id' })
          ),
      })
    )
    const output = await validator.validate({ id: params.id, ...payload })
    const data = await User.findOrFail(params.id)

    const photo = request.file('photo', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    // upload photo
    if (photo) {
      if (!photo.isValid) {
        this.responseError('Validation error', photo.errors, 422)
        return
      }

      // delete old file
      if (data.photo) {
        fs.unlink(app.makePath(`uploads/user-photo/${data.photo}`), (err) => {
          if (err) console.error('Error removing file:', err)
        })
      }

      await photo.move(app.makePath('uploads/user-photo'), {
        name: `${cuid()}.${photo.extname}`,
      })

      output.photo = photo.fileName!
    }

    await data?.merge(output).save()

    this.response('User updated successfully', data)
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const data = await User.findOrFail(params.id)
    await data?.delete()

    this.response('User deleted successfully')
  }
}
