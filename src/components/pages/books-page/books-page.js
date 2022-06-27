import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import './books-page.scss';
import SearchPanel from "../../search-panel/search-panel";
import {useSearch} from "../../../hooks/hooks";

const {ipcRenderer} = window.require('electron');
const path = window.require('path');


const BooksPage = ({appPath, isDev, history}) => {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);

    const {visibleData, onUpdateSearchOption, onUpdateTerm} = useSearch('title', books);

    useEffect(() => {
        const books = ipcRenderer.sendSync('get-all', 'books_view', 'ORDER BY title');
        setBooks(books);

    }, []);


    const options = {
        title: 'названию',
        key_phrase: 'ключевой фразе',
        author_name: 'имени автора',
        genre: 'жанру',
        publisher: 'названию издательства'
    }

    return (
        <div className='booksPage'>
            <div className='menu'>
                <SearchPanel
                    onUpdateSearch={onUpdateTerm}
                    onUpdateSearchOption={onUpdateSearchOption}
                    initialSearchOption="title"
                    placeholder="Найти книгу"
                    options={options}/>
                <button className="menu__button" onClick={() => navigate('add-book')}>Добавить книгу</button>
            </div>
            <div className='booksPage__content'>
                {visibleData.map(({book_id, ...bookProps}) => (
                    <Book key={book_id} book_id={book_id} {...bookProps} appPath={appPath} isDev={isDev}/>
                ))}
            </div>
        </div>
    )
}

function Book({book_id, title, image, appPath, isDev}) {
    const imgNumber = image ? book_id : 0
    const imageUrl = path.join('file:///', isDev ? appPath : appPath.slice(0, appPath.length - 8), 'extraResources/images', `book_${imgNumber}.jpeg`);

    return (
        <Link to={`book-${book_id}`} className='book'>
            <div className='book__image' style={{backgroundImage: `url(${imageUrl})`}}/>
            <div className='book__title'>{title}</div>
        </Link>
    );
}

export default BooksPage;