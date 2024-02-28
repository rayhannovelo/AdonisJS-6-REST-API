import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class BaseController {
  constructor(protected ctx: HttpContext) {}

  /**
   * send success response method.
   */
  async response(message: string, data: any = '', code: number = 200) {
    let response: any = {
      success: true,
      message,
    }

    if (typeof data === 'object') {
      response.data = data ?? {}
    }

    this.ctx.response.status(code).send(response)
  }

  /**
   * send error response method.
   */
  async responseError(message: string, data: any = '', code: number = 400) {
    let response: any = {
      success: false,
      message,
    }

    if (typeof data === 'object') {
      response.data = data ?? {}
    }

    this.ctx.response.status(code).send(response)
  }
}
