import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const buttons = [
  { label: 'Pan Responder', view: 'pan-responder' },
  { label: 'View', view: 'view' },
  { label: 'Image', view: 'Image' },
  { label: 'FlatList', view: 'flat-list' },
]

class Home extends Component {
  constructor(props) {
    super(props);
  };
  render() {
    const { onClickPage } = this.props;
    return <ScrollView contentContainerStyle={styles.container}>
      {
        buttons.map((btn, index) => <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => onClickPage(btn.view)}
        >
          <Text style={styles.buttonText}>
            {btn.label}
          </Text>
        </TouchableOpacity>)
      }

    </ScrollView>
  }
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 8,
    // backgroundColor: 'rgb(66, 103, 178)'
  },
  button: {
    backgroundColor: 'rgb(66, 103, 178)',
    borderColor: 'rgb(66, 103, 178)',
    borderWidth: 1,
    marginBottom: 8,
    height: (screenWidth - 48) / 2,
    width: (screenWidth - 48) / 2,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    // backgroundColor: '#FFF'
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold'
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
});
