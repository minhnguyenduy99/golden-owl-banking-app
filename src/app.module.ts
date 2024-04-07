import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DATABASE_CONFIG, databaseConfig } from './config'
import { TransactionController } from './adapters/inbound/controllers/transaction.controller'
import { AccountController } from './adapters/inbound/controllers/account.controller'
import { CustomerController } from './adapters/inbound/controllers/customer.controller'
import { DBCustomerRepository } from './adapters/outbound/repositories/customer.repository'
import { DBAccountRepository } from './adapters/outbound/repositories/account.repository'
import { Account, Customer, Transaction } from './application/entities'
import { AccountService, CustomerService } from './application/services'
import {
	DBTransactionRepository,
	TransactionHistory,
} from './adapters/outbound/repositories'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			load: [databaseConfig],
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				...configService.get(DATABASE_CONFIG),
				autoLoadEntities: true,
				synchronize: false,
			}),
			inject: [ConfigService],
		}),
		TypeOrmModule.forFeature([
			Customer,
			Account,
			Transaction,
			TransactionHistory,
		]),
	],
	controllers: [AccountController, TransactionController, CustomerController],
	providers: [
		AppService,
		AccountService,
		CustomerService,
		{
			provide: 'ICustomerRepository', // 👈 'ICustomerRepository' is the token
			useClass: DBCustomerRepository,
		},
		{
			provide: 'IAccountRepository',
			useClass: DBAccountRepository,
		},
		DBTransactionRepository,
	],
	exports: [TypeOrmModule],
})
export class AppModule {}
