import { RypeOk } from '../../RypeOk'
import { RypeError } from '../../Error'
import { TypeSchemaUnion } from './_common.type'
import { SchemaFreezableCore } from '../SchemaCore'
import { SchemaCheckConf, SchemaConfig } from '../../types'
import { AdjustReadonlyObject, InferSchema } from '../Extract.type'
import { ValidObject, Prettify, MakeOptional } from '../../utils.type'

export class SchemaRecord<
  T extends InputRecord,
  R extends SchemaConfig
> extends SchemaFreezableCore<T, R> {
  name = 'record' as const;

  ['~checkType'](
    input: ValidObject,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    const output: ValidObject = {}

    for (let key in input) {
      const value = input[key]

      output[key] = this.schema['~checkAndGetResult'](value, {
        ...conf,
        path: `${conf.path || 'object'}.${key}`,
      })
    }

    return new RypeOk(output)
  }
}

export type InputRecord = TypeSchemaUnion
export type TypeRecord = SchemaRecord<any, any>
export type ExtractRecord<
  T extends TypeRecord,
  TMode extends 'input' | 'output'
> = AdjustReadonlyObject<
  T,
  Prettify<
    MakeOptional<{
      [K: string]: InferSchema<T['schema'], TMode>
    }>
  >
>