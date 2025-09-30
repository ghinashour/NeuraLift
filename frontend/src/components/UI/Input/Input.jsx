import React from 'react';

const Input = ({ label, name, value, onChange, type = 'text', required = false, ...props }) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="input-field textarea"
          required={required}
          {...props}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="input-field"
          required={required}
          {...props}
        />
      )}
    </div>
  );
};

export default Input;