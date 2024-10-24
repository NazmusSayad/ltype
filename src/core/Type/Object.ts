import {
  TypeSchemaAll,
  TypeSchemaPrimitive,
  AdjustReadonlyObject,
} from './_common.type'
import { RypeOk } from '@/RypeOk'
import { RypeError } from '@/Error'
import { SchemaFreezableCore } from '@/core/SchemaCore'
import { SchemaCheckConf, SchemaConfig } from '@/config'
import { InferClassFromSchema, InferSchema } from '@/core/Extract.type'
import { MakeOptional, ObjectMerge, Prettify, ValidObject } from '@/utils.type'

export class SchemaObject<
  T extends SchemaObject.Input,
  R extends SchemaConfig,
> extends SchemaFreezableCore<T, R> {
  protected name = 'object' as const

  protected checkTypeAndGet(
    input: ValidObject,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    const output: ValidObject = {}

    for (const key in this.schema) {
      const schema = this.schema[key] as TypeSchemaPrimitive
      const inputKey = (schema.config.inputAsKey ?? key) as keyof ValidObject
      const outputKey = (schema.config.outputAsKey ?? key) as keyof ValidObject

      const result = schema['checkAndGetResult'](input[inputKey], {
        ...conf,
        path: `${conf.path || 'object'}.${inputKey}`,
      })

      if (result !== undefined) {
        output[outputKey] = result
      }
    }

    return new RypeOk(output)
  }

  /**
   * Creates a new schema where all properties are marked as optional (not required).
   * @returns A new schema with optional properties.
   * @example
   * ```ts
   * const schema = r.object({
   *   name: r.string().required(),
   *   age: r.number().required(),
   * }).partial()
   * const result = schema.parseTyped({ name: 'John' }) // { name: 'John' }
   * ```
   */
  public partial(): SchemaObject<
    {
      [K in keyof T]: InferClassFromSchema<
        T[K],
        T[K]['schema'],
        ObjectMerge<T[K]['config'], { isRequired: false }>
      >
    },
    R
  > {
    const schema = this.superClone() as any // TypeScript Sucks
    for (const key in schema.schema) {
      schema.schema[key] = schema.schema[key].superClone()
      schema.schema[key].config.isRequired = false
    }

    return schema
  }

  /**
   * Creates a new schema where all properties are marked as required.
   * @returns A new schema with required properties.
   * @example
   * ```ts
   * const schema = r.object({
   *   name: r.string().optional(),
   *   age: r.number().optional(),
   * }).impartial()
   * const result = schema.parseTyped({ name: 'John' }) // Error
   * ```
   */
  public impartial(): SchemaObject<
    {
      [K in keyof T]: InferClassFromSchema<
        T[K],
        T[K]['schema'],
        ObjectMerge<T[K]['config'], { isRequired: true }>
      >
    },
    R
  > {
    const schema = this.superClone() as any // TypeScript Sucks
    for (const key in schema.schema) {
      schema.schema[key] = schema.schema[key].superClone()
      schema.schema[key].config.isRequired = true
    }

    return schema
  }

  /**
   * Creates a new schema by selecting specific properties from the original schema.
   * @param args - The keys of the properties to include in the new schema.
   * @returns A new schema with selected properties or an empty schema if no properties are selected.
   * @example
   * ```ts
   * const schema = r.object({
   *   name: r.string(),
   *   age: r.number(),
   * }).pick('name')
   * const result = schema.parseTyped({ name: 'John', age: 20 }) // { name: 'John' }
   * ```
   */
  public pick<Key extends (keyof T)[]>(
    ...args: Key
  ): Key[number] extends never
    ? SchemaObject<{}, R>
    : SchemaObject<Pick<T, Key[number]>, R> {
    const schema = this.superClone()

    for (const key in schema.schema) {
      if (!args.includes(key)) {
        delete schema.schema[key]
      }
    }

    return schema as any // TypeScript Sucks
  }

  /**
   * Creates a new schema by omitting specific properties from the original schema.
   * @param args - The keys of the properties to exclude from the new schema.
   * @returns A new schema with omitted properties or the original schema if no properties are omitted.
   * @example
   * ```ts
   * const schema = r.object({
   *   name: r.string(),
   *   age: r.number(),
   * }).omit('age')
   * const result = schema.parseTyped({ name: 'John', age: 20 }) // { name: 'John' }
   * ```
   */
  public omit<Key extends (keyof T)[]>(
    ...args: Key
  ): Key[number] extends never
    ? typeof this
    : SchemaObject<Omit<T, Key[number]>, R> {
    const schema = this.superClone()
    for (const key in schema.schema) {
      if (args.includes(key)) {
        delete schema.schema[key]
      }
    }

    return schema as any // TypeScript Sucks
  }
}
export namespace SchemaObject {
  export type Input = { [key: string]: TypeSchemaAll }
  export type Sample = SchemaObject<any, any>
  export type Extract<
    T extends Sample,
    TMode extends 'input' | 'output',
  > = AdjustReadonlyObject<
    T,
    Prettify<
      MakeOptional<{
        [K in keyof T['schema'] as TMode extends 'input'
          ? T['schema'][K]['config']['inputAsKey'] extends string
            ? T['schema'][K]['config']['inputAsKey']
            : K
          : TMode extends 'output'
            ? T['schema'][K]['config']['outputAsKey'] extends string
              ? T['schema'][K]['config']['outputAsKey']
              : K
            : K]: InferSchema<T['schema'][K], TMode>
      }>
    >
  >
}
