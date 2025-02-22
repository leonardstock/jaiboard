const Select = ({
    options,
    label,
    value,
    onChange,
}: {
    options: string[];
    label: string;
    value: string;
    onChange: (value: string) => void;
}) => {
    return (
        <div className='flex flex-col gap-2'>
            <label
                className='block text-sm font-medium text-gray-700'
                htmlFor='select'>
                {label}
            </label>
            <select
                className='shadow-md p-3 rounded-lg border-2 border-gray-200'
                name='select'
                value={value}
                onChange={(e) => onChange(e.target.value)}>
                {options.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default Select;
