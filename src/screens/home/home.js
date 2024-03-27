import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native'; // Объединяем импорты
import { PaperProvider, Button, Portal, Modal} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { WordCard } from '../../components/wordCard/wordCard';
import * as wordDB from '../../utils/word';

export const Home = () => {
  const [displayWord, setDisplayWord] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [dailyWord, setDailyWord] = React.useState('');

  const search = () => {
    if (searchText === '') {
      return;
    }
    /* make first letter capital,
     * the rest lower case
     * and remove white spaces */  
    setSearchText(searchText.charAt(0).toUpperCase() + searchText.slice(1).toLowerCase().trim());
    setDisplayWord(true);
  };

/* if you want random a word, please follow this code */
  React.useEffect(() => {
    wordDB.pickRandomWord().then((word) => {
      setDailyWord(word.word);
    })
  }, []);

  const updateDailyWord = () => {
    wordDB.pickRandomWord().then((word) => {
      setDailyWord(word.word);
    });
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.searchComponent}>
          <TextInput
            style={styles.inputText}
            placeholder="Type here to check!"
            placeholderTextColor="#F8EDFF" 
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <AntDesign
            name="search1"
            color={searchText === '' ? "gray" : "white"}
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
        <WordCard word={dailyWord} />
        <Button style={styles.button} onPress={updateDailyWord}>
        <Text style={styles.buttonText}>I WANT MORE</Text>
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#525CEB',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputText: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#F8EDFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#F8EDFF',
  },
  searchButton: {
    fontSize: 28,
  },
  // dailyStyle: {
  //   fontSize: 24,

  //  // alignItems: 'center',
  //  // padding: 10,
  // },
  dailyWordContainer: {
    marginTop: 20,
    alignItems: 'center',
    
  },
  dailyWordText: {
    fontSize: 20,
    marginBottom: 10,
    paddingTop: 10,
    color: '#F8EDFF',
    textAlign: 'center', 
    fontWeight: 'bold', 
  },
  button: {
    backgroundColor: '#525CEB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    marginTop: 30, 
    width: 250, 
    alignSelf: 'center', 
  },
  buttonText: {
    color: 'white', 
    fontSize: 18,
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
  },
});
