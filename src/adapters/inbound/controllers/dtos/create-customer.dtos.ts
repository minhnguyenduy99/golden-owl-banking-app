import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

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
}
