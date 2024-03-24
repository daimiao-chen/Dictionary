import * as Notifications from 'expo-notifications';
import React from 'react';
import Slider from '@react-native-community/slider';
import { View, Text } from 'react-native';
import {StyleSheet} from 'react-native';

const setNotification = (triggerTime) => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reminder',
      body: 'Don\'t forget to check your Favourite list!',
    },
    trigger: triggerTime,
  });
}

export const triggerNotification = (time) => {
  console.log('time:', time);
  console.log('repeat:', time.repeats);
  /* get permission */
  Notifications.requestPermissionsAsync().then((status) => {
    if (status.granted) {
      setNotification(time);
    } else {
      /* request permission */
      Notifications.requestPermissionsAsync(
        {
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        }
      ).then((status) => {
        if (status.granted) {
          setNotification(time);
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  })
}

export const NotificationSlider = ({value, onValueChange}) => {
  const [displayValue, setDisplayValue] = React.useState("");
  React.useEffect(() => {
    if (value <= 60) {
      setDisplayValue(value + " m");
    } else if (value <= 60 + 24) {
      setDisplayValue((value - 60) + " h");
    } else {
      setDisplayValue((value - 84) + " d");
    }
  }, [value]);
  return (
    <View style={styles.container}>
      <Slider
        style={{width: "90%", height: 40}}
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

export const cancelNotifications = () => {
  return Notifications.cancelAllScheduledNotificationsAsync();
}

export const getNotificationStatus = () => {
  return Notifications.getNotificationChannelsAsync().then((channels) => {
    if (channels.length > 0) {
      return true;
    } else {
      return false;
    }
  })
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

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 20,
  },
});
