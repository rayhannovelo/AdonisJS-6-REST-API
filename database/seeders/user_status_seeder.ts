import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserStatus from '#models/user_status'

export default class extends BaseSeeder {
  static environment = ['development', 'testing', 'production']

  async run() {
    await UserStatus.updateOrCreateMany('id', [
      {
        id: 1,
        userStatusName: 'Active',
        userStatusDescription: 'Active account',
      },
      {
        id: 2,
        userStatusName: 'Inactive',
        userStatusDescription: 'Inactive account',
      },
    ])
  }
}
