import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'

/**
 * Options accepted by the unique rule
 */
type Options = {
  table: string
  column: string
  columnValue: number
  passwordColumn: string
}

let currentPassword: any

/**
 * Implementation
 */
async function verify_password(value: unknown, options: Options, field: FieldContext) {
  /**
   * We do not want to deal with non-string or non-number
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }

  // get current password
  if (options.columnValue) {
    currentPassword = await db
      .from(options.table)
      .select(options.passwordColumn)
      .where(options.column, options.columnValue)
      .first()

    if (!currentPassword) {
      return
    }

    currentPassword = currentPassword[options.passwordColumn]
  }

  const isValid = await hash.verify(currentPassword, value)

  if (!isValid) {
    field.report('The current password field is not valid', 'verify_password', field)
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const verifyPasswordRule = vine.createRule(verify_password)
