import { ExtractPlaceholderValues, Prettify } from './utils.type'

function createMessage<S extends string>(input: S) {
  type Data = { [i in ExtractPlaceholderValues<S>]: string }

  return function (path: string, data: Prettify<Omit<Data, 'PATH'>>) {
    let result = input.toString()
    const conf = { ...data, PATH: path || '' }

    for (let key in conf) {
      const value = conf[key as keyof typeof conf]
      const replaceValue =
        key === 'PATH' ? (value ? `at ${value}` : '') : `${value}`

      result = result.replaceAll(`<$${key}$>`, replaceValue)
    }

    return result.trim()
  }
}

const errorMessages = {
  requiredError: 'Input is required <$PATH$>',
  typeError: 'Input is not assignable to type <$TYPE$> <$PATH$>',
  primitiveTypeError: '<$INPUT$> is not assignable to type <$TYPE$> <$PATH$>',
  unknownInstanceError:
    'Object needs to be an instance of <$CONSTRUCTOR$> <$PATH$>',
  tupleLengthError:
    'Tuple length need to be as same as schema length: <$LENGTH$> <$PATH$>',
} as const

export default {
  getRequiredErr: createMessage(errorMessages.requiredError),
  getTypeErr: createMessage(errorMessages.typeError),
  getUnknownInstanceError: createMessage(errorMessages.unknownInstanceError),
  getTupleLengthError: createMessage(errorMessages.tupleLengthError),
  getPrimitiveTypeError: createMessage(errorMessages.primitiveTypeError),
}
