import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Text, Modal, Portal } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

import * as wordDB from '../../utils/word';

export const WordCard = ({ word, isDark }) => {

  const [subDict, setSubDict] = React.useState();
  const [isLiked, setIsLiked] = React.useState(false);

  const heartoOnPress = () => {
    var handle = isLiked ? wordDB.deleteFavourite : wordDB.addFavourite;
    handle(word).then(() => {
      setIsLiked(!isLiked);
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  }

  const rightButton = (props) => (
    <AntDesign
      name="hearto"
      size={16}
      color={isLiked ? "red" : "black"}
      onPress={heartoOnPress}
      style={styles.CardRightButton}
    />
  );

  React.useEffect(() => {
    wordDB.searchWord(word).then((results) => {
      setSubDict(results);
    }).catch((error) => {
      console.error(error);
      throw error;
    });
    wordDB.isFavourite(word).then((isFavourite) => {
      setIsLiked(isFavourite);
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  }, [word]);

  return (
    <Card>
      <Card.Title title={word} right={rightButton} />
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

const styles = StyleSheet.create({
  CardRightButton: {
    marginRight: 32,
  },
});

