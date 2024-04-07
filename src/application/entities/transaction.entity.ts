import { v4 as uuidv4 } from 'uuid'
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm'

export enum TransactionType {
	DEPOSIT = 'DEPOSIT',
	WITHDRAW = 'WITHDRAW',
}

@Entity('transaction_history')
export class Transaction {
	@PrimaryColumn()
	public readonly id: string

	@Column({ name: 'type' })
	public readonly type: TransactionType

	@Column({ name: 'account_no' })
	public readonly accountNo: string

	@Column({ name: 'initial_balance' })
	public readonly initialBalance: number

	@Column({ name: 'given_account_no' })
	public readonly givenAccountNo: string

	@Column({ name: 'given_account_name' })
	public readonly givenAccountName: string

	@Column({ name: 'amount' })
	public readonly amount: number

	@CreateDateColumn({ name: 'transaction_date' })
	public readonly transactionDate: Date

	constructor(props: Partial<Transaction>) {
		if (props) {
			Object.assign(this, props)
			this.id = props.id || uuidv4()
			this.transactionDate = props.transactionDate || new Date()
		}
	}
}
