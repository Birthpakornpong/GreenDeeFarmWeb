import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'
const SelectComponent = ({ name, type = "text", label, placeholder, value, onChange, required, errors = {}, options = [], disabled = false }) => {
    const [focus, setFocus] = useState(false);
    return (
        <>
            {(focus || value?.length > 0 || value > 0) &&
                <div className="absolute bg-white left-4 px-2 z-20" style={{ top: -10 }}>
                    <span className="text-blue-secondary text-sm">{label}
                        {required &&
                            <span className='text-red-500 text-sm'>&nbsp;*</span>
                        }
                    </span>
                </div>
            }
            {/* <input
                name={name}
                key={name}
                type={type}
                onChange={onChange}
                value={value}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                placeholder={`${placeholder} ${required ? "*" : ""}`}
                className={`form-control w-full focus:border-sky-700 ${errors[name] ? "border-red-500" : ""}`} /> */}
            <div
                name={name}
                key={name}
                className='w-full'>
                <Select
                    isDisabled={disabled}
                    className="react-select w-full"
                    classNamePrefix="react-select"
                    placeholder={`${label} ${required ? "*" : ""}`}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    value={options.find(x => x.value == value) ?? ""}
                    styles={{
                        // Fixes the overlapping problem of the component
                        menu: provided => ({ ...provided, zIndex: 9999 })
                    }}
                    onChange={onChange}
                    isClearable
                    options={options} />
                <span className='text-red-500 text-sm'>{errors[name]}</span>
            </div>

        </>
    )
}

export default SelectComponent;