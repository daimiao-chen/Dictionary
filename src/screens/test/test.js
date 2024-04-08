import React from 'react';
import { QuestionCard } from '../../components/testCard/questionCard';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as wordDB from '../../utils/word';
import { normalStyles, darkStyles } from '../../utils/style';

/**
 * Displayed when the user gives a wrong answer.
 * @param {string} word - The correct answer.
 * @param {boolean} isDark - Flag indicating the theme (dark/light).
 */
const WrongScreen = ({ word, isDark }) => {
  const styles = isDark ? darkStyles : normalStyles;
  return (
    <View style={styles.container}>
      <AntDesign
        name="closecircleo"
        size={48}
        color="red"
        style={styles.iconSize}
      />
      <Text style={styles.header}>The right Answer is: {word}</Text>
    </View>
  );
}

/**
 * Displayed when the user gives a correct answer.
 * @param {boolean} isDark - Flag indicating the theme (dark/light).
 */
const RightScreen = ({ isDark }) => {
  const styles = isDark ? darkStyles : normalStyles;
  return (
    <AntDesign
      name="checkcircleo"
      size={48}
      color="green"
      style={styles.iconSize}
    />
  );
}

/**
 * Displayed when the user finishes the test.
 * @param {function} reset - Function to reset the test.
 * @param {boolean} isDark - Flag indicating the theme (dark/light).
 */
const AchievementScreen = ({ reset, isDark }) => {
  const styles = isDark ? darkStyles : normalStyles;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>You have finished the test.</Text>
      <Button style={styles.button} mode="contained" onPress={reset}>Restart</Button>
    </View>
  );
}

export const Test = () => {
  const [state, setState] = React.useState('question');
  const [testList, setTestList] = React.useState([]);
  const [word, setWord] = React.useState('English');
  const [answer, setAnswer] = React.useState('');
  const [isDark, setIsDark] = React.useState(false);

  /**
   * Set the user's answer.
   * @param {string} ans - The user's answer.
   */
  const changeAnswer = (ans) => {
    setAnswer(ans);
  }

  /**
   * Check if the user's answer is correct.
   */
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

  /**
   * Move to the next question.
   */
  const nextQuestion = () => {
    setState('question');
    changeTestWord();
  }

  /**
   * Change the current test word.
   */
  const changeTestWord = () => {
    let newWord = testList[Math.floor(Math.random() * testList.length)];
    if (newWord === undefined) {
      setWord('');
      return;
    }
    console.log('test word:', newWord['word']);
    setWord(newWord['word']);
  }

  /**
   * Listener for the test.
   */
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

  /**
   * Restart the test.
   */
  const restart = () => {
    testListener();
    changeTestWord();
  }

  const styles = isDark ? darkStyles : normalStyles;

  return (
    <View style={styles.container}>
      {word !== '' && (
        <View style={styles.container}>
          {state === 'question' && <QuestionCard onChange={changeAnswer} word={word} />}
          {state === 'rightAns' && <RightScreen isDark={isDark} />}
          {state === 'wrongAns' && <WrongScreen word={word} isDark={isDark} />}
          <Button style={styles.button} mode="contained" onPress={nextQuestion}>Next</Button>
          {state === 'question' && (
            <Button style={styles.button} mode="contained" disabled={answer === ''} onPress={checkAnswer}>Check</Button>
          )}
          <Text>Need to test {testList.length} words.</Text>
        </View>
      )}
      {word === '' && (
        <AchievementScreen reset={restart} isDark={isDark} />
      )}
    </View>
  );
}
