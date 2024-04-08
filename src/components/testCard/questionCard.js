import React from 'react';
import { View, TextInput } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as tts from 'expo-speech';
import * as wordDB from '../../utils/word';
import { normalStyles, darkStyles } from '../../utils/style';

export const QuestionCard = ({onChange, word}) => {
  const [answer, setAnswer] = React.useState('');
  var styles = normalStyles;

  const playPhonetic = () => {
    tts.speak(word);
  }

  const onChangeText = (text) => {
    onChange(text);
    setAnswer(text);
  }

  return (
    <View style={styles.containerRow}>
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
    </View>
  );
}

