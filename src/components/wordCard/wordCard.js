import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Text, Modal, Portal } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as tts from 'expo-speech';
import * as wordDB from '../../utils/word';

const rightButton = ({word, isLearnd, isLiked}) => {
  /* this compenent should be rendered by father component */
  const heartoOnPress = () => {
    var handle = isLiked ? wordDB.deleteFavourite : wordDB.addFavourite;
    handle(word)
  }

  const bookOnPress = () => {
    wordDB.setLearned(word)
  }

  const unbookOnPress = () => {
    wordDB.unsetLearned(word)
  }

  return (
    <View style={styles.CardRightButton}>
    <View style={styles.rowContianer}>
      <AntDesign
        name="hearto"
        size={16}
        color={isLiked ? "red" : "black"}
        onPress={heartoOnPress}
        style={styles.rightIcon}
      />
      { !isLearnd && (
        <Feather
          name="book"
          size={16}
          color="black"
          onPress={bookOnPress}
          style={styles.rightIcon}
        />
      )}
      { isLearnd && (
        <Feather
          name="book-open"
          size={16}
          color="red"
          onPress={unbookOnPress}
          style={styles.rightIcon}
        />
      )}
      </View>
    </View>
  );
}

let uuid = 0;
export const WordCard = ({ word, isDark }) => {
  const [subDict, setSubDict] = React.useState();
  const [phonetic, setPhonetic] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isLearnd, setIsLearnd] = React.useState(false);
  const myuuid = uuid++;

  const playPhonetic = () => {
    try {
      tts.speak(word);
    } catch (error) {
      console.error(error);
    }
  }

  const getFavouriteItem = () => {
    wordDB.getFavouriteItem(word).then((item) => {
      if (item !== undefined) {
        setItem(item);
      }
    })
  }

  React.useEffect(() => {
    setIsLiked(item !== null);
    setIsLearnd(item !== null && item.learned !== 0);
  }, [item]);

  React.useEffect(() => {
    /* search word */
    wordDB.searchWord(word).then((results) => {
      setSubDict(results);
    }).catch((error) => {
      console.error(error);
      throw error;
    });

    /* this component will have multiple instance in the same time
     * since that we need to register with different context */
    wordDB.registerFavouriteListener(myuuid, getFavouriteItem);

    return () => {
      wordDB.unregisterFavouriteListener(myuuid);
    }
    /* get phonetic */
    /*
    wordDB.getPhonetic(word).then((phonetic) => {
      //setPhonetic(phonetic);
    }).catch((error) => {
      console.error(error);
      //throw error;
    });
    */
  }, []);

  return (
    <Card style={ { margin:10, }}>
      <Card.Title title={word} right={() => rightButton({word: word, isLearnd: isLearnd, isLiked: isLiked})} />
      <Card.Content style={styles.cardContext}>
          <View style={styles.phoneticContainer}>
            {phonetic && <Text>{phonetic.text}</Text>}
            <AntDesign
              name="sound"
              size={16}
              color="black"
              onPress={playPhonetic}
              style={styles.phoneticButton}
            />
          </View>
        {subDict && subDict[word] &&
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
        {(subDict === undefined || subDict[word] === undefined) &&
          <Text>Word not found</Text>
        }
      </Card.Content>
    </Card>
  );
}

export const WordItem = ({ item }) => {
  /* this component's father must listen the favourite event */
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  
  return (
    <View style={styles.cardItem} >
      <Portal>
        <Modal visible={visible} onDismiss={() => {setVisible(false)}} style={styles.modal} >
          <WordCard word={item.word} />
        </Modal>
      </Portal>

      <Card onPress={showModal}>
        <Card.Title title={item.word} subtitle={item.added_date} 
          right = {() =>
        rightButton({word: item.word, isLearnd: item.learned !== 0, isLiked: true})}/>
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
  cardItem: {
    marginTop: 5,
  },
  rowContianer: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightIcon: {
    margin: 15,
  },
});

