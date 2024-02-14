import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Text, Modal, Portal } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as wordDB from '../../utils/word';

export const WordCard = ({ word, isDark }) => {

  const [subDict, setSubDict] = React.useState();
  const [isLiked, setIsLiked] = React.useState(false);
  const [phonetic, setPhonetic] = React.useState(null);

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

  const playPhonetic = () => {
    if (!phonetic) {
      console.error("phonetic is not available");
      return;
    }
    /* TODO: refactor this workaround */
    phonetic.player.sound.playAsync().then(() => {
      /* repeat play */
      phonetic.player.sound.replayAsync().then(() => {
        console.log("success replay sound");
      });
    });
  }

  React.useEffect(() => {
    /* search word */
    wordDB.searchWord(word).then((results) => {
      setSubDict(results);
    }).catch((error) => {
      console.error(error);
      throw error;
    });
    /* check if word is favourite */
    wordDB.isFavourite(word).then((isFavourite) => {
      setIsLiked(isFavourite);
    }).catch((error) => {
      console.error(error);
      throw error;
    });
    /* get phonetic */
    wordDB.getPhonetic(word).then((phonetic) => {
      setPhonetic(phonetic);
    }).catch((error) => {
      console.error(error);
      //throw error;
    });
  }, [word]);

  return (
    <Card>
      <Card.Title title={word} right={rightButton} />
      <Card.Content style={styles.cardContext}>
        {phonetic && (
          <View style={styles.phoneticContainer}>
            <Text>{phonetic.text}</Text>
            <AntDesign
              name="sound"
              size={16}
              color="black"
              onPress={playPhonetic}
              style={styles.phoneticButton}
            />
          </View>
        )}
        {subDict && 
          <FlatList
            data={subDict[word].definitions}
            renderItem={({ item }) => (
              <View>
                <Text>{item.type}</Text>
                <Text>{item.definition}</Text>
              </View>
            )}
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
        <Modal visible={visible} onDismiss={() => {setVisible(false)}} style={styles.modal} >
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
  modal: {
    margin: 20,
  },
  cardContext: {
    height: 400,
  },
  phoneticContainer: {
    flexDirection: 'row',
  },
  phoneticButton: {
    marginLeft: 10,
  },
});

