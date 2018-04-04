import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import { Theme } from '@config'
import { Course, Lecturer, Review } from '@types'
import mocks from '../../mocks.json'
import ReviewCourseItem from './components/ReviewCourseItem'

interface ScreenParams {
  course: Course
  lecturer: Lecturer
}

type Props = NavigationScreenProps<ScreenParams>

const ViewCourse: React.SFC<Props> = ({ navigation }) => {
  const { course, lecturer } = navigation.state.params

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{`${lecturer.name}'s Reviews`}</Text>
          <Text style={styles.course}>{`${course.code} - ${course.name}`}</Text>
        </View>
      </View>

      <FlatList
        data={mocks.reviews}
        keyExtractor={(review: Review) => review.id.toString()}
        contentContainerStyle={{ flex: 1, backgroundColor: Theme.background }}
        renderItem={({ item }) => <ReviewCourseItem review={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Theme.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'NunitoSans-Bold',
  },
  course: {
    color: 'rgba(255,255,255,.7)',
    fontSize: 16,
    fontFamily: 'NunitoSans-Regular',
  },
})

export default ViewCourse
