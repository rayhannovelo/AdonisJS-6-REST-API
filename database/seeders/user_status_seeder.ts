import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserStatus from '#models/user_status'

export default class extends BaseSeeder {
  static environment = ['development', 'testing', 'production']

  async run() {
    await UserStatus.updateOrCreateMany('id', [
      {
        id: 1,
        userStatusName: 'Aktif',
        userStatusDescription: 'Akun aktif',
      },
      {
        id: 2,
        userStatusName: 'Akun tidak aktif',
        userStatusDescription: 'Akun tidak aktif',
      },
    ])
  }
}
