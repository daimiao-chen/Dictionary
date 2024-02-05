import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import * as wordDB from '../../utils/word';

export const Favourite = () => {
  const [favouriteList, setFavouriteList] = React.useState([]);

  const favouriteListener = (results) => {
    console.log('Favourite listener', results);
    setFavouriteList(results);
  };

  React.useEffect(() => {
    wordDB.registerFavouriteListener(favouriteListener);
  }, []);

  const buttonListener = () => {
    wordDB.pickRandomWord()
      .then(result => {
        wordDB.addFavourite(result.word);
      });
  };

  const renderListItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.word}</Text>
      <Text>ID: {item.id}</Text>
      <Text>Learned: {item.learned ? 'Yes' : 'No'}</Text>
      <Text>Test Times: {item.test_times}</Text>
      <Text>Last Test Date: {item.last_test_date || 'Not tested yet'}</Text>
      <Text>Added Date: {item.added_date} (yyyy-mm-dd)</Text>
    </View>
  );

  return (
    <View>
      <Text>List of my favourite words.</Text>
      <Button onPress={buttonListener}>Random adding(test)</Button>
      <FlatList
        data={favouriteList}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id.toString()} 
      />
    </View>
  );
};
export default Favourite;
