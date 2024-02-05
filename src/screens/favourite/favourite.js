import React from 'react';
import { View, FlatList } from 'react-native';
import { Button, Card, Text, PaperProvider } from 'react-native-paper';
import * as wordDB from '../../utils/word';
import { WordItem } from '../../components/wordCard/wordCard';

export const Favourite = () => {
  const [favouriteList, setFavouriteList] = React.useState([]);

  const favouriteListener = (results) => {
    console.log('Favourite listener', results);
    setFavouriteList(results);
  };

  React.useEffect(() => {
    wordDB.registerFavouriteListener(favouriteListener);

    return () => {
      wordDB.unregisterFavouriteListener(favouriteListener);
    };
  }, []);

  const buttonListener = () => {
    wordDB.pickRandomWord()
      .then(result => {
        wordDB.addFavourite(result.word);
      });
  };

  return (
    <PaperProvider>
      <Button onPress={buttonListener}>Random adding(test)</Button>
      <FlatList
        data={favouriteList}
        renderItem={({ item }) => <WordItem item={item} />}
        keyExtractor={(item) => item.id.toString()} 
      />
    </PaperProvider>
  );
};

