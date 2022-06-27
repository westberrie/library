import React, {useEffect, useState} from "react";
import Table from "../../table/table";
import {useShift, useSort} from "../../../hooks/hooks";
import SortPanel from "../../sort-panel/sort-panel";
import './emp-pub-page.scss';
import NewEmpPubForm from "../../new-emp-pub-form/new-emp-pub-form";

const {ipcRenderer} = window.require('electron');

const EmpPubPage = ({tableName, idFieldName, nameFieldText}) => {
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState(false);

    const {sortingOrder, onUpdateSortOption, onToggleSortingOrder} = useSort('name', 'ASC');
    const {shiftRight, shiftDown, shiftBlock} = useShift();

    useEffect(() => {
        const data = ipcRenderer.sendSync('get-all', tableName, `ORDER BY name ${sortingOrder}`);
        setData(data);
    }, [sortingOrder, update, tableName]);

    const deleteFromDB = (id) => {
        ipcRenderer.send('delete', tableName, idFieldName, id);
        setUpdate(update => !update);
    }

    const tableStyle = {'gridTemplateColumns': '26px 1fr 1fr 135px'};
    const tableTitles = [nameFieldText, 'Адрес', 'Номер телефона'];

    return (
        <div className="empPubPage">
            <div className="menu">
                <button className="menu__button"
                        onClick={shiftBlock}>{!shiftRight ? 'Добавить' : 'Убрать'}</button>
                <SortPanel
                    onUpdateSortOption={onUpdateSortOption}
                    onToggleSortingOrder={onToggleSortingOrder}
                    initialSortOption="name"
                    initialSortingOrder="ASC"
                    onlySortingOrder/>
            </div>
            <div className={`empPubPage__formWrapper ${shiftRight ? 'shift-right' : ''}`}>
                <NewEmpPubForm hide={shiftBlock}
                               setUpdate={() => setUpdate(update => !update)}
                               table={tableName}
                               nameFieldText={nameFieldText}/>
            </div>
            <div className={`empPubPage__tableWrapper ${shiftDown ? 'shift-down' : ''}`}>
                <Table rows={data} titles={tableTitles} styles={tableStyle} onDeleteRow={deleteFromDB}/>
            </div>
        </div>
    );
}

export default EmpPubPage;
