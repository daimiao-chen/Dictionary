import React from 'react';
import { View, Dimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as wordDB from '../../utils/word';
import { normalStyles, darkStyles } from '../../utils/style';
import { QuestionCard } from '../../components/testCard/questionCard';

const { width } = Dimensions.get('window');

const styles = isDark => isDark ? darkStyles : normalStyles;

/**
 * Displayed when the user gives a wrong answer.
 * @param {string} word - The correct answer.
 * @param {boolean} isDark - Flag indicating the theme (dark/light).
 */
const WrongScreen = ({ word, isDark }) => {
  const style = styles(isDark);
  return (
    <View style={[style.container, { backgroundColor: isDark ? '#121212' : '#fff', justifyContent: 'center' }]}>
      <AntDesign
        name="closecircleo"
        size={48}
        color="red"
        style={style.iconSize}
      />
      <Text style={[style.header, { color: isDark ? '#F8EDFF' : 'black', marginTop: 20 }]}>The right Answer is: {word}</Text>
    </View>
  );
}

/**
 * Displayed when the user gives a correct answer.
 * @param {boolean} isDark - Flag indicating the theme (dark/light).
 */
const RightScreen = ({ isDark }) => {
  const style = styles(isDark);
  return (
    <View style={[style.container, { backgroundColor: isDark ? '#121212' : '#fff', justifyContent: 'center', alignItems: 'center' }]}>
      <AntDesign
        name="checkcircleo"
        size={48}
        color="green"
        style={style.iconSize}
      />
    </View>
  );
}

/**
 * Displayed when the user finishes the test.
 * @param {function} reset - Function to reset the test.
 * @param {boolean} isDark - Flag indicating the theme (dark/light).
 */
const AchievementScreen = ({ reset, isDark }) => {
  const style = styles(isDark);
  return (
    <View style={[style.container, { backgroundColor: isDark ? '#121212' : '#fff', justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={[style.header, { color: isDark ? '#F8EDFF' : 'black', marginBottom: 20 }]}>You have finished the test.</Text>
      <Button style={[style.button, { backgroundColor: isDark ? '#BB86FC' : '#525CEB', width: width - 40 }]} mode="contained" onPress={reset}>
        <Text style={style.buttonText}>Restart</Text>
      </Button>
    </View>
  );
}

export const Test = () => {
  const [state, setState] = React.useState('question');
  const [testList, setTestList] = React.useState([]);
  const [word, setWord] = React.useState('English');
  const [answer, setAnswer] = React.useState('');
  const [isDark, setIsDark] = React.useState(false);

  const changeAnswer = (ans) => {
    setAnswer(ans);
  }

  const checkAnswer = () => {
    setTestList(testList.filter((x) => x['word'] !== word));
    if (answer.toLowerCase() === word.toLowerCase()) {
      wordDB.setLearned(word);
      setState('rightAns');
    } else {
      setState('wrongAns');
    }
    setAnswer('');
  }

  const nextQuestion = () => {
    setState('question');
    changeTestWord();
  }

  const changeTestWord = () => {
    let newWord = testList[Math.floor(Math.random() * testList.length)];
    if (newWord === undefined) {
      setWord('');
      return;
    }
    console.log('test word:', newWord['word']);
    setWord(newWord['word']);
  }

  const testListener = () => {
    wordDB.getTestList().then((list) => {
      setTestList(list);
      changeTestWord();
    });
  };

  React.useEffect(() => {
    wordDB.registerFavouriteListener("test", testListener);
    wordDB.getDarkMode().then((mode) => {
      setIsDark(mode);
    });
    return () => {
      wordDB.unregisterFavouriteListener("test");
    };
  }, []);

  const restart = () => {
    testListener();
    changeTestWord();
  }

  const style = styles(isDark);

  return (
    <View style={[style.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      {word !== '' && (
        <View style={style.container}>
          {state === 'question' && <QuestionCard onChange={changeAnswer} word={word} />}
          {state === 'rightAns' && <RightScreen isDark={isDark} />}
          {state === 'wrongAns' && <WrongScreen word={word} isDark={isDark} />}
          <Button style={[style.button, { backgroundColor: isDark ? '#BB86FC' : '#525CEB', width: width - 40 }]} mode="contained" onPress={nextQuestion}>
            <Text style={style.buttonText}>Next</Text>
          </Button>
          {state === 'question' && (
            <Button style={[style.button, { backgroundColor: isDark ? '#BB86FC' : '#525CEB', width: width - 40 }]} mode="contained" disabled={answer === ''} onPress={checkAnswer}>
              <Text style={style.buttonText}>Check</Text>
            </Button>
          )}
          <Text style={[style.header, { color: isDark ? '#F8EDFF' : 'black' }]}>Need to test {testList.length} words.</Text>
        </View>
      )}
      {word === '' && (
        <AchievementScreen reset={restart} isDark={isDark} />
      )}
    </View>
  );
}
