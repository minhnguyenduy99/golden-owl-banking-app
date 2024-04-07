import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Customer } from 'src/application/entities'

export interface ICustomerRepository {
	createCustomer(customer: Customer): Promise<Customer>
	getCustomer(customerId: string): Promise<Customer>
}

@Injectable()
export class DBCustomerRepository implements ICustomerRepository {
	constructor(
		@InjectRepository(Customer)
		private readonly customerRepo: Repository<Customer>,
	) {}

	async createCustomer(customer: Customer): Promise<Customer> {
		const newCustomer = await this.customerRepo.save(customer)
		return newCustomer
	}

	getCustomer(customerId: string): Promise<Customer> {
		return this.customerRepo.findOne({
			where: { customerId },
		})
	}
}
