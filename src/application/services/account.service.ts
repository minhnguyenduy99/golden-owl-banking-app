import {
	IAccountRepository,
	ICustomerRepository,
} from 'src/adapters/outbound/repositories'
import { Account } from '../entities/account.entity'
import { CreateAccountDTO } from '../dtos/create-account.dto'
import { Inject, Logger } from '@nestjs/common'
import { AccountNotFoundException } from '../errors/account-not-found.exception'
import { CreateTransactionDTO } from '../dtos/transfer.dto'
import { CustomerNotFoundException } from '../errors/customer-not-found.exception'

export class AccountService {
	private readonly logger = new Logger(AccountService.name)
	constructor(
		@Inject('IAccountRepository')
		private readonly accountRepo: IAccountRepository,
		@Inject('ICustomerRepository')
		private readonly customerRepo: ICustomerRepository,
	) {}

	async createAccount(dto: CreateAccountDTO) {
		try {
			const { customerId, initialDepositAmount } = dto
			const customer = await this.customerRepo.getCustomer(customerId)
			if (!customer) {
				throw new CustomerNotFoundException(customerId)
			}

			const account = Account.createAccount(
				customer,
				initialDepositAmount,
			)

			await this.accountRepo.save(account)

			this.logger.log(`Account created successfully`)

			return account
		} catch (error) {
			this.logger.error(error)
			throw error
		}
	}

	async getAccountByAccountNo(accountNo: string) {
		const account = await this.accountRepo.getAccountByAccountNo(accountNo)
		if (!account) {
			throw new AccountNotFoundException(accountNo)
		}
		return account
	}

	async transfer(dto: CreateTransactionDTO) {
		const { receiveAccountNo, transferAccountNo, amount } = dto
		const [transferAccount, receiveAccount] =
			await this.accountRepo.batchGetAccounts([
				transferAccountNo,
				receiveAccountNo,
			])
		if (!transferAccount || !receiveAccount) {
			throw new AccountNotFoundException(
				!transferAccount ? transferAccountNo : receiveAccountNo,
			)
		}
		transferAccount.transfer(receiveAccount, amount)
		receiveAccount.deposit(transferAccount, amount)

		try {
			await Promise.all([
				this.accountRepo.save(transferAccount),
				this.accountRepo.save(receiveAccount),
			])
			return
		} catch (error) {
			this.logger.error(error)
			throw error
		}
	}
}
