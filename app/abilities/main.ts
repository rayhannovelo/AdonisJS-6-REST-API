/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import { Bouncer, AuthorizationResponse } from '@adonisjs/bouncer'
import User from '#models/user'

export const manageUser = Bouncer.ability((user: User) => {
  const allowUserRole = [1]

  if (allowUserRole.includes(user.userRoleId)) {
    return true
  }

  return AuthorizationResponse.deny('Unauthorized action', 401)
})
