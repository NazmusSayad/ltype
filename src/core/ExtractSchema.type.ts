import * as Type from './Schema.type'
import { FormatTupleToNeverTuple, MakeOptional, Prettify } from '../utils.type'
import { AdjustReadonlyObject, InferSchema } from './Extract.type'

export type ExtractPrimitive<T extends Type.TypePrimitive> = T['schema'][number]
export type ExtractInstance<T extends Type.TypeInstance> = InstanceType<
  T['schema']
>

export type ExtractObject<
  T extends Type.TypeObject,
  TMode extends 'input' | 'output'
> = AdjustReadonlyObject<
  T,
  Prettify<
    MakeOptional<{
      [K in keyof T['schema']]: InferSchema<T['schema'][K], TMode>
    }>
  >
>

export type ExtractRecord<
  T extends Type.TypeRecord,
  TMode extends 'input' | 'output'
> = AdjustReadonlyObject<
  T,
  Prettify<
    MakeOptional<{
      [K: string]: InferSchema<T['schema'], TMode>
    }>
  >
>

export type ExtractTuple<
  T extends Type.TypeTuple,
  TMode extends 'input' | 'output'
> = AdjustReadonlyObject<
  T,
  Prettify<
    FormatTupleToNeverTuple<
      {
        [K in keyof T['schema'] as K extends `${number}`
          ? K
          : never]: InferSchema<T['schema'][K], TMode>
      } & Pick<T['schema'], 'length'>
    >
  >
>

type ExtractArrayLike<
  T extends Type.TypeArray | Type.TypeOr,
  TMode extends 'input' | 'output'
> = {
  [K in keyof T['schema'] as K extends `${number}` ? K : never]: InferSchema<
    T['schema'][K],
    TMode
  >
}

export type ExtractOr<
  T extends Type.TypeOr,
  TMode extends 'input' | 'output',
  U = ExtractArrayLike<T, TMode>
> = U[keyof U] extends never ? any : U[keyof U]

export type ExtractArray<
  T extends Type.TypeArray,
  TMode extends 'input' | 'output',
  U = ExtractArrayLike<T, TMode>
> = U[keyof U] extends never
  ? any[]
  : AdjustReadonlyObject<T, Prettify<U[keyof U][]>>
