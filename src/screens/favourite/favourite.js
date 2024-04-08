import React from 'react';
import { View, FlatList, TextInput} from 'react-native';
import { Button, Card, Text, PaperProvider } from 'react-native-paper';
import * as wordDB from '../../utils/word';
import { WordItem } from '../../components/wordCard/wordCard';
import { normalStyles, darkStyles } from '../../utils/style';

export const Favourite = () => {
  const [favouriteList, setFavouriteList] = React.useState([]);
  const [filterText, setFilterText] = React.useState('');
  const [filterList, setFilterList] = React.useState([]);

  let styles = normalStyles;

  const favouriteListener = (results) => {
    console.log('Favourite listener', results.map((x) => x.word));
    setFavouriteList(results);
  };

  React.useEffect(() => {
    wordDB.registerFavouriteListener("favouriteScreen", favouriteListener);

    return () => {
      wordDB.unregisterFavouriteListener("favouriteScreen");
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
        style={styles.filter}
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

