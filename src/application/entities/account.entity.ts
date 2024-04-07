import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	VersionColumn,
} from 'typeorm'
import { Transaction, TransactionType } from './transaction.entity'
import { Customer } from './customer.entity'
import { randomInt } from 'crypto'
import { InsufficientBalanceException } from '../errors/insuffcient-balance.exception'

@Entity('account')
export class Account {
	@PrimaryGeneratedColumn({
		name: 'id',
	})
	id: number

	@Column({
		name: 'customer_id',
	})
	customerId: string

	@Column({
		name: 'account_no',
	})
	accountNo: string

	@Column({
		name: 'account_name',
	})
	accountName: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@VersionColumn({ name: 'version' })
	version: number

	transactions: Transaction[]

	constructor(props: Partial<Account>) {
		if (props) {
			Object.assign(this, props)
			this.transactions =
				props.transactions?.sort(
					(trx1, trx2) =>
						trx1.transactionDate.getTime() -
						trx2.transactionDate.getTime(),
				) || [] // sort transactions by date from earliest to latest
			this.createdAt = props.createdAt || new Date()
		}
	}

	get balance() {
		const initialBalance = this.transactions[0].initialBalance
		return this.transactions.reduce((acc, transaction) => {
			if (transaction.type === TransactionType.DEPOSIT) {
				return acc + transaction.amount
			}
			return acc - transaction.amount
		}, initialBalance)
	}

	transfer(account: Account, amount: number): Transaction {
		if (this.balance < amount) {
			throw new InsufficientBalanceException(
				this.accountNo,
				amount,
				this.balance,
			)
		}
		const trx = new Transaction({
			accountNo: this.accountNo,
			type: TransactionType.WITHDRAW,
			initialBalance: this.balance,
			amount,
			givenAccountName: account.accountName,
			givenAccountNo: account.accountNo,
		})
		this.transactions.push(trx)
		return trx
	}

	deposit(account: Account, amount: number) {
		const trx = new Transaction({
			accountNo: this.accountNo,
			type: TransactionType.DEPOSIT,
			initialBalance: this.balance,
			amount,
			givenAccountName: account.accountName,
			givenAccountNo: account.accountNo,
		})
		this.transactions.push(trx)
		return trx
	}

	static createAccount(customer: Customer, initialDepositAmount: number) {
		const accountNo = randomInt(100000, 999999).toString()
		const account = new Account({
			customerId: customer.customerId,
			accountName: customer.customerName.toUpperCase(),
			accountNo,
			transactions: [
				new Transaction({
					type: TransactionType.DEPOSIT,
					accountNo,
					initialBalance: 0,
					amount: initialDepositAmount,
					givenAccountName: 'BANK',
					givenAccountNo: 'BANK',
				}),
			],
		})
		return account
	}
}
