import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Course } from '@types'
import { Touchable } from '@components'

interface Props {
  course: Course
  viewCourse(course: Course): void
}

const CourseItem: React.SFC<Props> = ({ course, viewCourse }) => (
  <Touchable onPress={() => viewCourse(course)}>
    <View style={styles.container}>
      <Text style={styles.title}>{`${course.code} - ${course.name}`}</Text>
      <Text style={styles.reviews}>{`${course.reviews} review${
        course.reviews !== 1 ? 's' : ''
      }`}</Text>
    </View>
  </Touchable>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
  },
  reviews: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 14,
    color: 'rgba(0,0,0,.54)',
  },
})

export default CourseItem
