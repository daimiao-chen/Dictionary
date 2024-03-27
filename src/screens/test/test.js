import React from 'react';
import { QuestionCard } from '../../components/testCard/questionCard';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as wordDB from '../../utils/word';

const WrongIcon = ({word}) => {
  return (
    <View style={styles.iconView}>
      <AntDesign
        name="closecircleo"
        size={48}
        color="red"
        style={styles.icon}
      />
      <Text>The right Answer is: {word} </Text>
    </View>
  );
}

const RightIcon = () => {
  return (
    <AntDesign
      name="checkcircleo"
      size={48}
      color="green"
      style={styles.icon}
    />
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

  const changeAnswer = (ans) => {
    setAnswer(ans);
  }

  const checkAnswer = () => {
    /* move the right word from test List */
    setTestList(testList.filter((x) => x['word'] !== word));
    if (answer.toLowerCase() === word.toLowerCase()) {
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
      setTestList(list);
    });
  };

  React.useEffect(() => {
    wordDB.registerFavouriteListener("test", testListener);
    changeTestWord();
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
        <View style={styles.mainView}>
          <View style={styles.iconView}>
            {state === 'question' && <QuestionCard onChange={changeAnswer} word={word}/>}
            {state === 'rightAns' && <RightIcon />}
            {state === 'wrongAns' && <WrongIcon word={word} />}
          </View>
          <View style={styles.buttonGroup}>
            <View style={styles.button}>
              <Button mode="contained" onPress={nextQuestion}> Next </Button>
            </View>
            {state === 'question' && (
              <View style={styles.button}>
                <Button
                  mode="contained"
                  disabled={answer === ''}
                  onPress={checkAnswer}
                >Submit</Button>
              </View>
            )}
          </View>
          <Text> Need to test {testList.length} words. </Text>
        </View>
      )}
      { word === '' && (
        <View>
          <Text> you finished the test. </Text>
          <Button mode="contained" onPress={restart}> Restart </Button>
        </View>
      )}
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
  iconView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    margin: 20,
  },
  button: {
    margin: 20,
    color: 'white', 
  },
});

