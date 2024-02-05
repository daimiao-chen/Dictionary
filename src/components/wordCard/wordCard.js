import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Text, Modal, Portal } from 'react-native-paper';

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

export const WordItem = ({ item }) => {
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  
  return (
    <View>
      <Portal>
        <Modal visible={visible} onDismiss={() => {setVisible(false)}}>
          <WordCard word={item.word} />
        </Modal>
      </Portal>

      <Card onPress={showModal}>
        <Card.Title title={item.word} subtitle={item.added_date} />
      </Card>
    </View>
  );
}

