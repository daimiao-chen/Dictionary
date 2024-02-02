import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Card, Portal, Button, Modal, PaperProvider } from 'react-native-paper';
import * as wordDB from './src/utils/word';
import { WordCard } from './src/components/wordCard/wordCard';

export default function App() {
  const [displayWord, setDisplayWord] = useState(false);
  const [testDefinition, setTestDefinition] = useState('');

  const searchForWord = (word) => {
    wordDB.searchWord(word).then((results) => {
      setTestDefinition(JSON.stringify(results));
    }).catch((error) => {
      setTestDefinition(JSON.stringify(error));
    });
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Button mode="contained" onPress={() => setDisplayWord(true) }> Search </Button>
        <Portal>
            <Modal visible={displayWord} onDismiss={() => setDisplayWord(false)}>
              <WordCard word="abandon" />
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
});
