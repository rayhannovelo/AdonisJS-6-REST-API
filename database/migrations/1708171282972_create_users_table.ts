import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_role_id')
        .unsigned()
        .notNullable()
        .references('user_roles.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      table
        .integer('user_status_id')
        .unsigned()
        .notNullable()
        .references('user_statuses.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      table.string('username').notNullable().unique()
      table.string('password')
      table.string('name')
      table.string('photo')
      table.string('email').unique()
      table.timestamp('email_verified_at')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
