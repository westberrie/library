import {useState} from "react";

export const useShift = () => {
    const [shiftRight, setShiftRight] = useState(false);
    const [shiftDown, setShiftDown] = useState(false);

    const shiftBlock = () => {
        if (!shiftRight) {
            setShiftDown(shiftDown => !shiftDown);
            setTimeout(() => {
                setShiftRight(shiftRight => !shiftRight);
            }, 300)
        } else {
            setShiftRight(shiftRight => !shiftRight);
            setTimeout(() => {
                setShiftDown(shiftDown => !shiftDown);
            }, 500)
        }
    }

    return {shiftRight, shiftDown, shiftBlock};
}

export const useSort = (initialSortOption, initialSortingOrder) => {
    const [sortOption, setSortOption] = useState(initialSortOption);
    const [sortingOrder, setSortingOrder] = useState(initialSortingOrder);

    const onUpdateSortOption = (value) => {
        setSortOption(value);
    }

    const onToggleSortingOrder = (value) => {
        setSortingOrder(value);
    }

    return {sortOption, sortingOrder, onUpdateSortOption, onToggleSortingOrder}
}

export const useSearch = (initialValue, array) => {
    const [searchOptions, setSearchOptions] = useState(initialValue);
    const [term, setTerm] = useState('');

    const search = () => {
        if (term.length === 0) return array;

        return array.filter(item => {
            return item[searchOptions].toLowerCase().indexOf(term) > -1;
        });
    }

    const onUpdateSearchOption = (searchOption) => {
        setSearchOptions(searchOption);
    }

    const onUpdateTerm = (term) => {
        setTerm(term);
    }

    const visibleData = search();

    return {visibleData, onUpdateSearchOption, onUpdateTerm}
}