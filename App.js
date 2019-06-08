/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import PanResponder from './src/PanResponder';
import Home from './src/Home';


type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      page: 'home'
    };
    this._renderPage = this._renderPage.bind(this);
    this._onClickPage = this._onClickPage.bind(this);
  }

  _onClickPage(page) {
    this.setState({ page });
  }

  _renderPage(page) {
    switch (page) {
      case 'pan-responder':
        return <PanResponder onClickPage={this._onClickPage} />;
      case 'home':
      default:
        return <Home onClickPage={this._onClickPage} />;
    }
  }

  render() {
    const { page } = this.state;
    return <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{
        height: 100,
        paddingTop: 60,
        justifyContent: 'center',
        alignItems: 'center'

      }}>
        <Text>Learning App</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: '#F5FCFF', }}>
        {this._renderPage(page)}
      </View>

    </View>

  }
}
