import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import * as wordDB from '../../utils/word';
import { triggerNotification, cancelNotifications, getNotificationStatus, convertTimeToSeconds } from '../../components/notifications/notifications';
import * as Updates from 'expo-updates';
import { normalStyles, darkStyles } from '../../utils/style';

export const Settings = () => {
  const [time, setTime] = React.useState(0);
  const [isNotification, setIsNotification] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const darkButtonText = "Dark Mode";
  const lightButtonText = "Light Mode";

  const styles = isDark ? darkStyles : normalStyles;

  React.useEffect(() => {
    wordDB.getDarkMode().then((mode) => {
      setIsDark(mode);
    });
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    wordDB.setDarkMode(newMode);
    Updates.reloadAsync();
  }

  React.useEffect(() => {
    getNotificationStatus().then((status) => {
      setIsNotification(status);
    });

    wordDB.getNotificationTime().then((time) => {
      if (time === null) {
        time = 0;
      }
      setTime(time);
    });
  }, []);

  const triggerNotificationHandle = () => {
    let triggerTime = {
      seconds: convertTimeToSeconds(time),
      repeats: true,
    };

    triggerNotification(triggerTime);
    setIsNotification(true);
    wordDB.setNotificationTime(time);
  }

  const cancelNotificationHandle = () => {
    cancelNotifications();
    setIsNotification(false);
  }

  const formatTime = (value) => {
    if (value < 60) {
      return `${value}m`;
    } else if (value < 1440) {
      return `${Math.floor(value / 60)}h`;
    } else {
      return `${Math.floor(value / 1440)}d`;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
      <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2880}
          step={1}
          minimumTrackTintColor={isDark ? '#BB86FC' : '#525CEB'} 
          maximumTrackTintColor={isDark ? '#CF6679' : '#000000'}
          thumbTintColor={isDark ? '#CF6679' : '#525CEB'}
          value={time}
          onValueChange={setTime}
        />
        <Text style={[styles.sliderText, isDark && { color: '#FFFFFF' }]}>{formatTime(time)}</Text>
      </View>
      <Button 
        style={styles.button}
        mode="contained"
        onPress={triggerNotificationHandle}
        labelStyle={styles.buttonText}>Trigger Notification</Button>
      <Button
        style={styles.button}
        mode="contained"
        disabled={!isNotification}
        onPress={cancelNotificationHandle}
        labelStyle={styles.buttonText}>Cancel Notifications</Button>
      <Button
        style={styles.button}
        onPress={toggleDarkMode}
        labelStyle={styles.buttonText}>{isDark ? lightButtonText : darkButtonText}</Button>
      <Button 
        style={styles.redButton}
        onPress={() => wordDB.closeDBandDelete()}
        labelStyle={styles.buttonText}>Delete User Data</Button>
    </View>
  );
}

