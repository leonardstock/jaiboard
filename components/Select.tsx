const Select = ({ options }: { options: string[] }) => {
    return (
        <select className='shadow-md p-3 rounded-lg border-2 border-gray-200'>
            {options.map((option) => (
                <option key={option}>{option}</option>
            ))}
        </select>
    );
};

export default Select;
