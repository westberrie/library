import React from "react";
import './add-employees.scss';
import CustomInput from "../customInput/customInput";
const {ipcRenderer} = window.require('electron');

class AddEmployee extends React.Component {
    state = {
        employee: '',
        position: '',
        phoneNumber: '',
        wage: '',
        showWage: false
    }

    changeInput = ({target}) => {
        if (target.type === 'select-one' && target.name === 'position') {
            if (this.state.showWage) this.setState({showWage: false})
        } else if (target.name === 'position') {
            if (!this.state.showWage) this.setState({showWage: true})
        }

        this.setState({[target.name]: target.value});
    }

    submit = (e) => {
        e.preventDefault();

        const {employee, position, phoneNumber, wage} = this.state;
        let positionID;

        if (!parseInt(position)) positionID = ipcRenderer.sendSync('insert-position', position, wage);
        else positionID = position;

        ipcRenderer.send('insert-employee', employee, positionID, phoneNumber);

        e.target.reset();
        this.props.hide();
    }

    render() {
        const {showWage} = this.state

        return (
            <form onSubmit={this.submit} className='newIssuanceForm'>
                <div className='giveBook__inputsWrapper'>
                    <CustomInput name='employee' title='ФИО' func={this.changeInput}/>
                    <CustomInput name='position' title='Должность' func={this.changeInput} toggle/>
                    <CustomInput name='phoneNumber' title='Телефон' func={this.changeInput}/>
                    {showWage ? <CustomInput name='wage' title='Зарплата' func={this.changeInput}/> : null}
                </div>
                <div className="giveBook__buttonWrapper">
                    <button type='submit'>Сохранить</button>
                </div>
            </form>
        )
    }
}

export default AddEmployee;