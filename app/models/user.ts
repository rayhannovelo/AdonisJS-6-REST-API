import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import UserRole from '#models/user_role'
import UserStatus from '#models/user_status'
import Post from '#models/post'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userRoleId: number

  @column()
  declare userStatusId: number

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare name: string | null

  @column()
  declare email: string | null

  @column()
  declare emailVerifiedAt: string | null

  @column()
  declare photo: string | null

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.toFormat('yyyy-MM-dd HH:mm:ss') : value
    },
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.toFormat('yyyy-MM-dd HH:mm:ss') : value
    },
  })
  declare updatedAt: DateTime | null

  @belongsTo(() => UserStatus)
  declare user_status: BelongsTo<typeof UserStatus>

  @belongsTo(() => UserRole)
  declare user_role: BelongsTo<typeof UserRole>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'ray_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  currentAccessToken?: AccessToken
}
