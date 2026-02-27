import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, Alert } from 'react-native';
import { COLOR } from '../Constants/Colors';
import { windowHeight } from '../Constants/Dimensions';
import { useApi } from '../Backend/Api';
import { AuthContext } from '../Backend/AuthContent';

const windowWidth = Dimensions.get('window').width;

const UserPost = (items) => {
    const { postRequest } = useApi();
    const { user } = useContext(AuthContext);

    const item = items?.item?.item;

    const [liked, setLiked] = useState(item.favourite || false);
    const [saved, setSaved] = useState(false);

    const toggleLike = () => {
        setLiked(!liked);
    };

    const toggleSave = () => {
        setSaved(!saved);
    };

    const handleSavePost = async () => {
        const payload = {
            user_id: user?.id,    // Get this dynamically
            post_id: item?.post_id,   // Pass the current post ID
        };

        const response = await postRequest('/posts/save', payload);

        if (response.success) {
            Alert.alert(response?.data?.message)
            setSaved(!saved);
        } else {
            console.error('Error saving post:', response.error);
        }
    };

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: item.userProfileImage || 'https://cdn-icons-png.flaticon.com/128/4140/4140037.png' }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.user_name || "App user"}</Text>
                    <Text style={styles.subText}>
                        {item.location} • {item.postTime}
                    </Text>
                </View>
            </View>

            {/* Post Title */}
            <View style={{ width: windowWidth / 1.15, alignSelf: 'center' }}>
                <Text style={styles.title}>{item.description}</Text>
            </View>

            {/* Post Images */}
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignContent: 'center',
                    justifyContent: 'center',
                }}>
                {item.images?.length === 3
                    ? item.images?.map((i, index) => (
                        <Image
                            key={index}
                            resizeMode="cover"
                            source={{ uri: i }}
                            style={[styles.postImage, { width: 100 }]}
                        />
                    ))
                    : item.images?.length === 1
                        ? item.images?.map((i, index) => (
                            <Image
                                key={index}
                                resizeMode="cover"
                                source={{ uri: i }}
                                style={[styles.postImage, { width: 300, height: 130 }]}
                            />
                        ))
                        : item.images?.map((i, index) => (
                            <Image
                                key={index}
                                resizeMode="cover"
                                source={{ uri: i }}
                                style={styles.postImage}
                            />
                        ))}
            </View>

            {/* Post Actions */}
            <View style={styles.content}>
                <View style={styles.row}>
                    {/* Like */}
                    <TouchableOpacity style={styles.option} onPress={toggleLike}>
                        <Image
                            source={{
                                uri: 'https://cdn-icons-png.flaticon.com/128/126/126473.png',
                            }}
                            style={{
                                width: 15,
                                height: 15,
                                tintColor: liked ? 'red' : 'gray',
                            }}
                        />
                        <Text style={styles.count}>{item.likecount == 0 ? "" : item?.likecount} Likes</Text>
                    </TouchableOpacity>

                    {/* Comment */}
                    <View style={styles.option}>
                        <Image
                            source={{
                                uri: 'https://cdn-icons-png.flaticon.com/128/5948/5948565.png',
                            }}
                            style={{ width: 15, height: 15 }}
                        />
                        <Text style={styles.count}>{item.commentcount == 0 ? "" : item?.commentcount} Comments</Text>
                    </View>

                    {/* Save */}
                    <TouchableOpacity style={styles.option} onPress={handleSavePost}>
                        <Image
                            source={{
                                uri: 'https://cdn-icons-png.flaticon.com/128/1077/1077035.png',
                            }}
                            style={{
                                width: 15,
                                height: 15,
                                tintColor: saved ? 'blue' : 'gray',
                            }}
                        />
                        <Text style={styles.count}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


export default UserPost;

const styles = StyleSheet.create({
    MainView: {
        backgroundColor: COLOR.white,
        height: windowHeight,
    },
    card: {
        marginVertical: 10,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    name: {
        fontWeight: '600',
        fontSize: 16,
    },
    subText: {
        fontSize: 12,
        color: '#555',
    },
    postImage: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 15,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 0.5,
        paddingTop: 10,
        borderTopColor: COLOR.grey,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    count: {
        fontSize: 13,
        marginLeft: 4,
        color: '#555',
    },
    postImage: {
        width: 150,
        height: 100,
        margin: 2,
        // borderRadius: 12,
        // marginRight: 10,
    },
});
