import React, { useCallback, useEffect, useState } from "react";
import debounce from 'lodash.debounce'

import { AutoCompleteServiceInterface } from "../services/AutoCompleteService";
import AutoCompleteSuggestionsList from "./AutoCompleteSuggestionsList";
import AutoCompleteInput from "./AutoCompleteInput";

export type AutoCompleteProps = {
    inputName?: string;
    onChange?: (value: string) => void;
    onSelect?: (value: string) => void;
    service: AutoCompleteServiceInterface;
};

const AutoComplete = ({ inputName, onChange, onSelect, service }: AutoCompleteProps) => {
    const [query, setQuery] = useState('');
    const [isQueryFocused, setIsQueryFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleInputChange = (value: any) => {
        setQuery(value)

        if (typeof onChange !== 'undefined') {
            onChange(value);
        }
    }
    
    const handleResultClick = (value: any) => {
        handleInputChange(value);

        if (typeof onSelect !== 'undefined') {
            onSelect(value);
        }
    }

    const handleInputFocus = () => {
        if (!isQueryFocused) {
            setIsQueryFocused(true)
        }
    }

    const handleInputBlur = (event: React.FocusEvent) => {        
        if (!event.currentTarget.contains(event.relatedTarget)) {
            if (isQueryFocused) {
                setIsQueryFocused(false)
            }
        }
    }

    // always return the same debounce between rerenders
    const loadSuggestions = useCallback(
        debounce((query) => fetchSuggestions(query), 300),
        []
    );

    // run every time the value of query chances
    useEffect(() => {
        loadSuggestions(query);
    }, [query, loadSuggestions]);    

    const fetchSuggestions = async (query: string) => {
        if (!query.length) {
            setSuggestions([]);
            return;
        }

        const suggestions = await service.getSuggestions(query);

        setSuggestions(suggestions);
    }

    const getHasSuggestionsClass = (): string => {
        return (suggestions.length > 0 ? 'has-suggestions' : '');
    }

    const getFocusedClass = (): string => {
        return (isQueryFocused ? 'focused' : 'hidden')
    }

    return (
        <>
            <div data-testid="container_auto_complete" className={["containerAutoComplete", getHasSuggestionsClass(), getFocusedClass()].join(' ')}>
                <div className="autoCompleteInputContainer">
                    <div className="autoCompleteInputWrapper">  
                        <AutoCompleteInput 
                            value={query}
                            inputName={inputName}
                            handleInputFocus={handleInputFocus}
                            handleInputBlur={handleInputBlur}
                            handleInputChange={ handleInputChange}
                        />
                    </div>
                </div>
                <div className="autoCompleteResultsContainer">
                    <AutoCompleteSuggestionsList suggestions={suggestions} onClick={(value) => handleResultClick(value)} />
                </div>
            </div>
        </>
    );
};

export default AutoComplete;