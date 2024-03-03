import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

export const RightCard = ({onChange}) => {
  const onPress = () => {
    onChange('question');
  }
  return (
    <View style={styles.mainView}>
      <AntDesign
        name="checkcircleo"
        size={48}
        color="green"
        style={styles.icon}
      />
      <Button mode="contained" onPress={onPress}>
        Next
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
  icon: {
    margin: 20,
  },
});
