import { useState } from 'react';

export function useForm({ initialValues = {}, validate = () => ({}) }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const collectErrors = (nextValues, nextTouched) => {
    const result = validate(nextValues) || {};

    return Object.keys(result).reduce((acc, key) => {
      acc[key] = nextTouched[key] ? result[key] || '' : '';
      return acc;
    }, {});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };

    setValues(nextValues);
    if (touched[name]) setErrors(collectErrors(nextValues, touched));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const nextTouched = { ...touched, [name]: true };

    setTouched(nextTouched);
    setErrors(collectErrors(values, nextTouched));
  };

  const validateAll = () => {
    const nextErrors = validate(values) || {};
    const nextTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTouched(nextTouched);
    setErrors(nextErrors);

    return Object.values(nextErrors).every((message) => !message);
  };

  const setField = (name, value) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    return nextValues;
  };

  const reset = (nextValues) => {
    setValues(nextValues || initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, setField, handleChange, handleBlur, validateAll, reset };
}
