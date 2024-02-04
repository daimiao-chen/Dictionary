import React from 'react';
import { View } from 'react-native';
import { PaperProvider, Button, Portal, Modal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { WordCard } from '../../components/wordCard/wordCard';

export const Home = ({isDark}) => {
  const [displayWord, setDisplayWord] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const handleSearch = () => {
    setDisplayWord(true);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder = "Type here to translate!"
          value={searchText}
          onChangeText={text => setSearchText(text)}
          />

        <Button mode="contained" onPress={handleSearch}> Search </Button>
        <Portal>
            <Modal visible={displayWord} onDismiss={() => setDisplayWord(false)}>
              <WordCard word={searchText} isDark={isDark} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
  }
});
