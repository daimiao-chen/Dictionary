import React from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { Button, Card, Text, PaperProvider } from 'react-native-paper';
import * as wordDB from '../../utils/word';
import { WordItem } from '../../components/wordCard/wordCard';

export const Favourite = () => {
  const [favouriteList, setFavouriteList] = React.useState([]);
  const [filterText, setFilterText] = React.useState('');
  const [filterList, setFilterList] = React.useState([]);

  const favouriteListener = (results) => {
    console.log('Favourite listener', results.map((x) => x.word));
    setFavouriteList(results);
  };

  React.useEffect(() => {
    wordDB.registerFavouriteListener(favouriteListener);

    return () => {
      wordDB.unregisterFavouriteListener(favouriteListener);
    };
  }, []);

  React.useEffect(() => {
    list = favouriteList.filter((item) => {
      return item.word.toLowerCase().includes(filterText.toLowerCase());
    });
    setFilterList(list);
  }, [filterText]);

  const buttonListener = () => {
    wordDB.pickRandomWord()
      .then(result => {
        wordDB.addFavourite(result.word);
      });
  };

  return (
    <PaperProvider>
      <TextInput
        placeholder="Fliter"
        style={styles.Filter}
        value={filterText}
        onChangeText={setFilterText}
        />
      {filterText === '' && (
        <FlatList
          data={favouriteList}
          renderItem={({ item }) => <WordItem item={item} />}
          keyExtractor={(item) => item.id.toString()} 
        />
      )}
      {filterText !== '' && (
        <FlatList
          data={filterList}
          renderItem={({ item }) => <WordItem item={item} />}
          keyExtractor={(item) => item.id.toString()} 
        />
      )}
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  Filter: {
    height: 40,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
});

