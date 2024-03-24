import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';

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
    console.log('making database');
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
    await FileSystem.downloadAsync(
      Asset.fromModule(require('../../assets/Dictionary.db')).uri,
      FileSystem.documentDirectory + 'SQLite/Dictionary.db'
    );
  } else {
    console.log('database exists');
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

  /* the amount of word_list */
  executeSql('SELECT COUNT(*) FROM word_list', []).then(results => {
    console.log('word_list count:', results.rows._array[0]['COUNT(*)']);
  });

  /*
  executeSql('Count * FROM entries', []).then(results => {
    console.log('entries count:', results.rows._array.length);
  });
  */

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

export 

const genWordObjsFromDatabase = (databaseResults) => {
  let subDict =  {}

  /* filter the dummy entries */
  const definitions = databaseResults.rows._array
    .filter(x => x.wordtype.length > 0 && x.definition.length > 0)
    .map(x => {
      /* replace the \r\n with '' */
      x.definition = x.definition.replace(/\n/g, '');
      return x;
    });

  for (x of definitions) {
    let word = x.word;
    let definition = { type: x.wordtype, definition: x.definition };
    if (subDict[word] === undefined) {
      subDict[word] = { definitions: [definition] };
    } else {
      subDict[word].definitions.push(definition);
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

export const unregisterFavouriteListener = (callback) => {
  /* remove callback from the list */
  favouriteListeners = favouriteListeners.filter(x => x !== callback);
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
  return executeSql('DELETE FROM word_list WHERE word = ?', [word])
    .then(() => {
      /* call pushFavouriteChangeed */
      pushFavouriteChangeed();
    })
    .catch(error => {
      console.error('Error deleting word from favourites:', error);
      throw error;
    });
}

export const isFavourite = (word) => {
  return executeSql('SELECT * FROM word_list WHERE word = ?', [word])
    .then(results => {
      return results.rows._array.length > 0;
    });
}

export const MAX_WORD_INDEX = 176023

const URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
export const getPhonetic = (word) => {
  return fetch(URL + word)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(json => {
      const phoneticsWithAudio = json[0].phonetics.filter(x => x.audio !== undefined && x.audio.length > 0);
      return phoneticsWithAudio.length > 0 ? phoneticsWithAudio[0] : null;
    })
    .then(phonetic => {
      if (phonetic !== null) {
        console.log(`${phonetic.text} ${phonetic.audio}`);
        return Audio.Sound.createAsync({ uri: phonetic.audio })
          .then((sound) => {
            console.log("success create sound");
            phonetic.player = sound
            return phonetic;
          })
      } else {
        return null;
      }
    })
    .catch(error => {
      console.error('Error fetching phonetic:', error);
      throw error;
    });
}

export const getTestList = () => {
  return executeSql('SELECT * FROM word_list WHERE learned = 0', [])
    .then(results => {
      return results.rows._array;
    });
}

export const setLearned = (word) => {
  console.log('setLearned:', word);
  return executeSql('UPDATE word_list SET learned = 1 WHERE word = ?', [word])
    .then(() => {
      pushFavouriteChangeed();
    });
}

export const unsetLearned = (word) => {
  return executeSql('UPDATE word_list SET learned = 0 WHERE word = ?', [word])
    .then(() => {
      pushFavouriteChangeed();
    });
}

export const isLearned = (word) => {
  return executeSql('SELECT * FROM word_list WHERE word = ? AND learned = 1', [word])
    .then(results => {
      return results.rows._array.length > 0;
    });
}

