import { render, screen, fireEvent, act } from '@testing-library/react';
import AutoComplete, { AutoCompleteProps } from "../components/AutoComplete";
import AutoCompleteService from '../services/AutoCompleteService';

function renderComponent(props: Partial<AutoCompleteProps> = {}) {
  const defaultProps: AutoCompleteProps = {
    inputName: 'string',
    onChange: (el) => console.log(el),
    onSelect: (el) => console.log(el),
    service: new AutoCompleteService(),
  };
  return render(<AutoComplete {...defaultProps} {...props} />);
}

test('auto_complete_suggestions_list to be rendered', () => {
  const { getByTestId } = renderComponent();

  const auto_complete_suggestions_list = getByTestId('auto_complete_suggestions_list');

  expect(auto_complete_suggestions_list).toBeInTheDocument();
});


test('auto_complete_input to be rendered', () => {
  const { getByTestId } = renderComponent();

  const auto_complete_input = getByTestId('auto_complete_input');

  expect(auto_complete_input).toBeInTheDocument();
});

test('onchange to be executed', () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(['Suggestion 1']),
    }),
  ) as jest.Mock;

  const onChangeSpy = jest.fn();

  const { getByTestId } = renderComponent({ onChange: onChangeSpy });

  const auto_complete_input = getByTestId('auto_complete_input');

  fireEvent.change(auto_complete_input, { target: { value: "1234" } });

  expect(onChangeSpy).toHaveBeenCalledWith("1234");
});

test('to have suggestions panel rendered after input changed', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: ['Suggestion 1'] }),
    }),
  ) as jest.Mock;

  const onChangeSpy = jest.fn();

  const { getByTestId } = renderComponent({ onChange: onChangeSpy });

  const auto_complete_input = getByTestId('auto_complete_input');

  fireEvent.change(auto_complete_input, { target: { value: "1234" } });

  const container_auto_complete = getByTestId('container_auto_complete');

  // await for the debounce
  await act(async () => {
    await new Promise(res => setTimeout(res, 900));
  });

  expect(container_auto_complete).toHaveClass('has-suggestions');
});

test('to have suggestions panel with focused class on input focus', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: ['Suggestion 1'] }),
    }),
  ) as jest.Mock;

  const { getByTestId } = renderComponent();

  act(() => {
    const auto_complete_input = getByTestId('auto_complete_input');
    auto_complete_input.focus();
  });

  const container_auto_complete = getByTestId('container_auto_complete');

  expect(container_auto_complete).toHaveClass('focused');
});

test('click on result to be executed and input value set', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: ['Suggestion 1'] }),
    }),
  ) as jest.Mock;

    const onSelectSpy = jest.fn();

    const { getByTestId } = renderComponent({ onSelect: onSelectSpy });

    // await for the debounce
    await act(async () => {
      const auto_complete_input = getByTestId('auto_complete_input');

      fireEvent.change(auto_complete_input, { target: { value: "1234" } });

      await new Promise(res => setTimeout(res, 900));
    });

    fireEvent.click(getByTestId('list_result_Suggestion 1'));

    expect(onSelectSpy).toHaveBeenCalled();

    expect((getByTestId('auto_complete_input') as HTMLInputElement ).value).toBe('Suggestion 1');    
});
