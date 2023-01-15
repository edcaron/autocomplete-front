export type AutoCompleteSuggestionsListProps = {
    suggestions: string[];
    onClick: (value: string) => void
};

const AutoCompleteSuggestionsList = ({ suggestions, onClick }: AutoCompleteSuggestionsListProps): JSX.Element => {

    return (
        <div className="autoCompleteResultsWrapper" data-testid="auto_complete_suggestions_list">{
                suggestions.map((query: string) => {
                    return <div className="autoCompleteResultItem" key={query} onClick={() => onClick(query)} data-testid={`list_result_${query}`}>{query}</div>
                })
            }
        </div>
    )
};

export default AutoCompleteSuggestionsList;