import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserStatus from '#models/user_status'

export default class extends BaseSeeder {
  async run() {
    await UserStatus.updateOrCreateMany('id', [
      {
        id: 1,
        user_status_name: 'Aktif',
        user_status_description: 'Akun aktif',
      },
      {
        id: 2,
        user_status_name: 'Akun tidak aktif',
        user_status_description: 'Akun tidak aktif',
      },
    ])
  }
}
