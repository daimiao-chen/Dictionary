import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

let initializedCallback = [];
let db = null;

const executeSql = (sql, params) => {
  let promise = new Promise((resolve, reject) => {
    if (db === null) {
      reject(new Error("Database not initialized"));
    }
    if (db.transaction === undefined) {
      reject(new Error("Database not initialized (transaction)"));
    }
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (tx, results) => {
          resolve(results);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}


async function initializeDatabase()
{
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    console.log('making directory');
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
    await FileSystem.downloadAsync(
      Asset.fromModule(require('../../assets/Dictionary.db')).uri,
      FileSystem.documentDirectory + 'SQLite/Dictionary.db'
    );
  } else {
    console.log('directory exists');
  }

  let ldb = SQLite.openDatabase('Dictionary.db');
  db = ldb;

  /* create word_list with
   * word: string, cannot be null
   * learned: boolean, default false
   * added date: date, default current date
   * test times: int, default 0
   * last test date: date, default null
   * id: int (primary key), auto increment
   * word: foreign key from entries word
   */
  try {
    await executeSql(
      'CREATE TABLE IF NOT EXISTS word_list (word TEXT NOT NULL, learned BOOLEAN DEFAULT 0, added_date DATE DEFAULT CURRENT_DATE, test_times INT DEFAULT 0, last_test_date DATE, id INTEGER PRIMARY KEY AUTOINCREMENT, FOREIGN KEY (word) REFERENCES entries(word))',
      []
    );
  } catch (e) {
    console.error(e);
  }

  for (x of initializedCallback) {
    x();
  }
}

export const closeDBandDelete = () => {
  db._db.close();
  db = null;
  FileSystem.deleteAsync(FileSystem.documentDirectory + 'SQLite');
}

initializeDatabase();

export const checkInitialized = () => {
  let promise = new Promise((resolve, reject) => {
    if (db !== null) {
      resolve();
    } else {
      initializedCallback.push(resolve);
    }
  });
  return promise;
}

export const searchWord = (word) => {
  return executeSql('SELECT * FROM entries WHERE word = ?', [word])
    .then(results => genWordObjsFromDatabase(results));
}

export const pickRandomWord = () => {
    let index = Math.floor(Math.random() * (MAX_WORD_INDEX + 1));
    return executeSql('SELECT * FROM entries WHERE id = ?', [index])
      .then(results => {
        return results.rows._array[0];
      });
}

const genWordObjsFromDatabase = (databaseResults) => {
  let subDict =  {}

  for (x of databaseResults.rows._array) {
    let word = x.word;
    let definition = { type: x.wordtype, definition: x.definition };

    if (word in subDict) {
      subDict[word].definitions.push(definition);
    } else {
      subDict[word] = { word: word, definitions: [definition] };
    }
  }

  return subDict;
}

let favouriteListeners = [];

const pushFavouriteChangeed = () => {
  executeSql('SELECT * FROM word_list', [])
    .then(results => {
      for (x of favouriteListeners) {
        x(results.rows._array);
      }
    });


}

/* Don't call addFavourite and deleteFavourite in callback */
export const registerFavouriteListener = (callback) => {
  /* register callback into the list */
  favouriteListeners.push(callback);

  /* call pushFavouriteChangeed onece */
  pushFavouriteChangeed();

}

export const addFavourite = (word) => {
  /* add word into favourite list */
  return executeSql('INSERT INTO word_list (word) VALUES (?)', [word])
    .then(() => {
      /* call pushFavouriteChangeed */
      pushFavouriteChangeed();
    })
    .catch(error => {
      console.error('Error adding word to favourites:', error);
      throw error;
    });
}

export const deleteFavourite = (word) => {
  /* delete word from favourite list */
  executeSql('DELETE FROM word_list WHERE word = ?', [word])

  /* call pushFavouriteChangeed */
  pushFavouriteChangeed();
}

export const MAX_WORD_INDEX = 176023

