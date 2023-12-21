export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  max?: number;
  min?: number;
}

export const validate = (validateElement: Validatable): boolean => {
  const { value, required, minLength, maxLength, max, min } = validateElement;
  let isValid = true;
  if (required) {
    isValid = isValid && Boolean(value.toString().trim().length);
  }
  if (minLength !== undefined && typeof value === 'string') {
    isValid = isValid && value.length >= minLength;
  }
  if (maxLength !== undefined && typeof value === 'string') {
    isValid = isValid && value.length <= maxLength;
  }
  if (min !== undefined && typeof value === 'number') {
    isValid = isValid && value >= min;
  }
  if (max !== undefined && typeof value === 'number') {
    isValid = isValid && value <= max;
  }
  return isValid;
};
