import React from 'react';
import { QuestionCard } from '../../components/testCard/questionCard';
import { View } from 'react-native';

export const Test = () => {
  /* state is a machine state, it can be one of:
   *          question
   *          |^    |^
   *          v|    v|
   *      rightAns wrongAns */
  const [state, setState] = React.useState('question');

  const checkResult = (result) => {
    setState(result);
  }

  React.useEffect(() => {
    console.log('state:', state);
  }, [state]);

  return (
    <View>
      <QuestionCard checkResult={checkResult} />
    </View>
  );
}
