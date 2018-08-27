import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import StarRating from 'react-native-star-rating'
import plur from 'plur'

import { Touchable } from '@components'
import { Lecturer as LecturerModel } from '@types'
import { Theme } from '@config'

interface Props {
  lecturer: Partial<LecturerModel>
  onPress(lecturer: Partial<LecturerModel>): void
}

const LecturerCard: React.SFC<Props> = ({ lecturer, onPress }) => (
  <Touchable onPress={() => onPress(lecturer)}>
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{lecturer.name}</Text>
        <Text style={styles.reviews}>{`${lecturer.totalReviews} ${plur(
          'review',
          lecturer.totalReviews!
        )}`}</Text>
      </View>

      <StarRating
        disabled
        rating={lecturer.averageRating!}
        fullStarColor={Theme.accent}
        containerStyle={{
          marginTop: 8,
          marginBottom: 0,
          justifyContent: 'flex-start',
        }}
        starStyle={{ marginRight: 8 }}
        starSize={22}
      />
    </View>
  </Touchable>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
    borderWidth: 1,
    margin: 8,
    borderColor: 'rgba(0,0,0,.12)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: Theme.fonts.semiBold,
    fontSize: 18,
    color: 'rgba(0,0,0,.87)',
  },
  reviews: {
    fontFamily: Theme.fonts.regular,
    color: 'rgba(0,0,0,.54)',
    fontSize: 12,
  },
})

export default LecturerCard
