import { ApiProperty } from '@nestjs/swagger'

export class TransactionDTO {
	@ApiProperty()
	id: string

	@ApiProperty()
	accountNo: string

	@ApiProperty()
	type: string

	@ApiProperty()
	givenAccountNo: string

	@ApiProperty()
	givenAccountName: string

	@ApiProperty()
	amount: number

	@ApiProperty()
	initialBalance: number

	@ApiProperty()
	transactionDate: Date
}
