import { ApiProperty } from '@nestjs/swagger'

export class AccountDTO {
	@ApiProperty()
	accountNo: string

	@ApiProperty()
	accountName: string

	@ApiProperty()
	customerId: string

	@ApiProperty()
	balance: number

	@ApiProperty()
	createdAt: Date

	constructor(props: Partial<AccountDTO>) {
		Object.assign(this, props)
	}
}
