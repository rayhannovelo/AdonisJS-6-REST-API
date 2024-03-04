import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserStatus extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userStatusName: string

  @column()
  declare userStatusDescription: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
