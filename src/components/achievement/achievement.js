import React from 'react';
import { Image, Text, View, FlatList } from 'react-native';
import * as wordDB from '../../utils/word';

const unlockedImages = [
  require('../../../assets/moon_slice_1.png'),
  require('../../../assets/moon_slice_2.png'),
  require('../../../assets/moon_slice_3.png'),
  require('../../../assets/moon_slice_4.png'),
  require('../../../assets/moon_slice_5.png'),
  require('../../../assets/moon_slice_6.png'),
  require('../../../assets/moon_slice_7.png'),
  require('../../../assets/moon_slice_8.png'),
  require('../../../assets/moon_slice_9.png'),
  require('../../../assets/moon_slice_10.png'),
  require('../../../assets/moon_slice_11.png'),
  require('../../../assets/moon_slice_12.png'),
  require('../../../assets/moon_slice_13.png'),
  require('../../../assets/moon_slice_14.png'),
  require('../../../assets/moon_slice_15.png'),
  require('../../../assets/moon_slice_16.png'),
  require('../../../assets/moon_slice_17.png'),
  require('../../../assets/moon_slice_18.png'),
  require('../../../assets/moon_slice_19.png'),
  require('../../../assets/moon_slice_20.png'),
];

const lockedImages = [
  require('../../../assets/moon_slice_1_gray.png'),
  require('../../../assets/moon_slice_2_gray.png'),
  require('../../../assets/moon_slice_3_gray.png'),
  require('../../../assets/moon_slice_4_gray.png'),
  require('../../../assets/moon_slice_5_gray.png'),
  require('../../../assets/moon_slice_6_gray.png'),
  require('../../../assets/moon_slice_7_gray.png'),
  require('../../../assets/moon_slice_8_gray.png'),
  require('../../../assets/moon_slice_9_gray.png'),
  require('../../../assets/moon_slice_10_gray.png'),
  require('../../../assets/moon_slice_11_gray.png'),
  require('../../../assets/moon_slice_12_gray.png'),
  require('../../../assets/moon_slice_13_gray.png'),
  require('../../../assets/moon_slice_14_gray.png'),
  require('../../../assets/moon_slice_15_gray.png'), 
  require('../../../assets/moon_slice_16_gray.png'),
  require('../../../assets/moon_slice_17_gray.png'),
  require('../../../assets/moon_slice_18_gray.png'),
  require('../../../assets/moon_slice_19_gray.png'),
  require('../../../assets/moon_slice_20_gray.png'),
];

const learnedCountToAchievementCount = (learnedCount) => {
  if (learnedCount < 1) {
    return 0;
  } else if (learnedCount < 5) {
    return 1;
  } else if (learnedCount < 10) {
    return 2;
  } else if (learnedCount < 50) {
    return 3;
  } else {
    return Math.foor(learnedCount / 50) + 3;
  }
}

const achievementCountToLabel = (achievementCount) => {
  if (achievementCount === 1) {
    return "Words 1"
  } else if (achievementCount === 2) {
    return "Words 5"
  } else if (achievementCount === 3) {
    return "Words 10"
  } else {
    return "Words " + (achievementCount - 3) * 50;
  }
}

export const Achievement = () => {
  const [unlocked, setUnlocked] = React.useState([]);
  const [locked, setLocked] = React.useState([]);
  const [achievementCount, setAchievementCount] = React.useState(0);
  const [learnedCount, setLearnedCount] = React.useState(0);

  const learnedListener = (result) => {
    var tempCount = 0;
    for (x of result) {
      if (x['learned'] === 1) {
        tempCount++;
      }
    }
    setLearnedCount(tempCount);
  }

  React.useEffect(() => {
    wordDB.registerFavouriteListener("achievement", learnedListener);

    return () => {
      wordDB.unregisterFavouriteListener("achievement");
    }
  }, []);

  React.useEffect(() => {
    setAchievementCount(learnedCountToAchievementCount(learnedCount));
  }, [learnedCount]);

  React.useEffect(() => {
    tempUnlocked = [];
    tempLocked = [];

    for (let i = 1; i <= 20; i++) {
      if (i <= achievementCount) {
        tempUnlocked.push(i);
      } else {
        tempLocked.push(i);
      }
    }
    setUnlocked(tempUnlocked);
    setLocked(tempLocked);

  }, [achievementCount]);

  const unlockedImage = (imageId) => {
    const label = achievementCountToLabel(imageId);
    return (
      <View>
      <Image
        style={{ width: 60, height: 60, margin: 5 }}
        source={unlockedImages[imageId - 1]}
      />
      <Text>{label}</Text>
      </View>
    );
  }

  const lockedImage = (imageId) => {
    const label = achievementCountToLabel(imageId);
    return (
      <View>
        <Image
          style={{ width: 60, height: 60, margin: 5 }}
          source={lockedImages[imageId - 1]}
        />
        <Text>{label}</Text>
      </View>
    );
  }


  return (
    <View>
        <Text>Unlocked</Text>
        <FlatList
          data={unlocked}
          renderItem={({ item }) => unlockedImage(item)}
          keyExtractor={(item) => item.toString()}
          numColumns={5}
          style={{height: Math.floor((unlocked.length + 4)/5) * 100, flexGrow:0}}
        
        />
        <Text>Lockedasdf</Text>
        <FlatList
          data={locked}
          renderItem={({ item }) => lockedImage(item)}
          keyExtractor={(item) => item.toString()}
          numColumns={5}
        />
    </View>
  );
}

