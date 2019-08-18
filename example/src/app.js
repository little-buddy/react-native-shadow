/**
 * Created by xiaoxing on 2019-08-16.
 */

import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import BoxShadow from './BoxShadow';

/*
  对这个库进行一些修改吧
* * */

export default (props: any) => (
  <SafeAreaView>
    <Text>shadow Demo</Text>
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <BoxShadow
        setting={{
          // width: 400,
          // height: 400,
          y: 10,
          opacity: 0.4,
          border: 1,
          radius: 12,
          color: '#ff8080',
        }}>
        <View style={{ backgroundColor: 'red', borderRadius: 12 }}>
          <Text style={{ paddingHorizontal: 12 }}>boxShadow</Text>
        </View>
      </BoxShadow>
    </View>
  </SafeAreaView>
);
