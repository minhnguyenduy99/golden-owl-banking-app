import { ApiProperty } from '@nestjs/swagger'

export class GetAccountResponseDTO {
	@ApiProperty()
	customerId: string

	@ApiProperty()
	accountNo: string

	@ApiProperty()
	balance: number

	createdDate: number
}
