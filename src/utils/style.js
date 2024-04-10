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
    placeholderTextColor: '#000000',
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
  sliderContainer: {
    width: '80%',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 50,
  },
  sliderText: {
    color: '#000000',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 24, 
  },
  normalText: {
    color: 'black',
    fontSize: 16,
  },
});

export const darkStyles = StyleSheet.create({
  containerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#121212',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#121212',  
    flex: 1,  
  },
  button: {
    backgroundColor: '#BB86FC',
    borderRadius: 8,
    padding: 10,
    width: "90%",
    margin: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  disabledButton: {
    backgroundColor: '#3A3A3A',
    borderRadius: 8,
    padding: 10,
    width: "90%"
  },
  redButton: {
    backgroundColor: '#CF6679',
    borderRadius: 8,
    padding: 10,
    width: "90%",
    margin: 10,
  },
  iconSize: {
    fontSize: 28,
    color: '#BB86FC',
  },
  searchComponent: {
    flex: 1,
    backgroundColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  inputText: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#BB86FC',
    borderRadius: 8,
    color: '#F8EDFF',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    height: 40,
    placeholderTextColor: '#000000',
  },
  filter: {
    height: 40,
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderColor: '#BB86FC',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    color: '#F8EDFF',
  },
  sliderContainer: {
    width: '80%',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 50,
  },
  sliderText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 24, 
  },
  normalText: {
    color: 'white',
    fontSize: 16,
  },
});
