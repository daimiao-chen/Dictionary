import React from 'react';
import { View } from 'react-native';
import { PaperProvider, Button, Portal, Modal} from 'react-native-paper';
import { StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native';
import { WordCard } from '../../components/wordCard/wordCard';
import { AntDesign } from '@expo/vector-icons';

import * as wordDB from '../../utils/word';

export const Home = () => {
  const [displayWord, setDisplayWord] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [daliyWord, setDailyWord] = React.useState('');
  const search = () => {
    if (searchText === '') {
      return;
    }
    /* make first letter capital,
     * the rest lower case
     * and remove white spaces */
    setSearchText(searchText.charAt(0).toUpperCase() 
      + searchText.slice(1).toLowerCase().trim());
    setDisplayWord(true);
  };

  React.useEffect(() => {
    /* if you want random a word, please follow this code */
    wordDB.pickRandomWord().then((word) => {
      console.log(word);
      setDailyWord(word.word);
    })
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.searchComponent}>
          <TextInput
            style={styles.inputText}
            placeholder = "Type here to check!"
            value={searchText}
            onChangeText={text => setSearchText(text)}
            />
          <AntDesign
            name="search1"
            color= {searchText === '' ? "gray" : "blue"}
            onPress={search}
            style={styles.searchButton}
          />
        </View>
        <Portal>
            <Modal visible={displayWord} onDismiss={() => setDisplayWord(false)}>
              <WordCard word={searchText} />
            </Modal>
        </Portal>
      </View>
      <View>
        <Text>Daily Word</Text>
        <WordCard word={daliyWord} />
      </View>
    </PaperProvider>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchComponent: {
    flexDirection: 'row',
  },
  inputText: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  searchButton: {
    margin: 10,
    fontSize: 40,
  },

});
