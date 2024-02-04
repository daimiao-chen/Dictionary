import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import * as wordDB from '../../utils/word';

export const Settings = () => {
  return (
    <View>
      <Text>Settings</Text>
      <Button onPress={()=>wordDB.closeDBandDelete()} >Delete Database</Button>
    </View>
  );
}
