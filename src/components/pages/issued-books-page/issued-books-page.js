import {useEffect, useState} from "react";
import NewIssuanceForm from "../../new-issuance-form/new-issuance-form";
import Table from "../../table/table";
import SortPanel from "../../sort-panel/sort-panel";
import SearchPanel from "../../search-panel/search-panel";
import {useSearch, useShift, useSort} from "../../../hooks/hooks";

import './issued-books-page.scss';

const {ipcRenderer} = window.require('electron');

const IssuedBooksPage = () => {
    const [activeData, setActiveData] = useState([]);
    const [completedData, setCompletedData] = useState([]);
    const [visibleTable, setVisibleTable] = useState('active');
    const [update, setUpdate] = useState(false);

    const {visibleData, onUpdateSearchOption, onUpdateTerm} = useSearch('title', visibleTable === 'active' ? activeData : completedData);
    const {sortOption, sortingOrder, onUpdateSortOption, onToggleSortingOrder} = useSort('issue_date', 'DESC');
    const {shiftRight, shiftDown, shiftBlock} = useShift();

    useEffect(() => {
        const active = ipcRenderer.sendSync('get-all', 'issued_books_view', `WHERE actual_return_date = 0 ORDER BY ${sortOption} ${sortingOrder}`);
        const completed = ipcRenderer.sendSync('get-all', 'issued_books_view', `WHERE actual_return_date != 0 ORDER BY ${sortOption} ${sortingOrder}`);

        setActiveData(prepareActive(active));
        setCompletedData(prepareCompleted(completed));
    }, [sortOption, sortingOrder, update]);


    const prepareActive = (array) => {
        array.forEach(item => {
            const returnDate = new Date(item['return_date']);
            const difference = Math.ceil((returnDate - new Date()) / (60 * 60 * 24 * 1000));

            item['issue_date'] = new Date(item['issue_date']).toLocaleDateString();
            item['return_date'] = returnDate.toLocaleDateString();
            item['debt'] = difference < 0 ? -3 * difference : ' '

            delete item['actual_return_date'];
        });
        return array;
    }

    const prepareCompleted = (array) => {
        array.forEach(item => {
            item['issue_date'] = new Date(item['issue_date']).toLocaleDateString();
            item['return_date'] = new Date(item['return_date']).toLocaleDateString();
            item['actual_return_date'] = new Date(item['actual_return_date']).toLocaleDateString();
        });
        return array;
    }

    const onToggleVisibleTable = (value) => {
        setVisibleTable(value);
    }

    const toCompleted = (id) => {
        const actualReturnDate = new Date().toISOString().split('T')[0];
        const {book_id} = ipcRenderer.sendSync('get-book-id', 'issued_books', 'issue_id', id);

        ipcRenderer.send('update-issued-book', actualReturnDate, id);
        ipcRenderer.send('set-count-book', 1, book_id);
        setUpdate(update => !update);
    }

    const deleteFromDB = (id) => {
        ipcRenderer.send('delete', 'issued_books', 'issue_id', id);
        setUpdate(update => !update);
    }

    const activeTableStyle = {'gridTemplateColumns': '26px repeat(3, 1fr) 115px 115px 59px'}
    const completedTableStyle = {'gridTemplateColumns': '26px repeat(3, 1fr) 115px 115px 150px'}

    const activeTableTitles = ['Книга', 'Читатель', 'Сотрудник', 'Дата выдачи', 'Дата возврата', 'Долг, р'];
    const completedTableTitles = ['Книга', 'Читатель', 'Сотрудник', 'Дата выдачи', 'Дата возврата', 'Факт. дата возврата'];

    const table = visibleTable === 'active' ?
        <Table rows={visibleData} titles={activeTableTitles} colored styles={activeTableStyle}
               onDeleteRow={toCompleted}/>
        :
        <Table rows={visibleData} titles={completedTableTitles} styles={completedTableStyle}
               onDeleteRow={deleteFromDB}/>



    const optionsForSort = {
        title: 'названию книги',
        reader_name: 'имени читателя',
        employee_name: 'имени сотрудника',
        issue_date: 'дате выдачи',
        return_date: 'дате возврата'
    }

    const optionsForSearch = {
        title: 'названию книги',
        reader_name: 'имени читателя',
        employee_name: 'имени сотрудника',
        issue_date: 'дате выдачи',
    }

    return (
        <div className='issuedBooks'>
            <div className="menu">
                <button className="menu__button"
                        onClick={shiftBlock}>{!shiftRight ? 'Выдать книгу' : 'Убрать'}</button>
                <SearchPanel
                    onUpdateSearch={onUpdateTerm}
                    onUpdateSearchOption={onUpdateSearchOption}
                    initialSearchOption="title"
                    placeholder="Найти запись"
                    options={optionsForSearch}/>
                <SortPanel
                    onUpdateSortOption={onUpdateSortOption}
                    onToggleSortingOrder={onToggleSortingOrder}
                    initialSortOption="issue_date"
                    initialSortingOrder="DESC"
                    options={optionsForSort}/>
            </div>

            <div className={`issuedBooks__formWrapper ${shiftRight ? 'shift-right' : ''}`}>
                <NewIssuanceForm
                    hide={shiftBlock}
                    setUpdate={() => setUpdate(update => !update)}/>
            </div>

            <div className={`issuedBooks__tableWrapper ${shiftDown ? 'shift-down' : ''}`}>
                <div className="issuedBooks__navigation">
                    <div
                        className={visibleTable === 'active' ? 'isActive' : ''}
                        onClick={() => onToggleVisibleTable('active')}>
                        Выданные книги
                    </div>
                    |
                    <div
                        className={visibleTable === 'completed' ? 'isActive' : ''}
                        onClick={() => onToggleVisibleTable('completed')}>
                        История выдачи
                    </div>
                </div>
                {table}
            </div>
        </div>
    )
}

export default IssuedBooksPage;