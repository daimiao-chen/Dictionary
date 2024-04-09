import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'; 
import { PaperProvider, Button, Portal, Modal} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { WordCard } from '../../components/wordCard/wordCard';
import { Accelerometer } from 'expo-sensors';
import * as wordDB from '../../utils/word';
import { normalStyles, darkStyles } from '../../utils/style';

export const Home = () => {
  const [displayWord, setDisplayWord] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [dailyWord, setDailyWord] = React.useState('');
  const [data, setData] = React.useState({});
  const [isDark, setIsDark] = React.useState(false);

  let styles = isDark ? darkStyles : normalStyles;

  const search = () => {
    if (searchText === '') {
      return;
    }
    setSearchText(searchText.charAt(0).toUpperCase() + searchText.slice(1).toLowerCase().trim());
    setDisplayWord(true);
  };

  React.useEffect(() => {
    wordDB.pickRandomWord().then((word) => {
      setDailyWord(word.word);
    });

    Accelerometer.setUpdateInterval(50);
    const subscriptionShake = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      setData(accelerometerData);
      if (Math.abs(x) > 1.5 || Math.abs(y) > 1.5 || Math.abs(z) > 1.5) {
        updateDailyWord();
      }
    });

    wordDB.getDarkMode().then((mode) => {
      setIsDark(mode);
    });

    return () => {
      subscriptionShake.remove();
    }

  }, []);

  const updateDailyWord = () => {
    wordDB.pickRandomWord().then((word) => {
      setDailyWord(word.word);
      setSearchText('');  
      setDisplayWord(false);  
    });
  };

  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      <View style={{...styles.container, flex:1}}>
        <View style={styles.searchComponent}>
          <TextInput
            style={styles.inputText}
            placeholder="Type here to check!"
            placeholderTextColor={isDark ? "#BB86FC" : "#F8EDFF"} 
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <AntDesign
            name="search1"
            color={searchText === '' ? (isDark ? "#BB86FC" : "#8A8A8A") : (isDark ? "#BB86FC" : "white")}
            onPress={search}
            style={styles.iconSize}
          />
        </View>
        <Portal>         
          <Modal visible={displayWord} onDismiss={() => setDisplayWord(false)}>
            <WordCard word={searchText} />
          </Modal>
        </Portal>
      </View>
      <View>
        <WordCard word={dailyWord} />
        <Button style={styles.button} onPress={updateDailyWord}>
          <Text style={styles.buttonText}>I WANT MORE</Text>
        </Button>
      </View>
    </PaperProvider>
  );
};

const lightTheme = {
  colors: {
    primary: '#525CEB',
    background: '#fff',
  },
};

const darkTheme = {
  colors: {
    primary: '#BB86FC',
    background: '#121212',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputText: {
    flex: 1,
    height: 40,
    borderColor: '#525CEB',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 24,
  },
  iconSize: {
    marginLeft: 10,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#525CEB',
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
