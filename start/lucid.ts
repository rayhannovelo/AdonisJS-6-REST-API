import { BaseModel, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'

// snake case response default
BaseModel.namingStrategy = new SnakeCaseNamingStrategy()
