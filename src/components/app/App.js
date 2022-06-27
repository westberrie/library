import {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";

import EmpPubPage from "../pages/emp-pub-page/emp-pub-page";
import LeftMenu from "../left-menu/left-menu";
import MainPage from "../pages/main-page/main-page";
import AuthorsGenresPage from "../pages/authors-genres-page/authors-genres-page";
import PublishersPage from "../pages/publishers-page/publishers-page";

function App() {
    const history = useNavigate();

    useEffect(() => {
        history('/main/books');
    }, []);

    return (
        <div className="app">
            <LeftMenu/>
            <Routes>
                <Route path="/main/*" element={<MainPage/>}/>
                <Route path='/employees' element={<EmpPubPage
                    tableName="employees"
                    idFieldName="employee_id"
                    nameFieldText="ФИО"/>}/>
                <Route path='/publishers' element={<EmpPubPage
                    tableName="publishers"
                    idFieldName="publisher_id"
                    nameFieldText="Название"/>}/>
                <Route path='/authorsGenres' element={<AuthorsGenresPage/>}/>
            </Routes>
        </div>
    );

}

export default App;
