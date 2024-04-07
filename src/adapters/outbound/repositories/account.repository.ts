import { Account, Transaction } from 'src/application/entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

export interface IAccountRepository {
	getAccountByAccountNo(accountNo: string): Promise<Account>
	batchGetAccounts(accountNos: string[]): Promise<Account[]>
	save(account: Account): Promise<Account>
}

export class DBAccountRepository implements IAccountRepository {
	constructor(
		@InjectRepository(Account)
		private readonly accountRepo: Repository<Account>,
		@InjectRepository(Transaction)
		private readonly transactionRepo: Repository<Transaction>,
	) {}

	async save(account: Account): Promise<Account> {
		account.version += 1 // use optimistic locking to prevent multiple updates at once
		await this.accountRepo.manager.transaction(
			async (transactionalEntityManager) => {
				await Promise.all([
					transactionalEntityManager.save(account),
					transactionalEntityManager.save(account.transactions),
				])
			},
		)
		return account
	}

	async getAccountByAccountNo(accountNo: string): Promise<Account> {
		const [dbAccount, transactions] = await Promise.all([
			this.accountRepo.findOne({
				where: {
					accountNo,
				},
			}),
			this.transactionRepo.find({
				where: {
					accountNo,
				},
			}),
		])
		if (!dbAccount) {
			return null
		}
		const account = new Account({
			...dbAccount,
			transactions: transactions.map(
				(transaction) => new Transaction(transaction),
			),
		})
		return account
	}

	async batchGetAccounts(accountNos: string[]): Promise<Account[]> {
		const accountList = await Promise.all(
			accountNos.map((accountNo) => {
				return this.getAccountByAccountNo(accountNo)
			}),
		)
		return accountList
	}

	async createAccount(account: Account): Promise<Account> {
		const newAccount = await this.accountRepo.save(account)
		return newAccount
	}
}
