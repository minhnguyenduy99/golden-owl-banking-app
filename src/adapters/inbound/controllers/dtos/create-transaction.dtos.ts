import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { TransactionDTO } from './common/transaction.dto'
import { IsMoney } from 'src/utils'

export class CreateTransactionRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	transferAccountNo: string

	@ApiProperty()
	@IsNotEmpty()
	receiveAccountNo: string

	@ApiProperty()
	@IsNotEmpty()
	@IsMoney()
	amount: number
}

export class CreateTransactionResponseDTO {
	@ApiProperty()
	result: string

	@ApiProperty()
	message: string

	@ApiProperty()
	data: TransactionDTO

	constructor(props: Partial<CreateTransactionResponseDTO>) {
		Object.assign(this, props)
	}
}
