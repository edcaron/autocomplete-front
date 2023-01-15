import { render, screen, fireEvent } from '@testing-library/react';
import AutoCompleteSuggestionsList, { AutoCompleteSuggestionsListProps } from "../components/AutoCompleteSuggestionsList";

function renderComponent(props: Partial<AutoCompleteSuggestionsListProps> = {}) {
  const defaultProps: AutoCompleteSuggestionsListProps = {
    suggestions: ['Suggestion 1', 'Suggestion 2'],
    onClick: (el) => console.log('aa')
  };
  return render(<AutoCompleteSuggestionsList {...defaultProps} {...props} />);
}

test('renders suggestions', () => {
  renderComponent();

  const suggestion1 = screen.getByText(/Suggestion 1/i);
  expect(suggestion1).toBeInTheDocument();

  const suggestion2 = screen.getByText(/Suggestion 2/i);
  expect(suggestion2).toBeInTheDocument();
});

test('action onclick executed', () => {
  const onClickSpy = jest.fn();  

  const { getByTestId } = renderComponent({onClick: onClickSpy});

  fireEvent.click(getByTestId('list_result_Suggestion 1'));
  

  expect(onClickSpy).toHaveBeenCalled();
});
