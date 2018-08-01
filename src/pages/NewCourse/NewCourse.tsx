import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import {
  LayoutAnimation,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import validator from 'validator'
import axios from 'axios'
import { connect } from 'react-redux'

import { API, Theme } from '@config'
import { Loading, TextField } from '@components'
import { CourseState, Dispatch } from '@types'
import { setCourse } from '@actions'

interface ConnectedDispatch {
  setCourse(course: CourseState): void
}

type Props = ConnectedDispatch & NavigationScreenProps<{}>

interface State {
  code: string
  codeError: string
  name: string
  nameError: string
  loading: boolean
  message: {
    text: string
    error: boolean
  }
}

class NewCourse extends React.Component<Props, State> {
  code: TextField | null
  name: TextField | null

  constructor(props: Props) {
    super(props)

    this.state = {
      code: '',
      codeError: '',
      name: '',
      nameError: '',
      loading: false,
      message: {
        text: '',
        error: false,
      },
    }
  }

  submit = () => {
    this.code!.blur()
    this.name!.blur()
    LayoutAnimation.easeInEaseOut()

    this.setState({
      message: { text: '', error: false },
      codeError: '',
      nameError: '',
    })

    this.validate()
      .then(() => {
        this.setState({ loading: true }, this.addCourse)
      })
      .catch(e => {
        this.setState(e)
      })
  }

  validate = () => {
    return new Promise((resolve, reject) => {
      const { code, name } = this.state

      if (validator.isEmpty(code) && validator.isEmpty(name)) {
        reject({
          codeError: 'Enter course code',
          nameError: 'Enter course name',
        })
      }

      if (validator.isEmpty(code)) {
        reject({
          codeError: 'Enter course code',
        })
      }

      if (validator.isEmpty(name)) {
        reject({
          nameError: 'Enter course name',
        })
      }

      resolve()
    })
  }

  addCourse = async () => {
    try {
      const { code, name } = this.state

      const { data } = await axios.post(`${API}/courses`, { code, name })

      this.props.setCourse(data)

      this.setState({ loading: false }, () =>
        setTimeout(() => {
          LayoutAnimation.easeInEaseOut()

          this.setState({
            message: {
              text: 'Course Added',
              error: false,
            },
          })

          setTimeout(() => {
            this.props.navigation.pop(2)
          }, 3000)
        }, 400)
      )
    } catch (e) {
      const text = `Couldn't create course right now, try again later.`

      this.setState({ loading: false }, () =>
        setTimeout(() => {
          LayoutAnimation.easeInEaseOut()
          this.setState({
            message: {
              text,
              error: true,
            },
          })
        }, 400)
      )
    }
  }

  render() {
    const { loading, message } = this.state
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}

        <Loading visible={loading} />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>
              New <Text style={{ color: Theme.primary }}>Course</Text>
            </Text>

            <Text style={styles.infoText}>
              Enter the information below as clearly as possible.
            </Text>
          </View>

          <View style={styles.submitContainer}>
            <TextField
              label="Course Code"
              ref={ref => (this.code = ref)}
              value={this.state.code}
              onChangeText={code => this.setState({ code })}
              error={this.state.codeError}
              returnKeyType="next"
              onSubmitEditing={() => this.name!.focus()}
            />

            <TextField
              label="Course Name"
              ref={ref => (this.name = ref)}
              value={this.state.name}
              onChangeText={name => this.setState({ name })}
              error={this.state.nameError}
              returnKeyType="done"
              onSubmitEditing={this.submit}
            />

            <Text
              style={[
                styles.message,
                message.error ? styles.error : styles.success,
                !!this.state.message.text && {
                  marginVertical: 15,
                },
              ]}
            >
              {message.text}
            </Text>

            <Button
              title="Add Course"
              titleStyle={[styles.titleStyle, styles.main]}
              buttonStyle={{
                height: 54,
              }}
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ['#4E9CD0', Theme.primary],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
              }}
              containerStyle={{
                marginBottom: 20,
              }}
              onPress={this.submit}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  infoContainer: {
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  infoTitle: {
    fontFamily: 'NunitoSans-SemiBold',
    color: 'rgba(0,0,0,0.87)',
    fontSize: 24,
    marginBottom: 15,
  },
  infoText: {
    fontFamily: 'NunitoSans-Regular',
    color: 'rgba(0,0,0,0.87)',
    fontSize: 16,
  },
  submitContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 24,
    paddingHorizontal: 15,
  },
  titleStyle: {
    fontFamily: 'NunitoSans-Bold',
  },
  main: {
    fontSize: 16,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'NunitoSans-SemiBold',
  },
  error: {
    color: Theme.error,
  },
  success: {
    color: Theme.success,
  },
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCourse: (course: CourseState) => dispatch(setCourse(course)),
})

export default connect(null, mapDispatchToProps)(NewCourse)