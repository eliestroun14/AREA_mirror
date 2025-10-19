import { Prisma } from '@prisma/client';

type Value = string | boolean | number | null;
type UnknownObject = Record<string, object | Value>;
type FlattenObject = Record<string, Value>;

export default class JsonValueParser {
  static parse<T>(jsonValue: Prisma.JsonValue) {
    return typeof jsonValue === 'object'
      ? (jsonValue as T)
      : (JSON.parse(jsonValue as string) as T);
  }

  public static transformResponseToVariables(
    obj: UnknownObject,
    variablesTransformer: UnknownObject,
  ) {
    const renamed = this.renameObjectWithKeys(obj, variablesTransformer);
    return this.flattenObject(renamed);
  }

  private static flattenObject(obj: UnknownObject): FlattenObject {
    let flattened: FlattenObject = {};

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null
      ) {
        flattened[key] = value;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        flattened = {
          ...flattened,
          ...this.flattenObject(value as UnknownObject),
        };
      }
    }
    return flattened;
  }

  private static renameObjectWithKeys(
    obj: UnknownObject,
    keys: UnknownObject,
  ): UnknownObject {
    const renamed: UnknownObject = {};

    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        renamed[key] = this.renameObjectWithKeys(
          obj[key] as UnknownObject,
          keys[key] as UnknownObject,
        );
      } else if (typeof keys[key] === 'string') {
        renamed[keys[key]] = obj[key];
      }
    }
    return renamed;
  }
}
