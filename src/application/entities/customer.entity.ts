import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity('customer')
export class Customer {
	@PrimaryColumn({
		name: 'customer_id',
	})
	customerId: string

	@Column({
		name: 'customer_name',
	})
	customerName: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	constructor(props: Partial<Customer>) {
		if (props) {
			Object.assign(this, props)
			this.createdAt = props.createdAt || new Date()
		}
	}
}
