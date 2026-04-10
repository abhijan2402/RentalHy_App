import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    Modal
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/FeedHeader';
import { useApi } from '../../../Backend/Api';
import { ScratchCard } from 'rn-scratch-card'
import { COLOR } from '../../../Constants/Colors';
import { Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useToast } from '../../../Constants/ToastContext';
import CustomButton from '../../../Components/CustomButton';

const { width } = Dimensions.get('window');
const CARD_SIZE = width / 2 - 30;

const Reward = ({ navigation }) => {
    const { showToast } = useToast();
    const isFocus = useIsFocused()
    const [upiId, setUpiId] = useState('');
    const [fadeAnim] = useState(new Animated.Value(2));
    const [showMessage, setShowMessage] = useState(true);
    const { getRequest, postRequest } = useApi();
    const [scratchCount, setScratchCount] = useState({});
    const [openedIds, setOpenedIds] = useState({});
    const [upiLoading, setUpiLoading] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [rewardList, setrewardList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHotelReviews = async () => {
        try {
            setLoading(true)
            const response = await getRequest('public/api/reward-list');

            if (response?.success) {
                setrewardList(response?.data?.data || []);
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)

            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // public/api/scratch-reward/1
    useEffect(() => {
        if (isFocus) {
            fetchHotelReviews();
            fetchUpi()
        }
    }, [isFocus]);

    const MarkasOpened = async (id) => {
        try {
            const response = await postRequest(`public/api/scratch-reward/${id}`);
            if (response?.success) {
                fetchHotelReviews()
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const addUpi = async () => {
        if (!upiId) return;

        try {
            setUpiLoading(true);

            const response = await postRequest('public/api/add-upi', {
                upi_id: upiId
            });
            if (response?.success) {
                setUpiId('');
                showToast(response?.data?.message, "success")
                fetchUpi(); // refresh UPI
            }

        } catch (error) {
            console.log(error);
        } finally {
            setUpiLoading(false);
        }
    };
    const fetchUpi = async () => {
        try {
            const response = await getRequest('public/api/upi-list');


            if (response?.success) {
                setUpiId(response?.data?.upi_id || null)

            }

        } catch (error) {
            console.log(error);
        }
    };
    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                {item?.is_reward_open ? (
                    <View style={styles.openCard}>
                        <Text style={styles.amountText}>
                            🎉 ₹{item.amount}
                        </Text>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.cards}
                            onPress={() => {
                                if (!item?.is_reward_open) {
                                    setSelectedReward(item);
                                    setModalVisible(true);
                                }
                            }}
                        >
                            <View style={styles.openCard}>
                                <Text style={styles.amountText}>
                                    🎁 Tap to Scratch
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </>

                )}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLOR.white }}>
            <Header
                title={"Reward Management"}
                showBack
                onBackPress={() => navigation.goBack()}
            />
            <View style={styles.upiContainer}>
                <TextInput
                    placeholder="Add your UPI ID"
                    value={upiId}
                    onChangeText={setUpiId}
                    style={styles.input}
                    placeholderTextColor="#999"
                />

                <Text
                    style={styles.addButton}
                    onPress={() => {
                        addUpi()
                        console.log("UPI ID:", upiId);
                        // call API here if needed
                    }}
                >
                    Add
                </Text>
            </View>


            {
                loading ?
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <ActivityIndicator color={COLOR.primary} size={"large"} />
                    </View>
                    :
                    <>
                        {
                            rewardList?.length > 0 &&
                            <Animated.View
                                style={[
                                    styles.topMessageContainer,
                                    {
                                        opacity: fadeAnim,
                                        transform: [
                                            {
                                                translateY: fadeAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, 0],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <Text style={styles.topMessageText}>
                                    🎉 Reward will be credited to your account within 3 days
                                    if bank account is already added
                                </Text>
                            </Animated.View>
                        }
                        <FlatList
                            data={rewardList}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}

                            // horizontal
                            renderItem={renderItem}
                            contentContainerStyle={{ padding: 10 }}
                        />
                        {/* <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 14, color: COLOR.primary, marginBottom: 10 }}>Scratch Card to win the reward</Text>
                        </View> */}
                    </>

            }
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>

                        {selectedReward && (
                            <ScratchCard
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/8146/8146553.png' }}
                                style={{ width: 250, height: 250 }}
                                brushWidth={10}
                                onScratch={() => {
                                    if (openedIds[selectedReward.id]) return;

                                    setScratchCount(prev => {
                                        const count = (prev[selectedReward.id] || 0) + 1;

                                        if (count > 120) {
                                            setOpenedIds(prev => ({
                                                ...prev,
                                                [selectedReward.id]: true
                                            }));

                                            MarkasOpened(selectedReward.id);
                                            setModalVisible(false)
                                        }

                                        return { ...prev, [selectedReward.id]: count };
                                    });
                                }}
                            >
                                <View style={styles.hiddenContent}>
                                    <Text style={styles.amountText}>
                                        🎉 ₹{selectedReward.amount}
                                    </Text>
                                </View>
                            </ScratchCard>
                        )}

                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => {
                                setModalVisible(false);
                                setSelectedReward(null);
                                fetchHotelReviews(); // 🔥 REFRESH LIST
                            }}
                        >
                            <Text style={{ color: '#fff' }}>Close</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
            <CustomButton title="Add Bank Account" style={{ marginBottom: 10 }} onPress={() => navigation.navigate("BankAccount")} />
        </View>
    );
};

export default Reward;

const styles = StyleSheet.create({
    card: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3
    },
    cards: {
        width: CARD_SIZE,
        height: CARD_SIZE,
    },

    scratchCard: {
        flex: 1
    },

    hiddenContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4caf50'
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#999'
    },

    scratchText: {
        color: '#fff',
        fontWeight: 'bold'
    },

    amountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },

    openCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4caf50'
    },
    topMessageContainer: {
        backgroundColor: COLOR.primary,
        margin: 10,
        padding: 10,
        borderRadius: 10,
    },

    topMessageText: {
        color: COLOR.white,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500',
    },
    upiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 10,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        marginRight: 10,
        backgroundColor: '#fff',
        color: COLOR.primary,
        fontWeight: "600"

    },

    addButton: {
        backgroundColor: COLOR.primary,
        color: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center'
    },

    closeBtn: {
        marginTop: 20,
        backgroundColor: COLOR.primary,
        padding: 10,
        borderRadius: 8
    }
});