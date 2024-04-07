import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { AccountDTO } from './common/account.dto'

export class CreateAccountRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	customerId: string

	@ApiProperty()
	@IsNumber()
	initialDepositAmount: number
}

export class CreateAccountResponseDTO {
	@ApiProperty()
	result: string

	@ApiProperty()
	message: string

	@ApiProperty()
	data: AccountDTO

	constructor(props: Partial<CreateAccountResponseDTO>) {
		Object.assign(this, props)
	}
}
