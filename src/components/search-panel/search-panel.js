import {useState} from "react";
import './search-panel.scss';

function SearchPanel({onUpdateSearchOption, onUpdateSearch, initialSearchOption, placeholder, options}) {
    const [searchOptions, setSearchOptions] = useState(initialSearchOption);
    const [term, setTerm] = useState('');

    const onUpdateSearchOptionLocal = (e) => {
        const searchOptions = e.target.value;
        setSearchOptions(searchOptions);
        onUpdateSearchOption(searchOptions);
    }

    const onUpdateTerm = (e) => {
        const term = e.target.value;
        setTerm(term);
        onUpdateSearch(term.toLowerCase());
    }

    return (
        <div className="searchPanel">
            <div className="searchPanel__options">
                <span>Поиск по:</span>
                <select value={searchOptions} onChange={onUpdateSearchOptionLocal}>
                    {Object.entries(options).map(item => (
                        <option key={item[0] + "-" + item[1]}  value={item[0]}>{item[1]}</option>
                    ))}
                </select>
            </div>
            <input
                className="searchPanel__searchField"
                type="text"
                placeholder={placeholder}
                value={term}
                onChange={onUpdateTerm}/>
        </div>
    )
}

export default SearchPanel;