import AutoComplete from "../components/AutoComplete";
import AutoCompleteService from "../services/AutoCompleteService";

const HomePage = () => {
    return (
        <div className="home">
            <AutoComplete inputName='search-autocomplete' service={new AutoCompleteService()} />
        </div>
    );
};

export default HomePage;
