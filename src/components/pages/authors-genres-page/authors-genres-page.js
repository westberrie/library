import {useEffect, useState} from "react";
import './authors-genres-page.scss';

const {ipcRenderer} = window.require('electron');

const AuthorsGenresPage = () => {
    const [authorsLayout, setAuthorsLayout] = useState({names: [], biographies: []});
    const [genresLayout, setGenresLayout] = useState({names: [], descriptions: []});
    const [selectedAuthor, setSelectedAuthor] = useState(0);
    const [selectedGenre, setSelectedGenre] = useState(0);
    const [update, setUpdate] = useState(true);

    useEffect(() => {
        const authors = ipcRenderer.sendSync('get-all', 'authors', 'ORDER BY name');
        const genres = ipcRenderer.sendSync('get-all', 'genres', 'ORDER BY name');

        const authorsLayout = authors.reduce((acc, author, i) => {
            acc.names.push(
                <div
                    key={`${author['author_id']}+${author.name}`}
                    data-number={i}
                    onClick={onSelectAuthor}>
                    {author.name}
                </div>
            );
            acc.biographies.push(<div key={`${author['author_id']}+${i}`}>{author['biography']}</div>);
            return acc;
        }, {names: [], biographies: []});

        const genresLayout = genres.reduce((acc, genre, i) => {
            acc.names.push(
                <div key={`${genre['genre_id']}+${genre.name}`}
                     data-number={i}
                     onClick={onSelectGenre}>
                    {genre.name}
                </div>
            );
            acc.descriptions.push(<div key={`${genre['genre_id']}+${i}`}>{genre.description}</div>);
            return acc;
        }, {names: [], descriptions: []});

        setAuthorsLayout(authorsLayout);
        setGenresLayout(genresLayout);
    }, [update]);

    const onSelectAuthor = (e) => {
        setSelectedAuthor(+e.target.dataset['number']);
    }

    const onSelectGenre = (e) => {
        setSelectedGenre(+e.target.dataset['number']);
    }

    return (
        <div className="authorsGenres">
            <div className="authorsGenres__wrapper">
                <div className="authorsGenres__namesBlock">
                    <span>????????????:</span>
                    <div>
                        {authorsLayout.names}
                    </div>
                </div>
                <div className="authorsGenres__descrBlock">
                    <span>??????????????????:</span>
                    {authorsLayout.biographies[selectedAuthor]}
                </div>
                <form className="authorsGenres__newItemBlock">
                    <span>???????????????? ????????????:</span>
                    <input type="text" placeholder="?????? ????????????"/>
                    <textarea placeholder="??????????????????"/>
                    <button type="submit">??????????????????</button>
                </form>
            </div>
            <div className="authorsGenres__wrapper">
                <div className="authorsGenres__namesBlock">
                    <span>??????????:</span>
                    <div>
                        {genresLayout.names}
                    </div>
                </div>
                <div className="authorsGenres__descrBlock">
                    <span>????????????????:</span>
                    {genresLayout.descriptions[selectedGenre]}
                </div>
                <form className="authorsGenres__newItemBlock">
                    <span>???????????????? ????????:</span>
                    <input type="text" placeholder="???????????????? ??????????"/>
                    <textarea placeholder="????????????????"/>
                    <button type="submit">??????????????????</button>
                </form>
            </div>
        </div>
    )
}

export default AuthorsGenresPage;