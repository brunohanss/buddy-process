import { z } from 'zod';

export class Validator {
  static isValid(type: 'string' | 'number' | 'boolean' | 'array' | 'object', value: any, name: string) {
    let schema;

    switch (type) {
      case 'string':
        schema = z.string().min(1); // Non-empty string
        break;
      case 'number':
        schema = z.number().nonnegative(); // Non-negative number
        break;
      case 'boolean':
        schema = z.boolean();
        break;
      case 'array':
        schema = z.array(z.any()).min(1); // Non-empty array
        break;
      case 'object':
        schema = z.object({}).strict(); // Strict object validation
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }

    try {
      schema.parse(value);
    } catch (e) {
      console.log("e", JSON.stringify(e))
      if ((e as any)?.issues?.length) {
        return (e as any)?.issues?.map((issue: { message: string; }) => issue.message.replace("String", name))
      }
    }
  }
}

export default Validator;