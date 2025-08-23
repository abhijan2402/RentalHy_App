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
import { useApi } from '../Backend/Api';

const Cms = ({route}) => {
  const {getRequest} = useApi();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const {title, slug , type} = route.params;

  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);


  const cmsData = async (slug) => {
      setLoading(true);
    const response = await getRequest(`public/api/cms/${slug}`);
       setHtmlContent(response?.data?.data?.content)
      console.log(response, 'CMS RESPONSE');
      setLoading(false);
  }

  useEffect( () => {
       cmsData(slug)
  },[])

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
