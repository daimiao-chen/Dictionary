import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as tts from 'expo-speech';
import * as wordDB from '../../utils/word';

export const QuestionCard = ({checkResult}) => {
  const [word, setWord] = React.useState('apple');
  const [answer, setAnswer] = React.useState('');

  const playPhonetic = () => {
    tts.speak(word);
  }

  const onChangeText = (text) => {
    setAnswer(text);
  }

  const check = () => {
    if (answer.toLowerCase()  === word.toLowerCase()) {
      checkResult("rightAns");
    } else {
      checkResult("wrongAns");
    }
  }

  return (
    <View style={styles.mainView}>
      <AntDesign
        name="sound"
        size={48}
        color="blue"
        onPress={playPhonetic}
      />
      <TextInput
        style={styles.inputText}
        onChangeText={text => onChangeText(text)}
        value={answer}
        placeholder="Type your answer here"
      />
      <Button mode="contained" onPress={check}>
        CHECK 
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  inputText: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 20,
  },
});

