import React, {useEffect, useState} from "react";
import Table from "../../table/table";
import NewEmpPubForm from "../../new-emp-pub-form/new-emp-pub-form";
import {useShift, useSort} from "../../../hooks/hooks";

const {ipcRenderer} = window.require('electron');

const PublishersPage = () => {
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState(false);

    const {sortingOrder, onUpdateSortOption, onToggleSortingOrder} = useSort('name', 'ASC');
    const {shiftRight, shiftDown, shiftBlock} = useShift();

    useEffect(() => {
        let data = ipcRenderer.sendSync('get-all', 'publishers', `ORDER BY name ${sortingOrder}`);
        setData(data);
    }, [sortingOrder, update]);

    const deleteFromDB = (id) => {
        ipcRenderer.send('delete', 'publishers', 'publisher_id', id);
        setUpdate(update => !update);
    }

    const tableStyle = {'gridTemplateColumns': '26px 1fr 1fr 135px'};
    const tableTitles = ['Название', 'Адрес', 'Номер телефона'];


    return (
        <div className="employees">
            <div className="menu">
                <button className="menu__button">Убрать</button>
                <SortPanel/>
            </div>
            <div className={'employees__formWrapper shift-right'}>
                <NewEmpPubForm hide={shiftBlock}
                               setUpdate={() => setUpdate(update => !update)}
                               table="publishers"
                               nameFieldText="Название"/>
            </div>
            <div className={'employees__tableWrapper shift-down'}>
                <Table rows={data} titles={tableTitles} styles={tableStyle} onDeleteRow={deleteFromDB}/>
            </div>
        </div>
    )
}

const SortPanel = (props) => {
    const [sortingOrder, setSortingOrder] = useState('ASC');

    const onToggleSortingOrder = (value) => {
        setSortingOrder(value);
        props.onToggleSortingOrder(value);
    }


    return (
        <div className="sortPanel">
            <span
                className={`sortPanel__arrow ${sortingOrder === 'ASC' ? 'isActive' : ''}`}
                onClick={() => onToggleSortingOrder('ASC')}>
                        &#8593;
            </span>
            <span
                className={`sortPanel__arrow ${sortingOrder === 'DESC' ? 'isActive' : ''}`}
                onClick={() => onToggleSortingOrder('DESC')}>
                        &#8595;
            </span>
        </div>
    )
}

export default PublishersPage;