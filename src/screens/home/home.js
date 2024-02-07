import React from 'react';
import { View } from 'react-native';
import { PaperProvider, Button, Portal, Modal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { WordCard } from '../../components/wordCard/wordCard';
import { AntDesign } from '@expo/vector-icons';

export const Home = () => {
  const [displayWord, setDisplayWord] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const search = () => {
    if (searchText === '') {
      return;
    }
      setDisplayWord(true);
  };

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
  },
  searchButton: {
    margin: 10,
    fontSize: 40,
  },

});
