import React from 'react';
import { View, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as tts from 'expo-speech';
import { normalStyles, darkStyles } from '../../utils/style';
import * as wordDB from '../../utils/word';

export const QuestionCard = ({ onChange, word }) => {
  const [answer, setAnswer] = React.useState('');
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Получение текущего режима темы
    const fetchDarkMode = async () => {
      const mode = await wordDB.getDarkMode();
      setIsDark(mode);
    };
    fetchDarkMode();
  }, []);

  const styles = isDark ? darkStyles : normalStyles;

  const playPhonetic = () => {
    tts.speak(word);
  }

  const onChangeText = (text) => {
    onChange(text);
    setAnswer(text);
  }

  return (
    <View style={[styles.containerRow, { backgroundColor: isDark ? '#121212' : '#fff', padding: 10 }]}>
      <AntDesign
        name="sound"
        size={48}
        color={isDark ? '#BB86FC' : '#525CEB'}
        style={{ marginRight: 10 }}
        onPress={playPhonetic}
      />
      <TextInput
        style={[styles.inputText, { 
          borderColor: isDark ? '#BB86FC' : 'black', 
          color: isDark ? '#F8EDFF' : '#000000',
          backgroundColor: isDark ? '#121212' : '#fff',
          fontSize: 24,
          paddingLeft: 10,
        }]}
        onChangeText={text => onChangeText(text)}
        value={answer}
        placeholder="Type your answer here"
        placeholderTextColor={isDark ? '#8A8A8A' : '#B0B0B0'} 
      />
    </View>
  );
}
