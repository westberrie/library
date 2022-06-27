import {useState} from "react";
import {useNavigate} from "react-router-dom";
import './add-book-page.scss';
import InputWithSelect from "../../input-with-select/input-with-select";

const {ipcRenderer} = window.require('electron');
const path = window.require('path');


const {appPath, isDev} = ipcRenderer.sendSync('get-options');

const AddBookPage = () => {
    const navigate = useNavigate();

    const [inputState, setInputState] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        year_publishing: '',
        page_count: '',
        publisher: '',
        unique_number: '',
        key_phrase: '',
        group: '',
        rack: '',
        cell: '',
        count: '',
        imageUrl: path.join('file:///', isDev ? appPath : appPath.slice(0, appPath.length - 8), 'extraResources/images', `book_0.jpeg`),
        imageUrlForSave: '',
    });

    const onSubmit = (e) => {
        e.preventDefault();

        const {title, author, genre, description, year_publishing, page_count, group, rack, cell, count, publisher, unique_number, key_phrase, imageUrlForSave} = inputState;

        let {author_id} = ipcRenderer.sendSync('get-id', 'author_id', 'authors', author.trim());
        if (!author_id) author_id = ipcRenderer.sendSync('insert-author', author.trim());

        let {genre_id} = ipcRenderer.sendSync('get-id', 'genre_id', 'genres', genre.trim());
        if (!genre_id) genre_id = ipcRenderer.sendSync('insert-genre', genre.trim());

        let {publisher_id} = ipcRenderer.sendSync('get-id', 'publisher_id', 'publishers', publisher.trim());
        if (!publisher_id) publisher_id = ipcRenderer.sendSync('insert-publisher', publisher.trim());

        const place = `${group}-${rack}-${cell}`;

        const image = imageUrlForSave ? 1 : 0;

        const book_id = ipcRenderer.sendSync('insert-book',
            title, author_id, genre_id, publisher_id, unique_number, key_phrase, description, year_publishing, page_count, place, count, image)

        if (image) {
            ipcRenderer.send('save-img', imageUrlForSave, book_id);
        }

        e.target.reset();

        navigate(-1);
    }

    const onChangeInput = ({target}) => {
        if (target.type === 'file') {
            setInputState({
                ...inputState,
                imageUrl: path.join('file:///', target.files[0].path),
                imageUrlForSave: target.files[0].path
            })
        } else {
            setInputState({
                ...inputState,
                [target.name]: target.value
            });
        }
    }

    const onChangeInputWithSelect = ({name, value}) => {
        setInputState({
            ...inputState,
            [name]: value
        });
    }

    return (
        <form onSubmit={onSubmit} className='addBook' method='POST'>
            <div className="menu">
                <button className="menu__button" onClick={() => navigate(-1)}>Назад</button>
                <input
                    type='text'
                    className='addBook__title'
                    onChange={onChangeInput}
                    name='title'
                    placeholder='Название книги'
                    required/>

                <button type='submit' className='menu__button'>Добавить</button>
            </div>
            <div className='addBook__content'>
                <div className='addBook__imgBorder'>
                    <label
                        className='addBook__img'
                        style={{backgroundImage: `url(${inputState.imageUrl})`}}>
                        <input type='file' name='imageUrl' onChange={onChangeInput}/>
                    </label>
                </div>
                <div className='addBook__info'>
                    <InputWithSelect name="author" label="Автор" onChangeInput={onChangeInputWithSelect}/>
                    <InputWithSelect name="genre" label="Жанр" onChangeInput={onChangeInputWithSelect}/>
                    <InputWithSelect name="publisher" label="Издательство" onChangeInput={onChangeInputWithSelect}/>

                    <label className="addBook__input">
                        <span>Уникальный номер (ISBN):</span>
                        <input type="text" name="unique_number" onChange={onChangeInput} value={inputState.unique_number}/>
                    </label>

                    <label className="addBook__input">
                        <span>Год издания:</span>
                        <input type="text" name="year_publishing" onChange={onChangeInput} value={inputState.year_publishing}/>
                    </label>

                    <label className="addBook__input">
                        <span>Количество страниц:</span>
                        <input type="text" name="page_count" onChange={onChangeInput} value={inputState.page_count}/>
                    </label>

                    <label className="addBook__input">
                        <span>Размещение:</span>
                        <input type="text" name="group" placeholder="Отдел" onChange={onChangeInput} value={inputState.group}/>
                        <input type="text" name="rack" placeholder="Стеллаж" onChange={onChangeInput} value={inputState.rack}/>
                        <input type="text" name="cell" placeholder="Ячейка" onChange={onChangeInput} value={inputState.cell}/>
                    </label>

                    <label className="addBook__input">
                        <span>Количество книг в хранилище:</span>
                        <input type="text" name="count" onChange={onChangeInput} value={inputState.count}/>
                    </label>
                </div>
                <div className="addBook__description">
                    <label className="addBook__input addBook__input-ta">
                        <span>Ключевая фраза:</span>
                        <textarea onChange={onChangeInput} name='key_phrase'/>
                    </label>

                    <label className="addBook__input addBook__input-ta">
                        <span>Описание:</span>
                        <textarea onChange={onChangeInput} name='description'/>
                    </label>
                </div>
            </div>
        </form>
    )
}

export default AddBookPage;