import React, {useState} from "react";
import './new-emp-pub-form.scss';

const {ipcRenderer} = window.require('electron');

const NewEmpPubForm = ({setUpdate, hide, table, nameFieldText}) => {
    const [inputState, setInputState] = useState({
        name: '',
        address: '',
        phoneNumber: ''
    });

    const onChangeInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputState({
            ...inputState,
            [name]: value
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const {name, address, phoneNumber} = inputState;

        ipcRenderer.send('insert-emp-pub', table,  name, address, phoneNumber);

        e.target.reset();
        setUpdate();
        hide();
    }

    return (
        <form onSubmit={onSubmit} className="newEmpPubForm">
            <label>
                <span>{nameFieldText}:</span>
                <input type="text" name="name" onChange={onChangeInput} value={inputState.employee}/>
            </label>
            <label>
                <span>Адрес:</span>
                <input type="text" name="address" onChange={onChangeInput} value={inputState.address}/>
            </label>
            <label>
                <span>Номер телефона:</span>
                <input type="text" name="phoneNumber" onChange={onChangeInput} value={inputState.phoneNumber}/>
            </label>

            <button type='submit'>Сохранить</button>
        </form>
    )
}

export  default NewEmpPubForm;