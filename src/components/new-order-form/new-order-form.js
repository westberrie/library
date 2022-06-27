import React, {useState} from "react";
import InputWithSelect from "../input-with-select/input-with-select";
import './new-order-form.scss';

const {ipcRenderer} = window.require('electron');

const NewOrderForm = (props) => {
    const [count, setCount] = useState('');
    const [inputState, setInputState] = useState({
        book: '',
        author: '',
        publisher: '',
    });

    const onChangeInputWithSelect = ({name, value}) => {
        setInputState({
            ...inputState,
            [name]: value
        });
    }

    const onChangeInput = (e) => {
        const value = e.target.value;
        setCount(value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const {book, author, publisher} = inputState;
        const order_date = new Date().toISOString().split('T')[0];

        ipcRenderer.send('insert-ordering-book', book, author, count, publisher, order_date, 0);

        e.target.reset();
        props.setUpdate();
        props.hide();
    }

    return (
        <form onSubmit={onSubmit} className='newOrderForm'>
            <InputWithSelect name="book" label="Книга" onChangeInput={onChangeInputWithSelect}/>
            <InputWithSelect name="author" label="Автор" onChangeInput={onChangeInputWithSelect}/>
            <InputWithSelect name="publisher" label="Издательство" onChangeInput={onChangeInputWithSelect}/>

            <label className="newOrderForm__count">
                <span>Количество: </span>
                <input type="number" name='count' onChange={onChangeInput} value={count}/>
            </label>
            <button type="submit">Сохранить</button>
        </form>
    )
}

export default NewOrderForm;