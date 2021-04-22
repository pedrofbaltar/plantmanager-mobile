import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import userImg from '../assets/perfil.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>Pedro</Text>
      </View>

      <Image
        source={userImg}
        style={styles.image}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },
  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 40
  }
});