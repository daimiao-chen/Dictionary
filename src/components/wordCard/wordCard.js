import React from 'react';
import { View, FlatList} from 'react-native';
import { Button, Card, Text, Modal, Portal } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as tts from 'expo-speech';
import * as wordDB from '../../utils/word';
import { normalStyles, darkStyles } from '../../utils/style';

const rightButton = ({word, isLearnd, isLiked}) => {
  var styles = normalStyles;
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
    <View style={{marginRight: 32}}>
    <View style={styles.containerRow}>
      <AntDesign
        name="hearto"
        size={16}
        color={isLiked ? "red" : "black"}
        onPress={heartoOnPress}
        style={{margin: 15}}
      />
      { !isLearnd && (
        <Feather
          name="book"
          size={16}
          color="black"
          onPress={bookOnPress}
          style={{margin: 15}}
        />
      )}
      { isLearnd && (
        <Feather
          name="book-open"
          size={16}
          color="red"
          onPress={unbookOnPress}
          style={{margin: 15}}
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
  var styles = normalStyles;
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
      console.log('unregister listener');
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
  }, [word]);

  return (
    <Card style={ { margin:10, }}>
      <Card.Title title={word} right={() => rightButton({word: word, isLearnd: isLearnd, isLiked: isLiked})} />
      <Card.Content style={{height: 400}}>
          <View style={styles.containerRow}>
            {phonetic && <Text>{phonetic.text}</Text>}
            <AntDesign
              name="sound"
              size={16}
              color="black"
              onPress={playPhonetic}
              style={{marginLeft: 10}}
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
    <View style={{marginTop: 5}} >
      <Portal>
        <Modal visible={visible} onDismiss={() => {setVisible(false)}} style={{margin: 20}} >
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

