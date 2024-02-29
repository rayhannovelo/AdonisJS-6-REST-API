import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('id', [
      {
        id: 1,
        user_role_id: 1,
        user_status_id: 1,
        username: 'superadmin',
        password: 'superadmin',
        name: 'Superadmin',
        email: 'superadmin@gmail.com',
        email_verified_at: null,
        photo: null,
      },
      {
        id: 2,
        user_role_id: 2,
        user_status_id: 1,
        username: 'user',
        password: 'user',
        name: 'User',
        email: 'user@gmail.com',
        email_verified_at: null,
        photo: null,
      },
    ])
  }
}
