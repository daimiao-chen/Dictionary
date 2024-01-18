import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as wordDB from './src/utils/word';

export default function App() {
  const [testDefinition, setTestDefinition] = useState('');

  const searchForWord = (word) => {
    wordDB.searchWord(word).then((results) => {
      setTestDefinition(JSON.stringify(results));
    }).catch((error) => {
      setTestDefinition(JSON.stringify(error));
    });
  }

  return (
    <View style={styles.container}>
      <Text>{testDefinition}</Text>

      <Button title="Search" onPress={() => searchForWord('abandon')} />
      <StatusBar style="auto" />
    </View>
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
