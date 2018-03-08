import { Platform } from 'react-native'

const Theme = {
  accent: '#4E9CD0',
  darkPrimary: '#194D81',
  tabIconSize: 24,
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#2266AA',
    },
    headerTintColor: '#fff',
    ...(Platform.OS === 'ios'
      ? {
          headerTitleStyle: {
            fontFamily: 'NunitoSans-Bold',
            fontSize: 20,
            flex: 1,
            textAlign: 'left',
          },
        }
      : {}),
  } as any,
  primary: '#2266AA',
  background: '#F3F5FA',
}

export default Theme
