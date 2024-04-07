export class CustomerAlreadyExistsException extends Error {
	public readonly code = 'CUSTOMER_ALREADY_EXISTS'
	constructor(customerId: string) {
		super(`Customer with id ${customerId} already exists`)
	}
}
