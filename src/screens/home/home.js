import React from 'react';
import { View, Text, TextInput } from 'react-native'; // Объединяем импорты
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

  let styles = normalStyles;

  const search = () => {
    if (searchText === '') {
      return;
    }
    /* make first letter capital,
     * the rest lower case
     * and remove white spaces */  
    setSearchText(searchText.charAt(0).toUpperCase() + searchText.slice(1).toLowerCase().trim());
    setDisplayWord(true);
  };

/* if you want random a word, please follow this code */
  React.useEffect(() => {
    wordDB.pickRandomWord().then((word) => {
      setDailyWord(word.word);
    })

    Accelerometer.setUpdateInterval(50);
    const subscriptionShake = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      setData(accelerometerData);
      if (Math.abs(x) > 1.5 || Math.abs(y) > 1.5 || Math.abs(z) > 1.5) {
        updateDailyWord();
      }
    });

    return () => {
      subscriptionShake.remove();
    }

  }, []);

  React.useEffect(() => {
    console.log(data);
  }, [data]);
  const updateDailyWord = () => {
    wordDB.pickRandomWord().then((word) => {
      setDailyWord(word.word);
    });
  };

  return (
    <PaperProvider>
      <View style={{...styles.container, flex:1}}>
        <View style={styles.searchComponent}>
          <TextInput
            style={styles.inputText}
            placeholder="Type here to check!"
            placeholderTextColor="#F8EDFF" 
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <AntDesign
            name="search1"
            color={searchText === '' ? "gray" : "white"}
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

