import AppHeader from "../../app-header/app-header";
import {Route, Routes, useNavigate} from "react-router-dom";
import BooksPage from "../books-page/books-page";
import IssuedBooksPage from "../issued-books-page/issued-books-page";
import OrderingBooksPage from "../ordering-books-page/ordering-books-page";
import ReadersPage from "../readers-page/readers-page";
import AboutBookPage from "../about-book-page/about-book-page";
import AddBookPage from "../add-book-page/add-book-page";
import {useEffect} from "react";

const {ipcRenderer} = window.require('electron');
const {appPath, isDev} = ipcRenderer.sendSync('get-options');

const MainPage = () => {
    const history = useNavigate();

    useEffect(() => {
        history('/main/books');
    }, []);

    return (
        <main>
            <AppHeader/>
            <Routes>
                <Route path="books" element={<BooksPage appPath={appPath} isDev={isDev}/>}/>
                <Route path='issued-books' element={<IssuedBooksPage/>}/>
                <Route path='ordering-books' element={<OrderingBooksPage/>}/>
                <Route path='readers' element={<ReadersPage/>}/>
                <Route path='books/book-:book_id' element={<AboutBookPage appPath={appPath} isDev={isDev}/>}/>
                <Route path='books/add-book' element={<AddBookPage/>}/>
            </Routes>
        </main>
    )
}

export default MainPage;