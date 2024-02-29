import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserStatus extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_status_name: string | null

  @column()
  declare user_status_description: string | null

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime
}
