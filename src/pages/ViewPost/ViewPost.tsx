import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import FastImage from 'react-native-fast-image'
import { decode } from 'he'
import { ChildProps, graphql } from 'react-apollo'
import HTML from 'react-native-render-html'

import { Post } from '@types'
import { NavIcon, PostMeta } from '@components'
import { Theme } from '@config'
import { postQuery } from '../../graphql'

const EmptyLinesRegex = /<p>&nbsp;<\/p>/gi

interface ScreenProps {
  post: Post
  onShare(): void
}

type InputProps = NavigationScreenProps<ScreenProps>

class ViewPost extends React.Component<ChildProps<InputProps, Response>, {}> {
  static navigationOptions = ({
    navigation,
  }: NavigationScreenProps<ScreenProps>) => ({
    headerRight: (
      <NavIcon
        iconName={Platform.OS === 'ios' ? 'ios-share-outline' : 'share'}
        onPress={navigation.getParam('onShare')}
      />
    ),
  })

  componentWillMount() {
    this.props.navigation.setParams({
      onShare: this.onShare,
    })
  }

  onShare = () => {
    if (this.props.data && this.props.data.post) {
      Share.share({
        title: this.props.navigation.getParam('post').title,
        url: this.props.data.post.guid,
      })
    }
  }

  render() {
    const post = this.props.navigation.getParam('post')

    if (this.props.data!.loading) {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 16 }}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.authorContainer}>
          <PostMeta
            author={post.author}
            date={post.date}
            categories={post.categories}
          />
        </View>

        {post.featuredImage && (
          <FastImage
            source={{ uri: post.featuredImage.guid }}
            style={styles.featuredImage}
          />
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{decode(post.title)}</Text>
        </View>

        <HTML
          html={this.props.data!.post!.content.replace(EmptyLinesRegex, '')}
          tagsStyles={css}
          baseFontStyle={{
            fontFamily: Theme.fonts.regular,
            fontSize: 18,
            lineHeight: 34,
            color: 'rgba(0,0,0,0.87)',
          }}
          ignoredStyles={[
            'float',
            'height',
            'font-family',
            'margin',
            'padding',
          ]}
          imagesMaxWidth={Dimensions.get('window').width}
        />

        <View style={styles.shareContainer}>
          <PostMeta
            author={post.author}
            date={post.date}
            categories={post.categories}
          />
        </View>
      </ScrollView>
    )
  }
}

const css = {
  p: {
    marginVertical: 8,
    marginHorizontal: 16,
    width: Dimensions.get('window').width - 32,
  },
  img: {
    marginVertical: 8,
    maxWidth: '100%',
    minWidth: '100%',
  },
  ol: {
    marginTop: 8,
  },
  li: {
    marginBottom: 0,
    maxWidth: '100%',
  },
  h2: {
    marginHorizontal: 16,
  },
  h3: {
    marginHorizontal: 16,
  },
  h4: {
    marginHorizontal: 16,
  },
  span: {
    marginHorizontal: 16,
  },
  blockquote: {
    backgroundColor: '#fafafa',
    borderLeftWidth: 4,
    borderLeftColor: Theme.darkPrimary,
    paddingTop: 8,
    marginBottom: 4,
  },
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  authorContainer: {
    padding: 16,
  },
  featuredImage: {
    height: 250,
  },
  titleContainer: {
    marginTop: 16,
  },
  title: {
    fontFamily: Theme.fonts.bold,
    marginHorizontal: 16,
    textAlign: 'center',
    fontSize: 28,
    color: 'rgba(0,0,0,0.87)',
  },
  shareContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,.24)',
    padding: 16,
  },
})

interface Response {
  post: {
    content: string
    guid: string
  }
}

interface Variables {
  id: string
}

const withPost = graphql<InputProps, Response, Variables, {}>(postQuery, {
  options: ({ navigation }) => ({
    variables: { id: navigation.getParam('post').id },
  }),
})

export default withPost(ViewPost)
