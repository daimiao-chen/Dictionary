import React from 'react';
import { QuestionCard } from '../../components/testCard/questionCard';
import { View} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as wordDB from '../../utils/word';
import { normalStyles, darkStyles } from '../../utils/style';

const WrongScreen = ({word}) => {
  var styles = normalStyles;
  return (
    <View style={styles.container}>
      <AntDesign
        name="closecircleo"
        size={48}
        color="red"
        style={styles.iconSize}
      />
      <Text>The right Answer is: {word} </Text>
    </View>
  );
}

const RightScreen = () => {
  var styles = normalStyles;
  return (
    <AntDesign
      name="checkcircleo"
      size={48}
      color="green"
      style={styles.iconSize}
    />
  );
}

const AchivementScreen = ({reset}) => {
  var styles = normalStyles;
  return (
    <View style={styles.container}>
      <Text style={styles.header}> You have finished the test. </Text>
      <Button style={styles.button} mode="contained" onPress={reset}> Restart </Button>
    </View>
  );
}

/* ****************************************************************************
 * How to determind a word need to test
 * 1. only in the favourite list words will be tested
 * 2. only the word is not master will be tested
 * 3. if a word be short successfully three times, it will be marked as learned
 * ***************************************************************************/
export const Test = () => {
  /* state is a machine state, it can be one of:
   *          question
   *          |^    |^
   *          v|    v|
   *      rightAns wrongAns */
  const [state, setState] = React.useState('question');
  const [testList, setTestList] = React.useState([]);
  const [word, setWord] = React.useState('English');
  const [answer, setAnswer] = React.useState('');
  var styles = normalStyles;

  const changeAnswer = (ans) => {
    setAnswer(ans);
  }

  const checkAnswer = () => {
    /* move the right word from test List */
    setTestList(testList.filter((x) => x['word'] !== word));
    if (answer.toLowerCase() === word.toLowerCase()) {
      wordDB.setLearned(word)
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
    let word = testList[Math.floor(Math.random() * testList.length)];
    if (word === undefined) {
      setWord('');
      return;
    }
    console.log('test word:', word['word']);
    setWord(word['word']);
  }

  const testListener = () => {
    wordDB.getTestList().then((list) => {
      changeTestWord();
      setTestList(list);
    });
  };

  React.useEffect(() => {
    wordDB.registerFavouriteListener("test", testListener);
    return () => {
      wordDB.unregisterFavouriteListener("test");
    };
  }, []);

  const restart = () => {
    testListener();
    changeTestWord();
  }

  return (
    <View>
      { word !== '' && (
        <View style={styles.container}>
          {state === 'question' && <QuestionCard onChange={changeAnswer} word={word}/>}
          {state === 'rightAns' && <RightScreen />}
          {state === 'wrongAns' && <WrongScreen word={word} />}
          <Button style={styles.button} mode="contained" onPress={nextQuestion}>  Next </Button>
          {state === 'question' && (
            <Button style={styles.button} mode="contained" disabled={answer === ''} onPress={checkAnswer} >Check</Button>
          )}
          <Text> Need to test {testList.length} words. </Text>
        </View>
      )}
      { word === '' && (
        <AchivementScreen reset={restart} />
      )}
    </View>
  );
}

