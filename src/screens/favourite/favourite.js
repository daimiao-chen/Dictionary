import React from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { Checkbox, PaperProvider } from 'react-native-paper';
import * as wordDB from '../../utils/word';
import { WordItem } from '../../components/wordCard/wordCard';

export const Favourite = () => {
  const [favouriteList, setFavouriteList] = React.useState([]);
  const [filterText, setFilterText] = React.useState('');
  const [checkedItems, setCheckedItems] = React.useState({});

  React.useEffect(() => {
    const favouriteListener = (listenerCallback) => {
      const fetchData = () => {
        // Simulated data for testing
        const testData = [
          { id: 1, word: 'Favorite Word 1' },
          { id: 2, word: 'Favorite Word 2' },
          { id: 3, word: 'Favorite Word 3' },
        ];
        
        listenerCallback(testData);
      };
  
      setInterval(fetchData, 5000); 
    };
  
    // Usage:
    favouriteListener(setFavouriteList);
  }, []);

  const handleCheck = (itemId) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId] 
    }));
  };
  
  const filteredList = favouriteList.filter(item =>
    item.word.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <PaperProvider>
      <FlatList
        data={filteredList}
        renderItem={({ item }) => (
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           <Checkbox
              status={checkedItems[item.id] ? 'checked' : 'unchecked'}
              onPress={() => handleCheck(item.id)}
           />
            <WordItem item={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TextInput
       placeholder="Filter"
        style={styles.Filter}
        value={filterText}
        onChangeText={setFilterText}
       />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
    Filter: {
      height: 40,
      borderWidth: 1,
      margin: 10,
      padding: 10,
    },
  });

