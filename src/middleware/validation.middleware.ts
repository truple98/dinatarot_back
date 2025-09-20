import { Request, Response, NextFunction } from 'express';

export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export function validateRequest(schema: ValidationSchema, source: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[source];
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field}는(은) 필수 입력 항목이다요!`);
        continue;
      }

      // Skip validation if field is not required and not provided
      if (!rules.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      if (rules.type) {
        let isValidType = false;
        switch (rules.type) {
          case 'string':
            isValidType = typeof value === 'string';
            break;
          case 'number':
            isValidType = typeof value === 'number' && !isNaN(value);
            break;
          case 'boolean':
            isValidType = typeof value === 'boolean';
            break;
          case 'array':
            isValidType = Array.isArray(value);
            break;
          case 'object':
            isValidType = typeof value === 'object' && value !== null && !Array.isArray(value);
            break;
        }

        if (!isValidType) {
          errors.push(`${field}의 타입이 올바르지 않다요! (${rules.type} 타입이어야 함)`);
          continue;
        }
      }

      // String length validation
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field}는(은) 최소 ${rules.minLength}자 이상이어야 한다요!`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field}는(은) 최대 ${rules.maxLength}자 이하여야 한다요!`);
        }
      }

      // Number range validation
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${field}는(은) 최소 ${rules.min} 이상이어야 한다요!`);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${field}는(은) 최대 ${rules.max} 이하여야 한다요!`);
        }
      }

      // Array length validation
      if (Array.isArray(value)) {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field}는(은) 최소 ${rules.minLength}개 이상의 항목이 필요하다요!`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field}는(은) 최대 ${rules.maxLength}개 이하의 항목만 허용된다요!`);
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: '입력 데이터가 올바르지 않다요!',
        errors
      });
      return;
    }

    next();
  };
}