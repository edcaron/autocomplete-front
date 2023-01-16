type AutoCompleteInputProps = {
    value: string;
    inputName?: string;
    handleInputFocus: () => void;
    handleInputBlur: (evt: React.FocusEvent) => void;
    handleInputChange: (value: string) => void;
};

const AutoCompleteInput = ({
    value,
    inputName,
    handleInputFocus,
    handleInputBlur,
    handleInputChange,
}: AutoCompleteInputProps): JSX.Element => {
    return (
        <input
            data-testid="auto_complete_input"
            className="autoCompleteInput"
            type="text"
            placeholder="type something cool"
            value={value}
            name={inputName}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={(el) => handleInputChange(el.target.value)}
            autoComplete="off"
        />
    );
};

export default AutoCompleteInput;
