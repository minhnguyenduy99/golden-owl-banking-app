import { ApiProperty } from '@nestjs/swagger'

export class CustomerDTO {
	@ApiProperty()
	customerId: string

	@ApiProperty()
	customerName: string

	@ApiProperty()
	createdAt: Date
}
