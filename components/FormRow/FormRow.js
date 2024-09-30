import React from 'react';

const FormRow = ({ type, name, labelText, value, onChange, style, inputStyle, readOnly = false, options = [] }) => {
    return (
        <div className={style}>
            <label htmlFor={name} className="block text-gray-600 text-sm font-medium">
                {labelText}
            </label>
            {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    className={`w-full border border-abuabu rounded-md shadow p-1 focus:outline-none focus:border-primary1 ${inputStyle}`}
                    value={value}
                    onChange={onChange}
                    required
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    className={`w-full border border-abuabu rounded-md shadow p-1 focus:outline-none focus:border-primary1 ${inputStyle}`}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    required
                />
            )}
        </div>
    );
};

export default FormRow;