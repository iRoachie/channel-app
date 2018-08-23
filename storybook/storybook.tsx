import React from 'react'
import { getStorybookUI } from '@storybook/react-native'

require('./storybook-registry')

const StorybookUI = getStorybookUI({
  port: 9001,
  host: 'localhost',
  onDeviceUI: true,
})

// RN hot module must be in a class for HMR
export class StorybookUIRoot extends React.Component {
  render() {
    return <StorybookUI />
  }
}
