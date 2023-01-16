import { render, screen, fireEvent, act } from '@testing-library/react';
import AutoComplete, { AutoCompleteProps } from "../components/AutoComplete";
import AutoCompleteService from '../services/AutoCompleteService';

function renderComponent(props: Partial<AutoCompleteProps> = {}) {
	const defaultProps: AutoCompleteProps = {
		inputName: 'string',
		onChange: (el) => el,
		onSelect: (el) => el,
		service: new AutoCompleteService(),
	};
	return render(<AutoComplete {...defaultProps} {...props} />);
}

function mockFetch(data?: { data: string[] }) {
	data = data ?? { data: ['Suggestion 1'] };

	global.fetch = jest.fn(() =>
		Promise.resolve({
			json: () => Promise.resolve(data),
		}),
	) as jest.Mock;
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

test('onchange to be called after input value changed', () => {
	mockFetch();

	const onChangeSpy = jest.fn();

	const { getByTestId } = renderComponent({ onChange: onChangeSpy });

	const auto_complete_input = getByTestId('auto_complete_input');

	fireEvent.change(auto_complete_input, { target: { value: "some test value" } });

	expect(onChangeSpy).toHaveBeenCalledWith("some test value");
});

test('to have suggestions panel rendered after input changed', async () => {
	mockFetch();

	const onChangeSpy = jest.fn();

	const { getByTestId } = renderComponent({ onChange: onChangeSpy });

	const auto_complete_input = getByTestId('auto_complete_input');

	fireEvent.change(auto_complete_input, { target: { value: "some test value" } });

	const container_auto_complete = getByTestId('container_auto_complete');

	// wait for the debounce
	await act(async () => {
		await new Promise(res => setTimeout(res, 900));
	});

	expect(container_auto_complete).toHaveClass('has-suggestions');
});

test('to have suggestions panel with focused class on input focus', async () => {
	mockFetch();

	const { getByTestId } = renderComponent();

	act(() => {
		const auto_complete_input = getByTestId('auto_complete_input');
		auto_complete_input.focus();
	});

	const container_auto_complete = getByTestId('container_auto_complete');

	expect(container_auto_complete).toHaveClass('focused');
});

test('click on result to be executed and input value set', async () => {
	mockFetch();

	const onSelectSpy = jest.fn();

	const { getByTestId } = renderComponent({ onSelect: onSelectSpy });

	// wait for the debounce
	await act(async () => {
		const auto_complete_input = getByTestId('auto_complete_input');

		fireEvent.change(auto_complete_input, { target: { value: "some test value" } });

		await new Promise(res => setTimeout(res, 900));
	});

	fireEvent.click(getByTestId('list_result_Suggestion 1'));

	expect(onSelectSpy).toHaveBeenCalled();

	expect((getByTestId('auto_complete_input') as HTMLInputElement).value).toBe('Suggestion 1');
});
