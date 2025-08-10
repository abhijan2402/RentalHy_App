import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import Header from './FeedHeader';

const Cms = ({route}) => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const {title, slug} = route.params;

  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate fetching static CMS content
  useEffect(() => {
    setTimeout(() => {
      const staticHTML = `
        <h2>About Our Property App</h2>
        <p>Welcome to <strong>PropertyPro</strong>, your one-stop destination for buying, selling, and renting properties with ease. We connect buyers and sellers through a simple and efficient platform.</p>

        <h3>Why Choose Us?</h3>
        <ul>
          <li>Wide range of verified properties</li>
          <li>Trusted by thousands of buyers and sellers</li>
          <li>Secure and transparent transactions</li>
        </ul>

        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis ante at elit facilisis malesuada. Sed nec felis ut nunc ultrices tincidunt. Vivamus et lorem nec magna fermentum elementum a eu ligula.</p>

        <h3>Contact Information</h3>
        <p>Email: <a href="mailto:support@propertypro.com">support@propertypro.com</a></p>
        <p>Phone: +91-9876543210</p>
      `;
      setHtmlContent(staticHTML);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Header title={title} showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <RenderHTML
            contentWidth={width}
            source={{html: htmlContent}}
            tagsStyles={{
              h2: {
                fontSize: 22,
                fontWeight: '700',
                marginBottom: 10,
                color: '#222',
              },
              h3: {
                fontSize: 18,
                fontWeight: '600',
                marginTop: 15,
                marginBottom: 8,
                color: '#333',
              },
              p: {
                fontSize: 15,
                lineHeight: 22,
                color: '#444',
                marginBottom: 10,
              },
              li: {
                marginBottom: 6,
                color: '#333',
                fontSize: 15,
              },
              strong: {fontWeight: 'bold'},
              a: {color: '#007bff', textDecorationLine: 'underline'},
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Cms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
});
