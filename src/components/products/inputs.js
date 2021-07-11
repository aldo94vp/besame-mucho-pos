import { useField } from 'formik';

export const Input = ({ label, hidden, ...props }) => {
  const [ field, meta ] = useField(props);

  return (
    <div className={['input-container ', hidden && ' hidden ', meta.error && ' has-error']}>
      <label htmlFor={field.name}>{label}</label>
      {field.name === 'price' && <span>$</span>}
      {field.name === 'discount' && <span>%</span>}
      <input {...field} {...props} autoComplete="nope" />
      {
        meta.touched && meta.error && (
          <span className="error">{meta.error}</span>
        )
      }
    </div>
  )
}

export const InputSimple = ({ name, label, onChange }) => {
  return (
    <div className='input-container'>
      <label htmlFor={name}>{label}</label>
      <input type="text" onChange={onChange} autoComplete="nope" />
    </div>
  )
}

export const FileInput = ({ label, onChange, ...props }) => {
  const [ field, meta ] = useField(props);

  return (
    <div>
      <label htmlFor={field.name}>{label}</label>
      <input accept="image/*;capture=camera" { ...{...field, type: 'file', onChange} } {...props} />
      {
        meta.touched && meta.error && (
          <span className="error">{meta.error}</span>
        )
      }
    </div>
  )
}
