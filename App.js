import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './src/screens/home/home';
import { Favourite } from './src/screens/favourite/favourite';
import { Test } from './src/screens/test/test';
import { Settings } from './src/screens/settings/settings';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Daily word" component={Home} />
        <Tab.Screen name="Favourite" component={Favourite} />
        <Tab.Screen name="Test" component={Test} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

