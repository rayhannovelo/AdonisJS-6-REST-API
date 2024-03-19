import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class BaseController {
  constructor(protected ctx: HttpContext) {}

  /**
   * send success response method.
   */
  async response(message: string, data: any = null, code: number = 200) {
    const response: { success: boolean; message: string; data?: any } = {
      success: true,
      message,
    }

    if (data !== null) {
      response.data = data
    }

    this.ctx.response.status(code).send(response)
  }

  /**
   * send error response method.
   */
  async responseError(message: string, code: number = 400, data: any = null) {
    const response: { success: boolean; message: string; data?: any } = {
      success: false,
      message,
    }

    if (data !== null) {
      response.data = data
    }

    this.ctx.response.status(code).send(response)
  }
}
