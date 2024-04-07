import {
	BadRequestException,
	Body,
	Controller,
	Get,
	InternalServerErrorException,
	Logger,
	Param,
	Post,
} from '@nestjs/common'
import {
	CreateCustomerRequestDTO,
	CreateCustomerResponseDTO,
} from './dtos/create-customer.dtos'
import { CustomerDTO } from './dtos/common/customer.dto'
import { ApiTags } from '@nestjs/swagger'
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
export class CustomerController {
	private readonly logger = new Logger(CustomerController.name)
	constructor(private readonly customerService: CustomerService) {}

	@Post()
	async createCustomer(
		@Body() dto: CreateCustomerRequestDTO,
	): Promise<CreateCustomerResponseDTO> {
		try {
			const customer = await this.customerService.createCustomer(dto)
			return {
				result: 'success',
				message: `Customer created successfully: ${customer.customerId}`,
			}
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
