import React, {useState} from "react";
import './new-reader-form.scss'

const {ipcRenderer} = window.require('electron');

const NewReaderForm = (props) => {
    const [inputState, setInputState] = useState({
        reader: '',
        passport: '',
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

        const {reader, passport, address, phoneNumber} = inputState;
        ipcRenderer.send('insert-reader', reader, passport, address, phoneNumber);

        e.target.reset();
        props.setUpdate();
        props.hide();
    }


    return (
        <form onSubmit={onSubmit} className='newReaderForm'>
            <label>
                <span>ФИО:</span>
                <input type="text" name="reader" onChange={onChangeInput} value={inputState.reader}/>
            </label>
            <label>
                <span>Паспорт:</span>
                <input type="text" name="passport" onChange={onChangeInput} value={inputState.passport}/>
            </label>
            <label>
                <span>Адрес:</span>
                <input type="text" name="address" onChange={onChangeInput} value={inputState.address}/>
            </label>
            <label>
                <span>Номер телефона:</span>
                <input type="text" name="phoneNumber" onChange={onChangeInput} value={inputState.phoneNumber}/>
            </label>

            <button type="submit">Сохранить</button>
        </form>
    )
}

export default NewReaderForm;

