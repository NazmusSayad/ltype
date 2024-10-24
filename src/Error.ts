import { SchemaConfig } from './config'

export class RypeError extends Error {
  public type = 'RypeError' as const
}

export class RypeDevError extends RypeError {
  public errorType = 'DevError' as const
}

export class RypeClientError extends RypeError {
  public input: unknown
  public schema: unknown
  public config?: SchemaConfig
  public errorType: string = 'ClientError' as const

  public constructor(
    message: string,
    options: { schema: unknown; input: unknown; config: SchemaConfig }
  ) {
    super(message)
    this.input = options.input
    this.schema = options.schema
    this.config = options.config
  }
}

export class RypeTypeError extends RypeClientError {
  public errorType = 'TypeError' as const
}
export class RypeRequiredError extends RypeClientError {
  public errorType = 'RequiredError' as const
}
