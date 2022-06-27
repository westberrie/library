import {NavLink} from "react-router-dom";
import './app-header.scss';

const AppHeader = () => (
    <header className="app__header">
        <nav className="app__navigation">
            <ul>
                <li>
                    <NavLink
                        style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})}
                        to='books'>
                        КАТАЛОГ КНИГ</NavLink>
                </li>
                <li>
                    <NavLink
                        style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})}
                        to='issued-books'>
                        ВЫДАЧА КНИГ</NavLink>
                </li>
                <li>
                    <NavLink
                        style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})}
                        to='ordering-books'>
                        ЗАКАЗ КНИГ</NavLink>
                </li>
                <li>
                    <NavLink
                        style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})}
                        to='readers'>
                        ЧИТАТЕЛИ</NavLink>
                </li>
            </ul>
        </nav>
    </header>
)

export default AppHeader;