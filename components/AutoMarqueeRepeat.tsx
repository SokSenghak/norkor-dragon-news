import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Text, View, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Define spacing clearly. We use non-breaking spaces for a visual gap.
const SPACER_TEXT = "      "; // 6 spaces for visual separation

export default function AutoMarqueeRepeat({
  text,
  speed = 40, // pixels per second
  textStyle,
  containerStyle,
}: {
  text: string;
  speed?: number;
  textStyle?: any;
  containerStyle?: any;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  // This state will hold the width of the ENTIRE rendered content (Text + Spacer + Text)
  const [contentWidth, setContentWidth] = useState(0); 

  useEffect(() => {
    // Only proceed once the total content width is successfully measured
    if (contentWidth <= 0) return;

    // The animation distance is exactly the width of the content.
    // We scroll from 0 to -contentWidth, which makes the second text instance
    // perfectly replace the first one as it goes off-screen.
    const distance = contentWidth / 2; // The distance to scroll before looping is the width of one text instance + spacer.
                                       // NOTE: contentWidth here includes both text instances, but we want to scroll 
                                       // exactly the length of (one text + spacer), which we estimate as half of the measured width.
    
    // Recalculate the true distance after text is measured.
    // Since we put two copies of text inside a single Animated.Text,
    // the distance needed to scroll one full cycle is the width of one copy of the text plus the spacer.
    // The measurement 'contentWidth' is for "Text1 + Spacer + Text2".
    // We need to estimate the width of "Text1 + Spacer".
    const ONE_CYCLE_DISTANCE = contentWidth / 2; // Assuming Text1 and Text2 are roughly the same width.

    // Calculate duration based on distance and speed (pixels/second)
    const duration = (ONE_CYCLE_DISTANCE / speed) * 1000; 

    const startAnimation = () => {
      // Start at 0 (the beginning of the first text instance is visible)
      anim.setValue(0); 
      
      Animated.timing(anim, {
        // End off-screen left by exactly the distance of one cycle
        toValue: -ONE_CYCLE_DISTANCE,       
        duration,
        useNativeDriver: true,
        // Easing set to Linear for a smooth, consistent scroll speed
        easing: require('react-native').Easing.linear, 
      }).start(({ finished }) => {
        if (finished) startAnimation(); // repeat indefinitely
      });
    };

    startAnimation();

    return () => anim.stopAnimation();
  }, [contentWidth, speed]);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Use a single Animated.Text to hold both copies. 
        The `onLayout` will measure the total width of (Text1 + SPACER_TEXT + Text2).
      */}
      <Animated.Text
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          // Set the total width of the content only once
          if (contentWidth === 0 && w > 0) {
              setContentWidth(w); 
          }
        }}
        // Do not limit lines or clip here, as we need the full width to be measured
        numberOfLines={1} 
        ellipsizeMode="clip" 
        style={[
          styles.text,
          textStyle,
          { 
            transform: [{ translateX: anim }], // Apply the scrolling animation here
            // This is crucial: the Text component must not wrap to measure the full width
            width: '1000%', // Set a large width to ensure it doesn't wrap
          },
        ]}
      >
        {/* Text Copy 1 */}
        {text}
        
        {/* Spacer */}
        {SPACER_TEXT} 

        {/* Text Copy 2: This copy ensures the continuous loop */}
        {text}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    // Crucial: clips the content outside of the screen width
    overflow: "hidden", 
  },
  text: {
    fontSize: 16,
    color: "#fff",
    // Ensure the text flows horizontally
    flexDirection: 'row', 
  },
});