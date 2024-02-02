import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';

import * as wordDB from '../../utils/word';

export const WordCard = ({ word, isDark }) => {

  const [definition, setDefinition] = useState('');

  useEffect(() => {
    wordDB.searchWord(word).then((results) => {
      setDefinition(JSON.stringify(results));
    }).catch((error) => {
      setDefinition(JSON.stringify(error));
    });
  }, [word]);

  return (
    <View style={styles.container} >
      <Text >{word}</Text>
      <Text >{definition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 10,
  },
});

