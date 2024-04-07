import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	InternalServerErrorException,
	Logger,
	Post,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
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
@ApiResponse({
	status: 500,
	description: 'Internal server error',
	schema: {
		example: {
			result: 'error',
			message: 'Internal server error',
		},
	},
})
@ApiResponse({
	status: 400,
	description: 'Bad request',
	schema: {
		example: {
			result: 'error code',
			message: 'error message',
		},
	},
})
@ApiResponse({
	status: 404,
	description: 'not found',
	schema: {
		example: {
			result: 'error code',
			message: 'error message',
		},
	},
})
export class TransactionController {
	private readonly logger = new Logger(TransactionController.name)
	constructor(private readonly accountService: AccountService) {}

	@Post()
	@HttpCode(201)
	@ApiOperation({ summary: 'Create a new transaction' })
	@ApiResponse({
		status: 201,
		description: 'Transaction created successfully',
		type: CreateTransactionResponseDTO,
	})
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
