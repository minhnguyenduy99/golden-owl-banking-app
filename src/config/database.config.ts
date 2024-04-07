import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DATABASE_CONFIG } from './constants'

export default () => ({
	[DATABASE_CONFIG]: {
		type: 'mysql',
		url: process.env.DATABASE_CONNECTION_STRING,
		logging: true,
	} as TypeOrmModuleOptions,
})
