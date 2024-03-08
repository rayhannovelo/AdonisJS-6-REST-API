import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

/**
 * Options accepted by the unique rule
 */
type Options = {
  table: string
  column: string
  except?: string | number
  exceptColumn?: string
}

let oldValue: any

/**
 * Implementation
 */
async function unique(value: unknown, options: Options, field: FieldContext) {
  /**
   * We do not want to deal with non-string or non-number
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string' && typeof value !== 'number') {
    return
  }

  // get old email
  if (options.except) {
    oldValue = await db
      .from(options.table)
      .select(options.column)
      .where(options.exceptColumn!, options.except)
      .first()

    if (!oldValue) {
      return
    }

    oldValue = oldValue[options.column]
  }

  const row = await db
    .from(options.table)
    .select(options.column)
    .if(options.except, (query) => {
      query.whereNot(options.column, oldValue)
    })
    .where(options.column, value)
    .first()

  if (row) {
    field.report('The {{ field }} field is not unique', 'unique', field)
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const uniqueRule = vine.createRule(unique)
