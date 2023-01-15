const backend_url: string = (process.env.REACT_APP_BACKEND_URL as string);

export interface AutoCompleteServiceInterface {
    getSuggestions: (search: string) => Promise<string[]>
}

export default class AutoCompleteService implements AutoCompleteServiceInterface {

    async getSuggestions(search: string): Promise<string[]> {
        let url = backend_url + '/autocomplete?';

        url += new URLSearchParams({ search }).toString();

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        const json = await response.json();

        return json.data;
    }
}
