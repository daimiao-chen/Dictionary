import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

let initializedCallback = [];
let db = null;

async function initializeDatabase()
{
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require('../../assets/Dictionary.db')).uri,
    FileSystem.documentDirectory + 'SQLite/Dictionary.db'
  );
  let ldb = SQLite.openDatabase('Dictionary.db');
  db = ldb;
}

async function initializeWord()
{
  await initializeDatabase();
  for (x of initializedCallback) {
    x();
  }
}

initializeWord();

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
  let promise = new Promise((resolve, reject) => {
    if (db === null) {
      reject(new Error("Database not initialized"));
    }
    if (db.transaction === undefined) {
      reject(new Error("Database not initialized (transaction)"));
    }
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM entries WHERE word = ?',
        [word],
        (tx, results) => {
          resolve(genWordObjsFromDatabase(results));
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
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
