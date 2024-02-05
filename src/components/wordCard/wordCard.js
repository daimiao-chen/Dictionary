import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Text, Modal, Portal } from 'react-native-paper';

import * as wordDB from '../../utils/word';

export const WordCard = ({ word, isDark }) => {

  const [subDict, setSubDict] = React.useState();

  React.useEffect(() => {
    wordDB.searchWord(word).then((results) => {
      setSubDict(results);
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  }, [word]);

  return (
    <Card>
      <Card.Title title={word} />
      <Card.Content>
        {subDict && 
          <FlatList
            data={subDict[word].definitions}
            renderItem={({ item }) => {
              /* replace the \r\n with '' */
              const definition = item.definition.replace(/\n/g, '');
              return (
              <View>
                <Text>{item.type}</Text>
                <Text>{definition}</Text>
              </View>
            )}}
            keyExtractor={(item, index) => index.toString()}
          />
        }
      </Card.Content>
    </Card>
  );
}

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

