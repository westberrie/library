import React, {useEffect, useState} from "react";
import InputWithSelect from "../input-with-select/input-with-select";
import './new-issuance-form.scss';

const {ipcRenderer} = window.require('electron');

const NewIssuanceForm = (props) => {
    const [returnDate, setReturnDate] = useState(new Date());
    const [inputState, setInputState] = useState( {
        book: '',
        reader: '',
        employee: '',
    });

    useEffect(() => {
        let date = new Date()
        date = new Date(date.setMonth(date.getMonth()+1));
        date = date.toISOString().split('T')[0];
        setReturnDate(date);
    }, []);

    const onChangeDate = (e) => {
        const value = e.target.value;
        setReturnDate(value);
    }

    const onChangeInputWithSelect = ({name, id}) => {
        setInputState({
            ...inputState,
            [name]: id
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const {book, reader, employee} = inputState;
        const issueDate = new Date().toISOString().split('T')[0];

        ipcRenderer.send('insert-issued-book', book, reader, employee, issueDate, returnDate, 0);
        ipcRenderer.send('set-count-book', -1, book);

        e.target.reset();
        props.setUpdate();
        props.hide();
    }

    return (
        <form onSubmit={onSubmit} className='newIssuanceForm'>
            <InputWithSelect name="book" label="Книга" onChangeInput={onChangeInputWithSelect} onlySelect/>
            <InputWithSelect name="employee" label="Сотрудник" onChangeInput={onChangeInputWithSelect} onlySelect/>
            <InputWithSelect name="reader" label="Читатель" onChangeInput={onChangeInputWithSelect} onlySelect/>

            <label className="newIssuanceForm__returnDate">
                <span>Дата возврата: </span>
                <input type="date" name='returnDate' onChange={onChangeDate} value={returnDate}/>
            </label>
            <button type="submit">Сохранить</button>
        </form>
    )
}

export default NewIssuanceForm;