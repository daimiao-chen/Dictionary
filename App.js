import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './src/screens/home/home';
import { Favourite } from './src/screens/favourite/favourite';
import { Test } from './src/screens/test/test';
import { Settings } from './src/screens/settings/settings';
import { LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // импорт иконок

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#525CEB', 
          inactiveTintColor: '#B0B0B0', 
        }}>
        <Tab.Screen 
          name="Home" 
          component={Home} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Favourite" 
          component={Favourite} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="favorite" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Test" 
          component={Test} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="test" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={Settings} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
