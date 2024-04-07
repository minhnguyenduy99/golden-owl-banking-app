import {
	Body,
	Controller,
	Get,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	Param,
	Post,
	Query,
} from '@nestjs/common'
import {
	CreateAccountRequestDTO,
	CreateAccountResponseDTO,
} from './dtos/create-account.dtos'
import {
	QueryTransactionRequestDTO,
	QueryTransactionResponseDTO,
} from './dtos/query-transactions.dtos'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AccountDTO } from './dtos/common/account.dto'
import { AccountNotFoundException } from 'src/application/errors'
import { DBTransactionRepository } from 'src/adapters/outbound/repositories'
import { AccountService } from 'src/application/services'

@Controller({
	version: '1',
	path: 'accounts',
})
@ApiTags('accounts')
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
export class AccountController {
	private readonly logger = new Logger(AccountController.name)

	constructor(
		private readonly accountService: AccountService,
		private readonly trxRepo: DBTransactionRepository,
	) {}

	@Post()
	@ApiOperation({ summary: 'Create a new account' })
	@ApiResponse({
		status: 201,
		description: 'Account created successfully',
		type: CreateAccountResponseDTO,
	})
	async createAccount(
		@Body() dto: CreateAccountRequestDTO,
	): Promise<CreateAccountResponseDTO> {
		const createdAccount = await this.accountService.createAccount({
			customerId: dto.customerId,
			initialDepositAmount: dto.initialDepositAmount,
		})

		return new CreateAccountResponseDTO({
			result: 'success',
			message: `Account created successfully: ${createdAccount.accountNo}`,
			data: createdAccount,
		})
	}

	@Get('/:accountNo')
	@ApiOperation({ summary: 'Retrieve account balance' })
	@ApiResponse({
		status: 200,
		description: 'Account balance retrieved successfully',
		type: AccountDTO,
	})
	async retrieveAccountBalance(
		@Param('accountNo') accountNo: string,
	): Promise<AccountDTO> {
		try {
			const account =
				await this.accountService.getAccountByAccountNo(accountNo)
			return new AccountDTO({
				customerId: account.customerId,
				accountNo: account.accountNo,
				accountName: account.accountName,
				balance: account.balance,
				createdAt: account.createdAt,
			})
		} catch (error) {
			this.logger.error(error)
			if (error instanceof AccountNotFoundException) {
				throw new NotFoundException({
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

	@Get('/:accountNo/transactions')
	@ApiOperation({
		summary: 'Retrieve transaction history of a given account',
	})
	@ApiResponse({
		status: 200,
		description: 'Transactions retrieved successfully',
		type: QueryTransactionResponseDTO,
	})
	async getTransactionsByAccountNo(
		@Param('accountNo') accountNo: string,
		@Query() q: QueryTransactionRequestDTO,
	): Promise<QueryTransactionResponseDTO> {
		const result = await this.trxRepo.getTransactionsByAccountNo(
			accountNo,
			q.page,
			q.pageSize,
		)
		return new QueryTransactionResponseDTO(result)
	}
}
