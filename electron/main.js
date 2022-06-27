const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require ('path');
const fs = require('fs');
const url = require ('url');
const isDev = require('electron-is-dev');
const sqlite3 = require('sqlite3').verbose();
const Jimp = require("jimp");

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = [
        'REACT_DEVELOPER_TOOLS',
        'REDUX_DEVTOOLS',
        'DEVTRON'
    ]

    return Promise
        .all(extensions.map(name => installer.default(installer[name], forceDownload)))
        .catch(console.log)
}

const db = new sqlite3.Database(
    path.join(
        path.dirname(__dirname),
        isDev ? 'extraResources/database' : '../extraResources/database',
        'library.sqlite3'
    ),
    (err) => {
        if (err) dialog.showErrorBox('Database opening error: ', err.message);
    }
);

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 800,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            webSecurity: false
        }
    })

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(startUrl);

    mainWindow.webContents.openDevTools()
}

ipcMain.on('confirmation', (e, title) => {
    const options = {
        type: 'question',
        buttons: ['Нет', 'Да'],
        title: 'Удалить',
        normalizeAccessKeys: true,
        message: `Вы действительно хотите удалить книгу ${title}?`
    };

    e.returnValue = dialog.showMessageBoxSync(mainWindow, options);
});

ipcMain.on('get-options', (e) => {
    const appPath = app.getAppPath();

    e.returnValue = {isDev, appPath, db};
})

ipcMain.on('delete', (e, table, field, id) => {
    db.run(`DELETE FROM ${table} WHERE ${field} = ?`, id, function (err) {
        if (err) dialog.showErrorBox('Error with Database', err.message);
        else console.log(true);
    });
})

ipcMain.on('delete-img', (e, path) => {
    fs.unlink(path, (err) => {
        if (err) {
            dialog.showErrorBox('Deletion error', err.message);
        }
    });
})

ipcMain.on('get-all', (e, name, order='') => {
    db.all(`SELECT * FROM ${name} ${order}`,
        function (err, rows) {
            if (err) dialog.showErrorBox('Error with Database', err.message);
            e.returnValue = [...rows];
        })
})

ipcMain.on('get-id', (e, field, table, name) => {
    db.get(`SELECT ${field} FROM ${table} WHERE  name = ?`, name, function (err, row) {
            if (err) dialog.showErrorBox('Error with Database', err.message);
            e.returnValue = {...row};
        })
    // db.close();
})

ipcMain.on('get-book-id', (e, table, field, value) => {
    db.get(`SELECT book_id FROM ${table} WHERE  ${field} = ?`, value, function (err, row) {
        if (err) dialog.showErrorBox('Error with Database', err.message);
        e.returnValue = {...row};
    })
    // db.close();
})

ipcMain.on('get-book', (e, id) => {
    db.get("SELECT * FROM books_view WHERE  book_id = $id",
        {$id: id},
        function (err, row) {
            if (err) dialog.showErrorBox('Error with Database', err.message);
            e.returnValue = {...row};
        })
    // db.close();
})

ipcMain.on('insert-author', (e, author) => {

    db.run('INSERT INTO authors VALUES (NULL,?)', author, function (err) {
        if (err) dialog.showErrorBox('Error with Database', err.message);
        else e.returnValue = this.lastID;
    });
})

ipcMain.on('insert-genre', (e, genre) => {
    db.run('INSERT INTO genres VALUES (NULL,?)', genre, function (err) {
        if (err) dialog.showErrorBox('Error with Database', err.message);
        else e.returnValue = this.lastID;
    })
})

ipcMain.on('insert-publisher', (e, publisher) => {
    db.run('INSERT INTO publishers VALUES (NULL,?)', publisher, function (err) {
        if (err) dialog.showErrorBox('Error with Database', err.message);
        else e.returnValue = this.lastID;
    })
})

ipcMain.on('insert-book', (e, ...book) => {
    db.run('INSERT INTO books VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?)', ...book, function (err) {
            if (err) dialog.showErrorBox('Error with Database', err.message);
            else e.returnValue = this.lastID;
        }
    )
});

ipcMain.on('insert-reader', (e, name, passport, address, phoneNumber) => {

    db.run('INSERT INTO readers VALUES (NULL,?,?,?,?)', name, passport, address, phoneNumber, function (err) {
        if (err) dialog.showErrorBox('Error with Database', err.message);
    });
})

ipcMain.on('insert-emp-pub', (e, table, name, address, phoneNumber) => {

    db.run(`INSERT INTO ${table} VALUES (NULL,?,?,?)`, name, address, phoneNumber, function (err) {
        if (err) dialog.showErrorBox('Error with Database', err.message);
    });
})

ipcMain.on('insert-issued-book', (e, ...issuedBook) => {
    db.run('INSERT INTO issued_books VALUES (NULL,?,?,?,?,?,?)', ...issuedBook, function (err) {
            if (err) dialog.showErrorBox('Error with Database', err.message);
        }
    )
});

ipcMain.on('update-issued-book', (e, actualReturnDate, id) => {
    db.run('UPDATE issued_books SET actual_return_date = ? WHERE issue_id = ?', actualReturnDate, id, function (err) {
            if (err) dialog.showErrorBox('Error with Database', err.message);
        }
    )
});

ipcMain.on('insert-ordering-book', (e, ...orderingBook) => {
    db.run('INSERT INTO ordering_books VALUES (NULL,?,?,?,?,?,?)', ...orderingBook, function (err) {
            if (err) dialog.showErrorBox('Error with Database', err.message);
        }
    )
});

ipcMain.on('update-ordering-book', (e, delivery_date, id) => {
    db.run('UPDATE ordering_books SET delivery_date = ? WHERE ordering_id = ?', delivery_date, id, function (err) {
            if (err) dialog.showErrorBox('Error with Database', err.message);
        }
    )
});

ipcMain.on('set-count-book', (e, number, id) => {
    db.run('UPDATE books SET count = count + ? WHERE book_id = ?', number, id, function (err) {
            if (err) dialog.showErrorBox('Error with Database', err.message);
        }
    )
});

ipcMain.on('save-img', (event, imgPathIn, id, ext) => {
    const imgPathOut = path.join(path.dirname(__dirname), isDev ?
        'extraResources/images' :
        '../extraResources/images', `book_${id}.jpeg`);

    Jimp.read(imgPathIn, function (err, image) {
        if (err) {
            dialog.showErrorBox('Error saving cover', err.message);
            return;
        }

        image.background(0xFFFFFFFF, (err, val) => {
            image.write(imgPathOut);
        })
    });
})

app.whenReady().then(async () => {
    if (isDev && process.argv.indexOf('--noDevServer') === -1) {
        await installExtensions()
    }

    createWindow();

    app.on('activate', function () {

        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})