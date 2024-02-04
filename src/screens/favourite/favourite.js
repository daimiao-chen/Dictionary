import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import * as wordDB from '../../utils/word';

const Favourite = () => {
  const [favouriteList, setFavouriteList] = useState([]);

  const loadFavouriteList = () => {
    wordDB.registerFavouriteListener(favouriteListener);
  };

  const favouriteListener = (results) => {
    setFavouriteList(results);
  };

  useEffect(() => {
    loadFavouriteList();
  }, []);

  const buttonListener = () => {
    wordDB.pickRandomWord()
      .then(results => {
        wordDB.addFavourite(results.word)
          .then(() => loadFavouriteList());
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