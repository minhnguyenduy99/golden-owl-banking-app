export class AccountNotFoundException extends Error {
	public readonly code = 'ACCOUNT_NOT_FOUND'
	constructor(accountNo: string) {
		super(`Account no ${accountNo} not found`)
	}
}
