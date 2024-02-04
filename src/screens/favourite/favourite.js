import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import * as wordDB from '../../utils/word';

export const Favourite = () => {
  const [favouriteList, setFavouriteList] = React.useState(null);

  const favouriteListener = (results) => {
    console.log(results);
    setFavouriteList(results);
  }

  React.useEffect(() => {
    wordDB.registerFavouriteListener(favouriteListener);
  }, []);


  const buttonListener = () => {
    wordDB.pickRandomWord()
      .then(results => {
        wordDB.addFavourite(results.word);
      });
  }



  return (
    <View>
      <Text>Favourite</Text>
      <Button onPress={()=>buttonListener()} >Random add a word</Button>
    </View>
  );
}
