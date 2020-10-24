import { ValidationError } from 'yup';

interface Error {
  [key: string]: string;
}

export default function getValidationErros(err: ValidationError): Error {
  const validationErrors: Error = {};

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
