export class InsufficientBalanceException extends Error {
	public readonly code = 'INSUFFICIENT_BALANCE'
	constructor(accountNo: string, amount: number, balance: number) {
		super(
			`Account no ${accountNo} has insufficient balance. Amount: ${amount}, Balance: ${balance}`,
		)
	}
}
