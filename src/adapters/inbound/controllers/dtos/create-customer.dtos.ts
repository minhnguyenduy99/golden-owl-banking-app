import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { CustomerDTO } from './common/customer.dto'

export class CreateCustomerRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	customerId: string

	@ApiProperty()
	@IsNotEmpty()
	customerName: string
}

export class CreateCustomerResponseDTO {
	@ApiProperty()
	result: string

	@ApiProperty()
	message: string

	@ApiProperty()
	data: CustomerDTO

	constructor(partial: Partial<CreateCustomerResponseDTO>) {
		Object.assign(this, partial)
	}
}
