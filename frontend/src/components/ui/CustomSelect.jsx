import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './CustomSelect.css';

const CustomSelect = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    icon: Icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-select-container" ref={containerRef}>
            <div
                className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
                onClick={toggleOpen}
            >
                <div className="select-value">
                    {Icon && <Icon size={16} className="select-icon" />}
                    <span>{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown size={16} className={`chevron ${isOpen ? 'rotate' : ''}`} />
            </div>

            {isOpen && (
                <div className="custom-select-options">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`custom-option ${value === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            <span>{option.label}</span>
                            {value === option.value && <Check size={14} className="check-icon" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
