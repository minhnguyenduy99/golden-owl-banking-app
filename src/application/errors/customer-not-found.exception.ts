export class CustomerNotFoundException extends Error {
	public readonly code = 'CUSTOMER_NOT_FOUND'
	constructor(customerId: string) {
		super(`Customer with id ${customerId} not found`)
	}
}
