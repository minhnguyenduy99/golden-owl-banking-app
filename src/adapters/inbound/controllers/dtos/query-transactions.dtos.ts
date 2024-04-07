import { ApiProperty } from '@nestjs/swagger'
import { TransactionDTO } from './common/transaction.dto'
import { Type } from 'class-transformer'
import { IsNumber, ValidateIf } from 'class-validator'

export class QueryTransactionRequestDTO {
	@ApiProperty({
		required: false,
		default: 1,
	})
	@ValidateIf((o) => o.page !== undefined)
	@IsNumber()
	@Type(() => Number)
	page: number = 1

	@ApiProperty({
		required: false,
		default: 20,
	})
	@Type(() => Number)
	@ValidateIf((o) => o.pageSize !== undefined)
	@IsNumber()
	pageSize: number = 20
}

export class QueryTransactionResponseDTO {
	@ApiProperty()
	totalCount: number

	@ApiProperty()
	totalPage: number

	@ApiProperty()
	items: TransactionDTO[]

	constructor(props: Partial<QueryTransactionResponseDTO>) {
		Object.assign(this, props)
	}
}
