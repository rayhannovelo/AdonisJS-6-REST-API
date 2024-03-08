import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

/**
 * Options accepted by the exists rule
 */
export type Options = {
  table: string
  column: string
}

/**
 * Implementation
 */
async function exists(value: unknown, options: Options, field: FieldContext) {
  /**
   * We do not want to deal with non-string or non-number
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string' && typeof value !== 'number') {
    return
  }

  const row = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (!row) {
    field.report('The {{ field }} field is not exists', 'exists', field)
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const existsRule = vine.createRule(exists)
