import { Scene, TabBar, TabViewAnimated } from 'react-native-tab-view'
import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Text,
  View,
} from 'react-native'
import { NavIcon } from '@components'
import { graphqlClient, Theme } from '@config'
import PostPage from './components/Post.page'
import { decode } from 'he'
import { postsCategoriesQuery, postsQuery, postsTransform } from '../../graphql'
import { ChildProps, graphql } from 'react-apollo'
import { Category, GraphPost, PageInfo, Post } from '@types'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
}

interface GraphProps {
  categories: Category[]
  other: Post[]
  featured: Post[]
  pageInfo: PageInfo
}

interface ScreenProps {
  onSearch(): void
}

interface State {
  initialLoad: boolean
  fetching: boolean
  pageInfo: PageInfo | null
  featured: Post[]
  other: Post[]
  tabState: {
    index: number
    routes: Array<{ key: string; title: string }>
  }
}

type OwnProps = NavigationScreenProps<ScreenProps>
type Props = ChildProps<OwnProps, GraphProps>

class Posts extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation,
  }: NavigationScreenProps<ScreenProps>) => {
    const params = navigation.state.params || {}

    return {
      headerLeft: (
        <Image
          source={require('../../assets/logo-complete.png')}
          style={{
            height: 42,
            width: 150,
            marginLeft: 16,
          }}
          resizeMode="contain"
        />
      ),
      headerRight: (
        <NavIcon
          iconName={Platform.OS === 'android' ? 'search' : 'ios-search-outline'}
          onPress={params.onSearch}
        />
      ),
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        ...Theme.navigationOptions.headerStyle,
        ...Platform.select({
          ios: {
            height: 60,
          },
        }),
      },
    }
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      initialLoad: false,
      pageInfo: null,
      fetching: false,
      featured: [],
      other: [],
      tabState: {
        index: 0,
        routes: [{ key: 'all', title: 'All' }],
      },
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({
      onSearch: this.onSearch,
    })
  }

  componentDidUpdate() {
    const { categories, pageInfo, featured, other } = this.props.data!

    if (
      categories &&
      pageInfo &&
      featured &&
      other &&
      !this.state.initialLoad
    ) {
      this.setState({
        initialLoad: true,
        tabState: {
          ...this.state.tabState,
          routes: [
            { key: 'all', title: 'All' },
            ...categories.map(a => ({
              key: a.categoryId.toString(),
              title: a.name,
            })),
          ],
        },
        featured,
        other,
        pageInfo,
      })
    }
  }

  onSearch = () => {
    alert('Search Pressed')
  }

  handleIndexChange = (index: number) =>
    this.setState({ tabState: { ...this.state.tabState, index } })

  renderHeader = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      style={{ backgroundColor: Theme.primary }}
      indicatorStyle={{ backgroundColor: '#fff' }}
      renderLabel={({ route }: Scene<{ title: string }>) => (
        <Text
          style={{
            fontFamily: 'NunitoSans-SemiBold',
            color: '#fff',
            fontSize: 14,
          }}
        >
          {decode(route.title).toUpperCase()}
        </Text>
      )}
    />
  )

  loadMore = () => {
    if (this.state.pageInfo!.hasNextPage && !this.state.fetching) {
      this.setState({ fetching: true }, () => {
        graphqlClient
          .query({
            query: postsQuery,
            variables: {
              after: this.state.pageInfo!.endCursor,
            },
          })
          .then(({ data }: any) => {
            const other = postsTransform(data!.posts)

            this.setState({
              other: [...this.state.other, ...other],
              pageInfo: data.posts.pageInfo,
              fetching: false,
            })
          })
      })
    }
  }

  renderScene = () => {
    return (
      <PostPage
        featuredPosts={this.state.featured}
        otherPosts={this.state.other}
        onEndReached={this.loadMore}
        fetching={this.state.fetching}
      />
    )
  }

  render() {
    if (this.props.data!.error) {
      return <Text>Error</Text>
    }

    if (this.props.data!.loading) {
      return (
        <View style={{ paddingTop: 16, flex: 1, backgroundColor: '#fff' }}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
      <TabViewAnimated
        style={{ flex: 1, backgroundColor: Theme.background }}
        navigationState={this.state.tabState}
        renderScene={this.renderScene}
        renderHeader={this.renderHeader}
        onIndexChange={this.handleIndexChange}
        initialLayout={initialLayout}
      />
    )
  }
}

interface Response {
  categories: {
    edges: Array<{
      node: Category
    }>
  }
  featured: {
    edges: Array<{ node: GraphPost }>
  }
  other: {
    edges: Array<{ node: GraphPost }>
    pageInfo: PageInfo
  }
}

const withCategories = graphql<Response, any, OwnProps>(postsCategoriesQuery, {
  props: ({ data }) => {
    let returnData = {}

    if (data!.categories) {
      returnData = {
        ...returnData,
        categories: data!.categories!.edges.map(a => a.node),
      }
    }

    if (data!.featured && data!.other) {
      returnData = {
        ...returnData,
        other: postsTransform(data!.other),
        featured: postsTransform(data!.featured),
        pageInfo: data!.other.pageInfo,
      }
    }

    return {
      data: { ...returnData, error: data!.error, loading: data!.loading },
    }
  },
})

export default withCategories(Posts)