import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	Param,
	Post,
} from '@nestjs/common'
import {
	CreateCustomerRequestDTO,
	CreateCustomerResponseDTO,
} from './dtos/create-customer.dtos'
import { CustomerDTO } from './dtos/common/customer.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
	CustomerAlreadyExistsException,
	CustomerNotFoundException,
} from 'src/application/errors'
import { CustomerService } from 'src/application/services'

@Controller({
	version: '1',
	path: 'customers',
})
@ApiTags('customers')
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
export class CustomerController {
	private readonly logger = new Logger(CustomerController.name)
	constructor(private readonly customerService: CustomerService) {}

	@Post()
	@HttpCode(201)
	@ApiOperation({ summary: 'Create a new customer' })
	@ApiResponse({
		status: 201,
		description: 'Customer created successfully',
		type: CreateCustomerResponseDTO,
	})
	async createCustomer(
		@Body() dto: CreateCustomerRequestDTO,
	): Promise<CreateCustomerResponseDTO> {
		try {
			const customer = await this.customerService.createCustomer(dto)
			return new CreateCustomerResponseDTO({
				result: 'success',
				message: `Customer created successfully: ${customer.customerId}`,
				data: customer,
			})
		} catch (error) {
			this.logger.error(error)
			if (error instanceof CustomerAlreadyExistsException) {
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

	@Get('/:customerId')
	@ApiOperation({ summary: 'Retrieve customer by ID' })
	@ApiResponse({
		status: 200,
		description: 'Customer retrieved successfully',
		type: CustomerDTO,
	})
	async getCustomerById(
		@Param('customerId') customerId: string,
	): Promise<CustomerDTO> {
		try {
			const customer =
				await this.customerService.getCustomerById(customerId)
			return customer
		} catch (error) {
			this.logger.error(error)
			if (error instanceof CustomerNotFoundException) {
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
}
