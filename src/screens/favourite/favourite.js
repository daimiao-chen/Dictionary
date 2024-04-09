import React from 'react';
import { View, FlatList, TextInput, Dimensions, StyleSheet } from 'react-native';
import { Button, Card, Text, PaperProvider } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as wordDB from '../../utils/word';
import { normalStyles, darkStyles } from '../../utils/style';
import { WordItem } from '../../components/wordCard/wordCard';

const { width } = Dimensions.get('window');

const styles = isDark => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  filter: {
    width: '100%',
    height: 40,
    borderColor: isDark ? '#BB86FC' : '#525CEB',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
    color: isDark ? '#F8EDFF' : 'black',
  },
  iconSize: {
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
  },
});

const EmptyList = ({ isDark }) => {
  const style = styles(isDark);
  return (
    <View style={[style.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <AntDesign
        name="frown"
        size={48}
        color={isDark ? '#F8EDFF' : 'black'}
        style={style.iconSize}
      />
      <Text style={[style.header, { color: isDark ? '#F8EDFF' : 'black', marginTop: 20 }]}>No favourite words found.</Text>
    </View>
  );
}

export const Favourite = () => {
  const [favouriteList, setFavouriteList] = React.useState([]);
  const [filterText, setFilterText] = React.useState('');
  const [filterList, setFilterList] = React.useState([]);
  const [isDark, setIsDark] = React.useState(false);

  const favouriteListener = (results) => {
    console.log('Favourite listener', results.map((x) => x.word));
    setFavouriteList(results);
  };

  React.useEffect(() => {
    wordDB.registerFavouriteListener("favouriteScreen", favouriteListener);
    wordDB.getDarkMode().then((mode) => {
      setIsDark(mode);
    });

    return () => {
      wordDB.unregisterFavouriteListener("favouriteScreen");
    };
  }, []);

  React.useEffect(() => {
    const list = favouriteList.filter((item) => {
      return item.word.toLowerCase().includes(filterText.toLowerCase());
    });
    setFilterList(list);
  }, [filterText, favouriteList]);

  const buttonListener = () => {
    wordDB.pickRandomWord()
      .then(result => {
        wordDB.addFavourite(result.word);
      });
  };

  const style = styles(isDark);

  return (
    <PaperProvider>
      <View style={style.container}>
        <TextInput
          placeholder="Filter"
          style={style.filter}
          value={filterText}
          onChangeText={setFilterText}
        />
        {filterText === '' && favouriteList.length > 0 && (
          <FlatList
            data={favouriteList}
            renderItem={({ item }) => <WordItem item={item} />}
            keyExtractor={(item) => item.id.toString()} 
            style={{ flex: 1 }}
          />
        )}
        {filterText !== '' && filterList.length > 0 && (
          <FlatList
            data={filterList}
            renderItem={({ item }) => <WordItem item={item} />}
            keyExtractor={(item) => item.id.toString()} 
            style={{ flex: 1 }}
          />
        )}
        {(filterText === '' && favouriteList.length === 0) || (filterText !== '' && filterList.length === 0) && (
          <EmptyList isDark={isDark} />
        )}
      </View>
    </PaperProvider>
  );
};
