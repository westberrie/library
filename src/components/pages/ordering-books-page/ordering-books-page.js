import React, {useEffect, useState} from "react";
import Table from "../../table/table";
import SortPanel from "../../sort-panel/sort-panel";
import {useSearch, useShift, useSort} from "../../../hooks/hooks";
import SearchPanel from "../../search-panel/search-panel";

import './ordering-books-page.scss';
import NewOrderForm from "../../new-order-form/new-order-form";

const {ipcRenderer} = window.require('electron');

const OrderingBooksPage = () => {
    const [activeData, setActiveData] = useState([]);
    const [completedData, setCompletedData] = useState([]);
    const [visibleTable, setVisibleTable] = useState('active');
    const [update, setUpdate] = useState(false);

    const {visibleData, onUpdateSearchOption, onUpdateTerm} = useSearch('book', visibleTable === 'active' ? activeData : completedData);
    const {sortOption, sortingOrder, onUpdateSortOption, onToggleSortingOrder} = useSort('order_date', 'DESC');
    const {shiftRight, shiftDown, shiftBlock} = useShift();

    useEffect(() => {
        const active = ipcRenderer.sendSync('get-all', 'ordering_books', `WHERE delivery_date = 0 ORDER BY ${sortOption} ${sortingOrder}`);
        const completed = ipcRenderer.sendSync('get-all', 'ordering_books', `WHERE delivery_date != 0 ORDER BY ${sortOption} ${sortingOrder}`);

        setActiveData(prepareActive(active));
        setCompletedData(prepareCompleted(completed));
    }, [sortOption, sortingOrder, update]);

    const prepareActive = (array) => {
        array.forEach(item => {
            item['order_date'] = new Date(item['order_date']).toLocaleDateString();
            delete item['delivery_date'];
        });
        return array;
    }

    const prepareCompleted = (array) => {
        array.forEach(item => {
            item['order_date'] = new Date(item['order_date']).toLocaleDateString();
            item['delivery_date'] = new Date(item['delivery_date']).toLocaleDateString();
        });
        return array;
    }

    const onToggleVisibleTable = (value) => {
        setVisibleTable(value);
    }

    const toCompleted = (id) => {
        const index = activeData.findIndex(elem => elem['ordering_id'] === id)
        const count = activeData[index]['count'];
        const bookTitle = activeData[index]['book'];

        let {book_id} = ipcRenderer.sendSync('get-book-id', 'books', 'title', bookTitle);
        if (book_id) ipcRenderer.send('set-count-book', count, book_id);

        const delivery_date = new Date().toISOString().split('T')[0];
        ipcRenderer.send('update-ordering-book', delivery_date, id);
        setUpdate(update => !update);
    }

    const deleteFromDB = (id) => {
        ipcRenderer.send('delete', 'ordering_books', 'ordering_id', id);
        setUpdate(update => !update);
    }

    const activeTableStyle = {'gridTemplateColumns': '26px repeat(2, 1fr) 90px 1fr 94px'}
    const completedTableStyle = {'gridTemplateColumns': '26px repeat(2, 1fr) 90px 1fr 94px 112px'}

    const activeTableTitles = ['??????????', '??????????', '????????????????????', '????????????????????????', '???????? ????????????'];
    const completedTableTitles = ['??????????', '??????????', '????????????????????', '????????????????????????', '???????? ????????????', '???????? ????????????????'];

    const table = visibleTable === 'active' ?
        <Table rows={visibleData} titles={activeTableTitles} styles={activeTableStyle} onDeleteRow={toCompleted}/>
        :
        <Table rows={visibleData} titles={completedTableTitles} styles={completedTableStyle}
               onDeleteRow={deleteFromDB}/>

    const optionsForSort = {
        book: '???????????????? ??????????',
        author: '?????????? ????????????',
        count: '????????????????????',
        publisher: '???????????????? ????????????????????????',
        order_date: '???????? ????????????'
    }

    const optionsForSearch = {
        book: '????????????????',
        author: '?????????? ????????????',
        publisher: '????????????????????????',
        order_date: '???? ???????? ????????????'
    }

    return (
        <div className='issuedBooks'>
            <div className="menu">
                <button className="menu__button"
                        onClick={shiftBlock}>{!shiftRight ? '???????????????? ??????????' : '????????????'}</button>
                <SearchPanel
                    onUpdateSearch={onUpdateTerm}
                    onUpdateSearchOption={onUpdateSearchOption}
                    initialSearchOption="book"
                    placeholder="?????????? ????????????"
                    options={optionsForSearch}/>
                <SortPanel
                    onUpdateSortOption={onUpdateSortOption}
                    onToggleSortingOrder={onToggleSortingOrder}
                    initialSortOption="order_date"
                    initialSortingOrder="DESC"
                    options={optionsForSort}/>
            </div>

            <div className={`issuedBooks__formWrapper ${shiftRight ? 'shift-right' : ''}`}>
                <NewOrderForm
                    hide={shiftBlock}
                    setUpdate={() => setUpdate(update => !update)}/>
            </div>

            <div className={`issuedBooks__tableWrapper ${shiftDown ? 'shift-down' : ''}`}>
                <div className="issuedBooks__navigation">
                    <div
                        className={visibleTable === 'active' ? 'isActive' : ''}
                        onClick={() => onToggleVisibleTable('active')}>
                        ???????????????? ????????????
                    </div>
                    |
                    <div
                        className={visibleTable === 'completed' ? 'isActive' : ''}
                        onClick={() => onToggleVisibleTable('completed')}>
                        ?????????????????????? ????????????
                    </div>
                </div>
                {table}
            </div>
        </div>
    )
}

export default OrderingBooksPage;