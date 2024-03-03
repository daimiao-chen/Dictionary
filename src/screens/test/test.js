import React from 'react';
import { QuestionCard } from '../../components/testCard/questionCard';
import { RightCard } from '../../components/testCard/rightCard';
import { WrongCard } from '../../components/testCard/wrongCard';
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
  /* 
      <QuestionCard checkResult={checkResult} />
  */

  return (
    <View>
      {state === 'question' && <QuestionCard checkResult={checkResult} />}
      {state === 'rightAns' && <RightCard onChange={checkResult} />}
      {state === 'wrongAns' && <WrongCard onChange={checkResult} />}
    </View>
  );
}
