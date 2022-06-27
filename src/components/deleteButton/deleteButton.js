import React from "react";
import './deleteButton.scss';

const DeleteButton = ({onDeleteRow, id}) => (
    <div className='deleteButton' onClick={() => onDeleteRow(id)}>
        <div id='deleteButton_1'><div/></div>
        <div id='deleteButton_2'><div/></div>
    </div>
)

export default DeleteButton;