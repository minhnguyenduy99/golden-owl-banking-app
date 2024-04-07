import { ICustomerRepository } from 'src/adapters/outbound/repositories'
import { Customer } from '../entities/customer.entity'
import { CreateCustomerDTO } from '../dtos/create-customer.dto'
import { CustomerNotFoundException } from '../errors/customer-not-found.exception'
import { CustomerAlreadyExistsException } from '../errors/customer-already-exists.exception'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CustomerService {
	constructor(
		@Inject('ICustomerRepository')
		private readonly customerRepo: ICustomerRepository,
	) {}

	async createCustomer(dto: CreateCustomerDTO) {
		const existingCustomer = await this.customerRepo.getCustomer(
			dto.customerId,
		)
		if (existingCustomer) {
			throw new CustomerAlreadyExistsException(dto.customerId)
		}
		const customer = new Customer(dto)
		await this.customerRepo.createCustomer(customer)
		return customer
	}

	async getCustomerById(customerId: string) {
		const customer = await this.customerRepo.getCustomer(customerId)
		if (!customer) {
			throw new CustomerNotFoundException(customerId)
		}
		return customer
	}
}
