import * as Notifications from 'expo-notifications';
import React, { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { View, Text, Alert } from 'react-native';
import { normalStyles, darkStyles } from '../../utils/style';

const setNotification = async (triggerTime) => {
  try {
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: 'Don\'t forget to check your Favourite list!',
      },
      trigger: triggerTime,
    });
  } catch (error) {
    console.log('Error setting notification:', error);
    Alert.alert('Error', 'Failed to set notification.');
  }
}

export const triggerNotification = async (time) => {
  console.log(`notification ${time.time} repeat ${time.repeats}`);
  
  const status = await Notifications.requestPermissionsAsync();
  
  if (status.granted) {
    await setNotification(time);
  } else {
    const additionalStatus = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });

    if (additionalStatus.granted) {
      await setNotification(time);
    } else {
      Alert.alert('Permission Denied', 'Please allow notifications in settings.');
    }
  }
}

export const NotificationSlider = ({ value, onValueChange }) => {
  const [displayValue, setDisplayValue] = useState("");
  var styles = normalStyles;

  useEffect(() => {
    if (value <= 60) {
      setDisplayValue(value + " m");
    } else if (value <= 60 + 24) {
      setDisplayValue((value - 60) + " h");
    } else {
      setDisplayValue((value - 84) + " d");
    }
  }, [value]);

  return (
    <View style={styles.containerRow}>
      <Slider
        style={{ width: "90%", height: 40 }}
        minimumValue={1}
        maximumValue={60 + 24 + 7}
        step={1}
        value={value}
        onValueChange={onValueChange}
      />
      <Text>{displayValue}</Text>
    </View>
  );
}

export const cancelNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('Notifications Cancelled', 'All notifications have been cancelled.');
  } catch (error) {
    console.log('Error cancelling notifications:', error);
    Alert.alert('Error', 'Failed to cancel notifications.');
  }
}

export const getNotificationStatus = async () => {
  try {
    const channels = await Notifications.getNotificationChannelsAsync();
    return channels.length > 0;
  } catch (error) {
    console.log('Error getting notification status:', error);
    return false;
  }
}

export const convertTimeToSeconds = (time) => {
  if (time <= 60) {
    return time * 60;
  } else if (time <= 60 + 24) {
    return (time - 60) * 60 * 60;
  } else {
    return (time - 84) * 60 * 60 * 24;
  }
}

