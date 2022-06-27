import {useState} from "react";
import './sort-panel.scss';

const SortPanel = ({onUpdateSortOption, onToggleSortingOrder, initialSortOption, initialSortingOrder, options, onlySortingOrder}) => {
    const [sortOption, setSortOption] = useState(initialSortOption);
    const [sortingOrder, setSortingOrder] = useState(initialSortingOrder);

    const onUpdateSortOptionLocal = (e) => {
        const sortOptions = e.target.value;
        setSortOption(sortOptions);
        onUpdateSortOption(sortOptions);
    }

    const onToggleSortingOrderLocal = (value) => {
        setSortingOrder(value);
        onToggleSortingOrder(value);
    }

    const layout = onlySortingOrder ? null : <>
        <span>Сортировать по:</span>
        <select value={sortOption} onChange={onUpdateSortOptionLocal}>
            {Object.entries(options).map(item => (
                <option key={item[0] + "-" + item[1]}  value={item[0]}>{item[1]}</option>
            ))}
        </select>
    </>

    return (
        <div className="sortPanel">
            {layout}
            <span
                className={`sortPanel__arrow ${sortingOrder === 'ASC' ? 'isActive' : ''}`}
                onClick={() => onToggleSortingOrderLocal('ASC')}>
                        &#8593;
            </span>
            <span
                className={`sortPanel__arrow ${sortingOrder === 'DESC' ? 'isActive' : ''}`}
                onClick={() => onToggleSortingOrderLocal('DESC')}>
                        &#8595;
            </span>
        </div>
    )
}

export default SortPanel;