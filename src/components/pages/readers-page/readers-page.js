import React, {useEffect, useState} from "react";
import './readers-page.scss'
import Table from "../../table/table";
import NewReaderForm from "../../new-reader-form/new-reader-form";
import {useSearch, useShift, useSort} from "../../../hooks/hooks";
import SortPanel from "../../sort-panel/sort-panel";
import SearchPanel from "../../search-panel/search-panel";

const {ipcRenderer} = window.require('electron');

const ReadersPage = () => {
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState(false);

    const {visibleData, onUpdateSearchOption, onUpdateTerm} = useSearch('name', data);
    const {sortingOrder, onUpdateSortOption, onToggleSortingOrder} = useSort('name', 'ASC');
    const {shiftRight, shiftDown, shiftBlock} = useShift();

    useEffect(() => {
        const data = ipcRenderer.sendSync('get-all', 'readers', `ORDER BY name ${sortingOrder}`);
        setData(data);
    }, [sortingOrder, update]);

    const deleteFromDB = (id) => {
        ipcRenderer.send('delete', 'readers', 'reader_id', id);
        setUpdate(update => !update);
    }

    const tableStyle = {'gridTemplateColumns': '26px 1fr 135px 1fr 135px'};
    const tableTitles = ['ФИО','Номер паспорта', 'Адрес', 'Номер телефона'];

    const optionsForSearch = {
        name: 'имени',
        passport: 'паспорту'
    }

    return (
        <div className='readers'>
            <div className="menu">
                <button className="menu__button" onClick={shiftBlock}>{!shiftRight ? 'Добавить читателя' : 'Убрать'}</button>
                <SearchPanel
                    onUpdateSearch={onUpdateTerm}
                    onUpdateSearchOption={onUpdateSearchOption}
                    initialSearchOption="name"
                    placeholder="Найти запись"
                    options={optionsForSearch}/>
                <SortPanel
                    onUpdateSortOption={onUpdateSortOption}
                    onToggleSortingOrder={onToggleSortingOrder}
                    initialSortOption="name"
                    initialSortingOrder="ASC"
                    onlySortingOrder/>

            </div>
            <div className={`readers__formWrapper ${shiftRight ? 'shift-right' : ''}`}>
                <NewReaderForm hide={shiftBlock}
                           setUpdate={() => setUpdate(update => !update)}/>
            </div>
            <div className={`readers__tableWrapper ${shiftDown ? 'shift-down' : ''}`}>
                <Table rows={visibleData} titles={tableTitles} styles={tableStyle} onDeleteRow={deleteFromDB}/>
            </div>
        </div>
    );
}

export default ReadersPage;