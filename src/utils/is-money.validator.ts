import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationOptions,
	registerDecorator,
} from 'class-validator'

@ValidatorConstraint({ name: 'isMoney', async: false })
export class IsMoneyConstraint implements ValidatorConstraintInterface {
	validate(value: number) {
		if (Number.isInteger(value) && value > 0 && value % 1000 === 0) {
			return true
		}
		return false
	}

	defaultMessage() {
		// Return the error message when validation fails
		return 'Invalid money format'
	}
}

export function IsMoney(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'isMoney',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: IsMoneyConstraint,
		})
	}
}
