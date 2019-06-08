import React, { Component } from 'react';
import { View, Text, PanResponder, Dimensions, Animated, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import { users } from './data';

const screenWidth = Dimensions.get('window').width;
const SWIPE_THRESHOLD = screenWidth * 0.25;
const SWIPE_OUT_DURATION = 250; // = 0.25ms

class PanResponderScreen extends Component {
  static defaultProps = {
    onSwipeLeft: () => { },
    onSwipeRight: () => { },
    data: users
  }

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const translateY = new Animated.Value(0);

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // console.log('moving', gesture);
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          console.log('RIGHT');
          this._onForceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          console.log('LEFT');
          this._onForceSwipe('left');
        } else {
          console.log('MIDDLE');
          this._onResetPosition();
        }

      }
    });

    this.state = {
      panResponder,
      position,
      translateY,
      index: 0
    }
    this._onForceSwipe = this._onForceSwipe.bind(this);
  };


  _onForceSwipe(direction) {
    const x = direction === 'right' ? screenWidth : -screenWidth;
    Animated.sequence([
      Animated.timing(this.state.position, {
        toValue: { x, y: 0 },
        duration: SWIPE_OUT_DURATION
      }).start(() => this._onSwipeCompleted(direction)),
      Animated.spring(this.state.translateY, {
        toValue: 1,
        duration: 500
      }).start()
    ])
  }

  _onSwipeCompleted(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);

    this.state.position.setValue({ x: 0, y: 0 });
    this.state.translateY.setValue(0);
    this.setState({ index: this.state.index + 1 });
  }

  _onResetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  _onGetCardStyle(translateY) {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-screenWidth * 1.5, 0, screenWidth * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });


    return {
      ...position.getLayout(),
      transform: [{ rotate }, { translateY }],
    }
  }


  render() {
    const { data, onClickPage } = this.props;
    const translateY = this.state.translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 0]
    });

    return <View>
      <View style={{ alignItems: 'center', justifyContent: 'center', margin: 16 }}>
        <Button title="Back" onPress={() => onClickPage('home')}></Button>
        <Text style={{ fontSize: 20 }}>This is PanResponder swipe action demo</Text>
      </View>
      <View style={{ padding: 16 }}>
        {
          data.map((item, index) => {
            if (index < this.state.index) return null;

            if (index === this.state.index) {
              return <Animated.View
                key={index}
                style={this._onGetCardStyle(translateY)}
                {...this.state.panResponder.panHandlers}
              >
                <CardItem index={index} {...item} currentIndex={this.state.index} _onForceSwipe={this._onForceSwipe} />
              </Animated.View>
            }

            if (index === this.state.index + 1) {
              return <Animated.View
                key={index}
                style={{
                  top: translateY
                }}
                {...this.state.panResponder.panHandlers}
              >
                <CardItem index={index} {...item} currentIndex={this.state.index} _onForceSwipe={this._onForceSwipe} />
              </Animated.View>
            }

            return null;
          }).reverse()
        }
      </View>
    </View >
  }
};
export default PanResponderScreen;

const CardItem = ({
  avatar, name, phoneNumber, job, description, index, currentIndex, _onForceSwipe
}) => <View style={[
  styles.cardItem,
  {
    backgroundColor: `rgba(66, 103, 178, ${(index === currentIndex) ? 1 : 0.8})`,
    top: index === currentIndex ? 0 : 16,
    left: index === currentIndex ? 0 : 16,
    right: index === currentIndex ? 0 : 16,
    width: index === currentIndex ? screenWidth - 32 : screenWidth - 64,
  }
]}>
    <View style={styles.contentWrapper}>
      <View style={styles.contentTitle}>
        <Image source={{ uri: avatar }} style={styles.avatar} resizeMethod="resize" />
        <View style={{
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}>
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>{name}</Text>
          <Text style={{ color: '#FFF', fontWeight: '300', fontSize: 12 }}>Job Type: {job}</Text>
          <Text style={{ color: '#FFF', fontWeight: '300', fontSize: 12 }}>Phone Number: {phoneNumber}</Text>
        </View>
      </View>
      <View style={styles.description}>
        <Text style={{ color: '#FFF', fontWeight: '300', fontSize: 12 }} numberOfLines={2}>{description}</Text>
      </View>
    </View>
    <View style={styles.actionWrapper}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#FFF' }]}
        onPress={() => _onForceSwipe('left')}
      >
        <Text style={[styles.actionText, { color: 'rgb(66, 103, 178)' }]}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => _onForceSwipe('left')}
      >
        <Text style={styles.actionText}>Postpone</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => _onForceSwipe('right')}
      >
        <Text style={styles.actionText}>No, thanks</Text>
      </TouchableOpacity>
    </View>
  </View >

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 8,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#EEE'
  },
  cardItem: {
    position: 'absolute',
    // height: 180,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 8
  },
  contentWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 8
  },
  contentTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  description: {
    padding: 8
  },
  actionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
  actionButton: {
    margin: 8,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#FFF',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    width: (screenWidth / 3) - 32
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF'
  }
})