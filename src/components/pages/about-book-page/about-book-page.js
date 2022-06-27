import { useNavigate, useParams } from 'react-router-dom';
import './about-book-page.scss';

const {ipcRenderer} = window.require('electron');
const path = window.require('path');

const AboutBookPage = ({isDev, appPath}) => {
    const navigate = useNavigate();
    const {book_id} = useParams();
    const book = ipcRenderer.sendSync('get-book', book_id);

    const {
        title,
        author_name,
        genre,
        publisher_name,
        unique_number,
        key_phrase,
        description,
        year_publishing,
        page_count,
        place,
        count,
        image
    } = book;

    const [group, rack, cell] = place.split('-');
    const imgNumber = image ? book_id : 0
    const imageUrl = path.join('file:///', isDev ? appPath : appPath.slice(0, appPath.length - 8), 'extraResources/images', `book_${imgNumber}.jpeg`);

    const deleteBook = (id) => {
        const answer = ipcRenderer.sendSync('confirmation', title);
        if (answer) {
            ipcRenderer.send('delete', 'books', 'book_id', id);
            ipcRenderer.send('delete-img', imageUrl.slice(5, imageUrl.length));
            navigate(-1);
        }
    }

    return (
        <div className='aboutBook'>
            <div className="menu">
                <button className="menu__button" onClick={() => navigate(-1)}>Назад</button>
                <div className='aboutBook__title'>{title}</div>
                <div className='menu__button' onClick={() => deleteBook(book_id)}>Удалить</div>
            </div>
            <div className='aboutBook__content'>
                <div className='aboutBook__imgBorder'>
                    <div className='aboutBook__img' style={{backgroundImage: `url(${imageUrl})`}}/>
                </div>
                <div className='aboutBook__info'>
                    <div><span>Автор:</span> {author_name}</div>
                    <div><span>Жанр:</span> {genre}</div>
                    <div><span>Издательство:</span> {publisher_name}</div>
                    <div><span>Уникальный номер (ISBN):</span> {unique_number}</div>
                    <div><span>Год издания:</span> {year_publishing}</div>
                    <div><span>Количество страниц:</span> {page_count}</div>
                    <div><span>Размещение:</span> Отдел - {group}&#8195;&#8195;Стеллаж - {rack}&#8195;&#8195;Ячейка - {cell}</div>
                    <div><span>Количество книг в хранилище:</span> {count}</div>
                </div>
                <div className="aboutBook__description">
                    <div>
                        <span data-description="title">Ключевая фраза:</span>
                        <div data-descriptin="text">{key_phrase}</div>
                    </div>

                    <div>
                        <span data-description="title">Описание:</span>
                        <div data-descriptin="text">{description}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutBookPage;