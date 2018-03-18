import { StackNavigator } from 'react-navigation'
import { Lecturers } from '@pages'
import { Theme } from '@config'

export default StackNavigator(
  {
    posts: {
      screen: Lecturers,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    navigationOptions: Theme.navigationOptions,
  }
)
