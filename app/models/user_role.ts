import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserRole extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userRoleName: string

  @column()
  declare userRoleDescription: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
