const FormRowSelect = ({ name, labelText, list, defaultValue = "", onChange }) => {
    return (
        <div className="grid grid-cols-1 gap-1 text-sm">
            <label htmlFor={name} className="block text-gray-600 text-sm font-medium">
                {labelText || name}
            </label>
            <select
                name={name}
                id={name}
                className="w-full border border-abuabu rounded-md shadow p-1 focus:outline-none focus:border-primary1"
                defaultValue={defaultValue}
                onChange={onChange}
                required
            >
                {list.map((itemValue) => {
                    return (
                        <option key={itemValue} value={itemValue}>
                            {itemValue}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};
export default FormRowSelect;
