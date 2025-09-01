import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const InputComponent = ({ name, type = "text", label, placeholder, value, onChange, required, errors = {}, isInput = true, disabled = false, rows = 4, min = 1,onBlur = () => {} }) => {
    const [focus, setFocus] = useState(false);
    return (
        <>
            {(focus || value?.length > 0 || value > 0) &&
                <div className="absolute bg-white left-4 px-2" style={{ top: -10 }}>
                    <span className="text-blue-secondary text-sm">{label}
                        {required &&
                            <span className='text-red-500 text-sm'>&nbsp;*</span>
                        }
                    </span>
                </div>
            }
            {isInput ? <input
                disabled={disabled}
                name={name}
                key={name}
                type={type}
                onChange={onChange}
                value={value ?? ""}
                min={0}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                placeholder={`${placeholder} ${required ? "*" : ""}`}
                className={`form-control w-full focus:border-sky-700 ${errors[name] ? "border-red-500" : ""}`} />
                : <textarea
                    disabled={disabled}
                    name={name}
                    key={name}
                    type={type}
                    onChange={onChange}
                    value={value ?? ""}
                    rows={rows}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    placeholder={`${placeholder} ${required ? "*" : ""}`}
                    className={`form-control w-full focus:border-sky-700 ${errors[name] ? "border-red-500" : ""}`} />}


            <span className='text-red-500 text-sm'>{errors[name]}</span>
        </>
    )
}

InputComponent.propTypes = {
    label: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired
};

export default InputComponent;