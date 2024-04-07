import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	Repository,
} from 'typeorm'

@Entity('transaction_history')
export class TransactionHistory {
	@PrimaryColumn()
	id: string

	@Column({ name: 'account_no' })
	accountNo: string

	@Column({ name: 'type' })
	type: string

	@Column({ name: 'given_account_no' })
	givenAccountNo: string

	@Column({ name: 'given_account_name' })
	givenAccountName: string

	@Column({ name: 'amount' })
	amount: number

	@Column({ name: 'initial_balance' })
	initialBalance: number

	@CreateDateColumn({ name: 'transaction_date' })
	transactionDate: Date

	constructor(props: Partial<TransactionHistory>) {
		if (props) {
			Object.assign(this, props)
		}
	}
}

@Injectable()
export class DBTransactionRepository {
	constructor(
		@InjectRepository(TransactionHistory)
		private readonly transactionRepo: Repository<TransactionHistory>,
	) {}

	async getTransactionsByAccountNo(
		accountNo: string,
		page: number,
		pageSize: number,
	): Promise<{
		items: TransactionHistory[]
		totalPage: number
		totalCount: number
	}> {
		const [items, totalCount] = await this.transactionRepo.findAndCount({
			where: {
				accountNo: accountNo,
			},
			skip: (page - 1) * pageSize,
			take: pageSize,
			order: { transactionDate: 'DESC' },
		})
		return {
			items,
			totalPage: Math.ceil(totalCount / pageSize),
			totalCount,
		}
	}
}
