import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserRole from '#models/user_role'

export default class extends BaseSeeder {
  async run() {
    await UserRole.updateOrCreateMany('id', [
      {
        id: 1,
        user_role_name: 'Superadmin',
        user_role_description: 'Semua fitur',
      },
      {
        id: 2,
        user_role_name: 'User',
        user_role_description: 'Fitur User',
      },
    ])
  }
}
