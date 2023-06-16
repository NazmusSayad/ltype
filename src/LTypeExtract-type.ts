import * as LT from './LType'
import { Mutable } from './utils-type'

export type ExtractPrimitiveType<T extends LT.Primitive> = T['args'][number]

type ExtractArray<T extends LT.Array> = {
  [K in keyof T['args']]: T['args'][K] extends LT.Schema
    ? LTypeExtract<T['args'][K]>
    : Mutable<T['args'][K]>
}

type ExtractObjectType<T extends LT.Object> = {
  [K in keyof T as T[K]['required'] extends true ? K : never]: LTypeExtract<
    T[K]
  >
} & {
  [K in keyof T as T[K]['required'] extends false ? K : never]?: LTypeExtract<
    T[K]
  >
}

export type LTypeExtract<T extends LT.Schema> = T extends LT.Primitive
  ? ExtractPrimitiveType<T>
  : T extends LT.Array
  ? ExtractArray<T>
  : T extends LT.Object
  ? ExtractObjectType<T>
  : never