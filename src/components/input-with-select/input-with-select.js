import {useEffect, useState} from "react";
import './input-with-select.scss'


const {ipcRenderer} = window.require('electron');

const InputWithSelect = ({name, label, onChangeInput, onlySelect}) => {
    const [items, setItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [visibility, setVisibility] = useState('hidden');
    const [isSelected, setIsSelected] = useState(false);
    const [isBlur, setIsBlur] = useState(true);

    useEffect(() => {
        const tableName = name + 's';
        const order = name === 'book' ? 'title' : 'name'
        setItems(ipcRenderer.sendSync('get-all', tableName, `ORDER BY ${order}`));
    }, []);

    const onUpdateInputValue = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setIsSelected(false);
        setInputValue(value);
        setVisibleItems(searchItem(items, value));
        if (!onlySelect) {
            onChangeInput({name, value});
        }
    }

    const onSelect = (e) => {
        const value = e.target.innerText;
        const id = e.target.dataset.id;
        setInputValue(value);
        onChangeInput({name, value, id});
        setIsSelected(true);
    }

    useEffect(() => {
        if (onlySelect && !isSelected) {
            setInputValue('');
        }
    }, [isBlur])

    const onBlur = () => {
        setTimeout(() => {
            setIsBlur(true);
            setVisibility('hidden');
        }, 300);
    }

    const onFocus = () => {
        setIsBlur(false);
    }

    const searchItem = (items, inputValue) => {
        if (inputValue.length === 0) {
            setVisibility('hidden');
            return [];
        }

        const prop = name === 'book' ? 'title' : 'name';

        const filtered = items.filter((item) => {
            return item[prop].toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        });

        if (filtered.length > 0) setVisibility('visible');
        else setVisibility('hidden');

        return filtered.map((item) => {
            return <li key={`${item[prop]}-${item[`${name}_id`]}`} data-id={item[`${name}_id`]}
                       onClick={onSelect}>{item[prop]}</li>
        })
    }

    return (
        <div className="inputWithSelect">
            <label>
                <span>{label}:</span>
                <div className={'inputWithSelect__wrapper'}>
                    <input
                        type="text"
                        name={name}
                        onChange={onUpdateInputValue}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        value={inputValue}
                        placeholder={onlySelect ? 'Не выбрано' : ''}/>
                    <ul style={{visibility: visibility}}>
                        {visibleItems}
                    </ul>
                </div>
            </label>
        </div>
    )
}

export default InputWithSelect;