import {NavLink} from "react-router-dom";
import './left-menu.scss';
import {useState} from "react";

const LeftMenu = () => {
    const [visibility, setVisibility] = useState(false);

    const changeVisibility = () => {
        setVisibility(visibility => !visibility);
    }

    const klass = visibility ? 'visible' : 'hidden';

    return (
        <>
            <div className={`leftMenu ${klass}`}>
                <ul>
                    <li>
                        <NavLink
                            onClick={changeVisibility}
                            style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})}
                            to='/main'>
                            ГЛАВНАЯ</NavLink>
                    </li>

                    <li>
                        <NavLink
                            onClick={changeVisibility}
                            style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})}
                            to='/employees'>
                            СОТРУДНИКИ</NavLink>
                    </li>

                    <li>
                        <NavLink
                            onClick={changeVisibility}
                            style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})}
                            to='/authorsGenres'>
                            АВТОРЫ И ЖАНРЫ</NavLink>
                    </li>

                    <li>
                        <NavLink
                            onClick={changeVisibility}
                            style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})}
                            to='/publishers'>
                            ИЗДАТЕЛЬСТВА</NavLink>
                    </li>
                </ul>

                <div className={`leftMenu__button ${visibility ? "squeeze" : ""}`} onClick={changeVisibility}>
                    <span id="m">М</span>
                    <span id="e">Е</span>
                    <span id="n">Н</span>
                    <span id="u">Ю</span>
                </div>
            </div>

            <div className={`leftMenu__background ${klass}`} onClick={changeVisibility}/>
        </>
    )
}

export default LeftMenu;