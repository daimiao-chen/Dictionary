import {StyleSheet} from 'react-native';

export const normalStyles = StyleSheet.create({
  containerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  container: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#525CEB',
    borderRadius: 8,
    padding: 10,
    width: "90%",
    margin: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  disabledButton: {
    backgroundColor: 'grey',
    borderRadius: 8,
    padding: 10,
    width: "90%"
  },
  redButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 10,
    width: "90%",
    margin: 10,
  },
  iconSize: {
    fontSize: 28,
  },
  searchComponent: {
    flex: 1,
    backgroundColor: '#525CEB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  inputText: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    color: '#F8EDFF',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  filter: {
    height: 40,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
  },

});

export const darkStyles = StyleSheet.create({
});

