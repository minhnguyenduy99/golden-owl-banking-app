import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import {
	BadRequestException,
	Logger,
	ValidationPipe,
	VersioningType,
} from '@nestjs/common'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')
	app.enableVersioning({
		type: VersioningType.URI,
	})
	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory(errors) {
				return new BadRequestException({
					result: 'error',
					message:
						errors[0].constraints[
							Object.keys(errors[0].constraints)[0]
						],
				})
			},
		}),
	)

	const config = new DocumentBuilder()
		.setTitle('GO Simple Banking App')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('swagger', app, document)

	const host = process.env.HOST
	const port = parseInt(process.env.PORT) || 3000
	await app.listen(port, host, () => {
		Logger.log(`Server running on ${host}:${port}`)
	})
}

bootstrap()
