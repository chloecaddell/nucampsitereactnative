import RenderCampsite from '../features/campsites/RenderCampsite';
import { FlatList, StyleSheet, Text, View, Button, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../features/favorites/favoritesSlice';
import { useState } from 'react';
import { Rating, Input } from 'react-native-elements';
import { postComment } from '../features/comments/commentsSlice';

const CampsiteInfoScreen = ({ route }) => {
    const [showModal, setShowModal] = useState(false);
    const [rating, setShowRating] = useState(5);
    const [author, setShowAuthor] = useState('');
    const [text, setShowText] = useState('');
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();

    const handleSubmit = () => {
        const newComment = {
            author,
            rating,
            text,
            campsiteId: campsite.id
        };
        dispatch(postComment(newComment));
        setShowModal(!showModal);
    };

    const resetForm = () => {
        setShowRating(5);
        setShowAuthor('');
        setShowText('');
    };

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating
                    imageSize={10}
                    style={{
                        alignItems: 'flex-start',
                        paddingVertical: '5%'
                    }}
                    startingValue={item.rating}
                    readonly
                />
                <Text style={{ fontSize: 12 }}>
                    {`-- ${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    };

    return (
        <>
            <FlatList
                data={comments.commentsArray.filter(
                    (comment) => comment.campsiteId === campsite.id
                )}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    marginHorizontal: 20,
                    paddingVertical: 20
                }}
                ListHeaderComponent={
                    <>
                        <RenderCampsite
                            onShowModal={() => setShowModal(!showModal)}
                            campsite={campsite}
                            isFavorite={favorites.includes(campsite.id)}
                            markFavorite={() => dispatch(toggleFavorite(campsite.id))}
                        />
                        <Text style={styles.commentsTitle}>Comments</Text>
                    </>
                }
            />
            <Modal
                animationType='slide'
                transparent={false}
                visible={showModal}
                onRequestClose={() => setShowModal(!showModal)}
            >
                <View style={styles.modal}>
                    <Rating
                        showRating={() => rating()}
                        startingValue={rating}
                        imageSize={40}
                        onFinishRating={(rating) => setShowRating(rating)}
                        style={{ paddingVertical: 10 }}
                    />
                    <Input
                        placeholder='Author:'
                        leftIcon={{
                            name: 'user-o',
                            type: 'font-awesome',
                        }}
                        leftIconConatinerStyle={{ paddingRight: 10 }}
                        onChangeText={value => setShowAuthor(value)}
                        value={author}
                    ></Input>
                    <Input
                        placeholder='Comment:'
                        leftIcon={{
                            name: 'comment-o',
                            type: 'font-awesome',
                        }}
                        leftIconContainerStyle={{ paddingRight: 10 }}
                        onChangeText={value => setShowText(value)}
                        value={text}
                    ></Input>
                    <View style={{ margin: 10 }}>
                        <Button
                            title='Submit'
                            color='#5637DD'
                            onPress={() => {
                                handleSubmit();
                                resetForm();
                            }}
                        ></Button>
                    </View>
                    <View style={{ margin: 10 }}>
                        <Button
                            onPress={() => {
                                setShowModal(!showModal);
                                resetForm();
                            }}
                            color='#808080'
                            title='Cancel'
                        ></Button>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});

export default CampsiteInfoScreen;