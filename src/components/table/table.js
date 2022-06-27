import React, {useState} from "react";
import './table.scss';
// import TableRow from "../tableRow/tableRow";
import DeleteButton from "../deleteButton/deleteButton";
import {Link} from "react-router-dom";

class Table extends React.Component {


    render() {
        const {rows, titles, colored, onDeleteRow, styles, selectReader} = this.props;
        let counter = 0;

        const tableTitles = titles.map(title => (
            <span key={title}>{title}</span>
        ))

        const tableRows = rows.map(row => {
            row = Object.values(row);
            return <TableRow
                isEven={counter++ % 2 === 0}
                key={row[0]}
                id={row[0]}
                data={row.slice(1)}
                colored={colored}
                styles={styles}
                onDeleteRow={onDeleteRow}
                selectReader={selectReader}/>
        })

        return (
            <div className='table'>
                <div className='table__head' style={{...styles}}>
                    <div/>
                    {tableTitles}
                </div>
                {tableRows}
            </div>
        );
    }
}

const TableRow = ({id ,data, isEven, colored, onDeleteRow, styles, selectReader}) => {
    const [hide, setHide] = useState(false);

    const fade = (id) => {
        setHide(true)
        setTimeout(() => {
            onDeleteRow(id);
        }, 500)
    }

    return (
        <div className={`tableRow ${isEven ? 'even' : ''} ${hide ? 'hide' : ''}`} style={{...styles}}>
            <DeleteButton onDeleteRow={fade} id={id}/>
            {data.map((text, i) => {
                return <span className={colored && i === data.length - 1 ? 'red' : ''} key={i+id+text}>{text}</span>
            })}
            {selectReader ? <Link to={`/reader-${id}`} className='readers__select'>⇒</Link> : null}
        </div>
    )
}

export default Table;