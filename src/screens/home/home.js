import React from 'react';
import { View } from 'react-native';
import { PaperProvider, Button, Portal, Modal } from 'react-native-paper';
import { StyleSheet } from 'react-native';

import { WordCard } from '../../components/wordCard/wordCard';

export const Home = ({isDark}) => {
  const [displayWord, setDisplayWord] = React.useState(false);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Button mode="contained" onPress={() => setDisplayWord(true) }> Search </Button>
        <Portal>
            <Modal visible={displayWord} onDismiss={() => setDisplayWord(false)}>
              <WordCard word="abandon" isDark={isDark} />
            </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
