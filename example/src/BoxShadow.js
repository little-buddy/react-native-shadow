import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
  Path,
} from 'react-native-svg';

function colorRgb(color) {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  let sColor = color.toLowerCase();
  let rgb = [];
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    for (let i = 1; i < 7; i += 2) {
      rgb.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    return rgb;
  } else {
    throw Error('Invalid Color!');
  }
}

// TODO 非羽化效果，只是一个背景+透明色
export default (props: any) => {
  const { setting = {}, containerStyle, children } = props;
  const {
    width: setWidth,
    height: setHeight,
    color = '#000',
    border = 1,
    opacity = 1,
    x = 0,
    y = 0,
  } = setting;

  const [w, setW] = useState(setWidth || 0);
  const [h, setH] = useState(setHeight || 0);

  const onLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }) => {
    if (!setWidth) {
      w !== width && setW(width);
    }
    if (!setHeight) {
      h !== height && setH(height);
    }
  };

  let { radius = 1 } = setting;
  radius = Math.min(radius, h / 2);

  //define the lengths
  const lineWidth = border,
    rectWidth = w - radius * 2,
    rectHeight = h - radius * 2;

  //update 2017-03-04
  //format the color
  let rgb = colorRgb(color);

  const linear = key => {
    return [
      <Stop
        offset="0"
        stopColor={color}
        stopOpacity={opacity}
        key={key + 'Linear0'}
      />,
      <Stop
        offset="1"
        stopColor={color}
        stopOpacity="0"
        key={key + 'Linear1'}
      />,
    ];
  };
  const radial = key => {
    return [
      <Stop
        offset="0"
        stopColor={color}
        stopOpacity={opacity}
        key={key + 'Radial0'}
      />,
      <Stop
        offset={(radius / (lineWidth + radius)).toString()}
        stopColor={color}
        stopOpacity={opacity}
        key={key + 'Radial1'}
      />,
      <Stop
        offset="1"
        stopColor={color}
        stopOpacity="0"
        key={key + 'Radial2'}
      />,
    ];
  };

  //the same parts for gradients

  const outerWidth = lineWidth + radius;

  //return a view ,whose background is a svg picture
  return (
    <View style={containerStyle} onLayout={onLayout}>
      <Svg
        height={h + lineWidth * 2 + radius * 2}
        width={w + lineWidth * 2 + radius * 2}
        style={{
          position: 'absolute',
          top: y - lineWidth,
          left: x - lineWidth,
        }}>
        <Defs>
          <LinearGradient id="top" x1="0%" x2="0%" y1="100%" y2="0%">
            {linear('BoxTop')}
          </LinearGradient>
          <LinearGradient id="bottom" x1="0%" x2="0%" y1="0%" y2="100%">
            {linear('BoxBottom')}
          </LinearGradient>
          <LinearGradient id="left" x1="100%" y1="0%" x2="0%" y2="0%">
            {linear('BoxLeft')}
          </LinearGradient>
          <LinearGradient id="right" x1="0%" y1="0%" x2="100%" y2="0%">
            {linear('BoxRight')}
          </LinearGradient>

          {/* 曲线必须 径向渐变 */}

          <RadialGradient
            id="border-left-top"
            r="100%"
            cx="100%"
            cy="100%"
            fx="100%"
            fy="100%">
            {radial('BoxLeftTop')}
          </RadialGradient>
          <RadialGradient
            id="border-left-bottom"
            r="100%"
            cx="100%"
            cy="0%"
            fx="100%"
            fy="0%">
            {radial('BoxLeftBottom')}
          </RadialGradient>
          <RadialGradient
            id="border-right-top"
            r="100%"
            cx="0%"
            cy="100%"
            fx="0%"
            fy="100%">
            {radial('BoxRightTop')}
          </RadialGradient>
          <RadialGradient
            id="border-right-bottom"
            r="100%"
            cx="0%"
            cy="0%"
            fx="0%"
            fy="0%">
            {radial('BoxRightBottom')}
          </RadialGradient>
        </Defs>

        <Path
          d={`M 0 ${outerWidth},Q 0 0 ${outerWidth} 0,v ${lineWidth},q ${-radius} 0 ${-radius} ${radius},h ${-lineWidth},z`}
          fill="url(#border-left-top)"
        />
        <Path
          d={`M ${rectWidth +
            lineWidth +
            radius} 0,q ${outerWidth} 0 ${outerWidth} ${outerWidth},h ${-lineWidth},q 0 ${-radius} ${-radius} ${-radius},v ${-lineWidth},z`}
          fill="url(#border-right-top)"
        />
        <Path
          d={`M ${rectWidth + lineWidth + 2 * radius} ${rectHeight +
            lineWidth +
            radius},h ${lineWidth},q 0 ${outerWidth} -${outerWidth} ${outerWidth},v ${-lineWidth},q ${radius} 0 ${radius} ${-radius},z`}
          fill="url(#border-right-bottom)"
        />
        <Path
          d={`M 0 ${rectHeight +
            lineWidth +
            radius},q 0 ${outerWidth} ${outerWidth} ${outerWidth},v ${-lineWidth},q ${-radius} 0 ${-radius} ${-radius},h ${-lineWidth},z`}
          fill="url(#border-left-bottom)"
        />

        <Rect
          x={outerWidth}
          y="0"
          width={rectWidth}
          height={lineWidth}
          fill="url(#top)"
        />
        <Rect
          x="0"
          y={outerWidth}
          width={lineWidth}
          height={rectHeight}
          fill="url(#left)"
        />
        <Rect
          x={rectWidth + lineWidth + 2 * radius}
          y={outerWidth}
          width={lineWidth}
          height={rectHeight}
          fill="url(#right)"
        />
        <Rect
          x={outerWidth}
          y={rectHeight + lineWidth + 2 * radius}
          width={rectWidth}
          height={lineWidth}
          fill="url(#bottom)"
        />

        <Path
          d={`M ${outerWidth} ${lineWidth},h ${rectWidth},q ${radius} 0 ${radius} ${radius},v ${rectHeight},q 0 ${radius} -${radius} ${radius},h -${rectWidth},q -${radius} 0 -${radius} -${radius},v -${rectHeight},q 0 -${radius} ${radius} -${radius}`}
          fill={`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity || 1})`}
        />
      </Svg>
      {children}
    </View>
  );
};
