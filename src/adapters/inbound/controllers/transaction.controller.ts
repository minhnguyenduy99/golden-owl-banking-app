import {
	BadRequestException,
	Body,
	Controller,
	InternalServerErrorException,
	Logger,
	Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
	CreateTransactionRequestDTO,
	CreateTransactionResponseDTO,
} from './dtos/create-transaction.dtos'
import {
	AccountNotFoundException,
	InsufficientBalanceException,
} from 'src/application/errors'
import { AccountService } from 'src/application/services'

@Controller({
	version: '1',
	path: 'transactions',
})
@ApiTags('transactions')
export class TransactionController {
	private readonly logger = new Logger(TransactionController.name)
	constructor(private readonly accountService: AccountService) {}

	@Post()
	async transfer(
		@Body() dto: CreateTransactionRequestDTO,
	): Promise<CreateTransactionResponseDTO> {
		try {
			await this.accountService.transfer({
				transferAccountNo: dto.transferAccountNo,
				receiveAccountNo: dto.receiveAccountNo,
				amount: dto.amount,
			})
			return new CreateTransactionResponseDTO({
				result: 'success',
				message: 'Transaction created successfully',
			})
		} catch (error) {
			this.logger.error(error)
			if (
				error instanceof AccountNotFoundException ||
				error instanceof InsufficientBalanceException
			) {
				throw new BadRequestException({
					result: error.code,
					message: error.message,
				})
			}
			throw new InternalServerErrorException({
				result: 'error',
				message: 'Internal server error',
			})
		}
	}
}
