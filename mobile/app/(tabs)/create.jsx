import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { use, useState } from 'react'
import { useRouter } from 'expo-router';
import style from '../../assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import CustomAlert from '../../utils/CustomAlert';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';


export default function Create() {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
    const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [customAlertTitle, setCustomAlertTitle] = useState('');
 const { token ,uri} = useAuthStore();


  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setAlertMessage('Sorry, we need camera roll permissions to make this work!');
          setAlertVisible(true);
          setAlertType('error');
          setCustomAlertTitle('Error');

          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }

    } catch (e) {

      setAlertMessage(e.message);
      setAlertVisible(true);
    }
  }

const handleSubmit = async () => {
  if (!title || !caption || !image || !rating || !category) {
    setAlertMessage("Please fill in all the fields.");
    setAlertVisible(true);
    setAlertType("error");
    setCustomAlertTitle("Error");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("caption", caption);
  formData.append("image", {
    uri: image,
    type: "image/jpeg",
    name: "image.jpg",
  });
  formData.append("rating", rating);
  formData.append("category", category);

  const response = await fetch(`${uri}/books`, {
    method: "POST",
    headers: {
      // NO Content-Type here!
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    setAlertMessage(data.message || "Operation succeeded");
    setAlertType("success");
    setCustomAlertTitle("Success");

    // Clear out the form
    setTitle("");
    setCaption("");
    setImage(null);
    setRating(0);
    setCategory("");
  } else {
    setAlertMessage(data.error || data.message || "Something went wrong");
    setAlertType("error");
    setCustomAlertTitle("Error");
  }

  setAlertVisible(true);
  setLoading(false);
};

const renderRatingPicker = () => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <TouchableOpacity key={i} onPress={() => setRating(i)} style={style.starButton}>
        <Ionicons
          name={i <= rating ? 'star' : 'star-outline'}
          size={20}
          color={i <= rating ? COLORS.primary : COLORS.textSecondary}
        />
      </TouchableOpacity>
    );
  }
  return <View style={style.ratingContainer}>{stars}</View>;
}

return (
  <KeyboardAvoidingView style={{
    flex: 1,
  }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView contentContainerStyle={style.container} style={style.scrollViewStyle}>
      <View style={style.card}>
        <View style={style.header}>
          <Text style={style.title}>Add You that You Like</Text>
          <Text style={style.subtitle}>shere yor loving books with us</Text>
        </View>
        <View style={style.form}>
          <View style={style.formGroup}>
            <Text style={style.label}>Title</Text>
            <View style={style.inputContainer}>
              <Ionicons
                name='book-outline'
                size={20}
                color={COLORS.textSecondary}
                style={style.inputIcon}
              />
              <TextInput
                style={style.input}
                placeholder="Enter book title"
                placeholderTextColor={COLORS.placeholderText}
                value={title}
                onChangeText={setTitle}
              />
            </View>

          </View>


          <View style={style.formGroup}>
            <Text style={style.label}> Your Rating</Text>
            {renderRatingPicker()}
          </View>

          <View style={style.formGroup}>
            <Text style={style.label}>ADD Image</Text>
            <TouchableOpacity
              onPress={pickImage}
              style={style.imagePicker}
            >{
                image ? (<Image source={{ uri: image }} style={style.previewImage} />) :
                  (
                    <View style={style.placeholderContainer}>
                      <Ionicons
                        name='image-outline'
                        size={40}
                        color={COLORS.textSecondary}
                        style={style.placeholderIcon}
                      />
                      <Text style={style.placeholderText}>Select Image</Text>
                    </View>
                  )
              }

            </TouchableOpacity>

          </View>

          <View style={style.formGroup}>
            <Text style={style.label}>Caption</Text>
            <View style={style.captonOutBox}>
              <Ionicons
                name='create-outline'
                size={20}
                color={COLORS.textSecondary}
                style={style.inputIcon}
              />
              <TextInput
                style={style.textArea}
                placeholder="Enter yor thoughts about the book...." 
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline={true}
              />
            </View>
          </View>


          <View style={style.formGroup}>
            <Text style={style.label}>Category</Text>
            <View style={style.captonOutBox}>
              <Ionicons
                name='book-outline'
                size={20}
                color={COLORS.textSecondary}
                style={style.inputIcon}
              />
              <TextInput
                style={style.textArea}
                placeholder="Enter category name e.g. Romance..." 
                placeholderTextColor={COLORS.placeholderText}
                value={category}
                onChangeText={setCategory}
                multiline={true}
              />
            </View>
          </View>

          <TouchableOpacity style={style.button} onPress={handleSubmit} disabled={loading}>
            {
              loading?(
                <ActivityIndicator  color={COLORS.primary} />
              ):(
                <>
                <Ionicons
                name='cloud-upload-outline'
                size={20}
                color={COLORS.white}
                style={style.inputIcon}
                />
                </>
              )
            }
          </TouchableOpacity>

          

        </View>
                    <CustomAlert
                      visible={alertVisible}
                      title={customAlertTitle}
                      message={alertMessage}
                      type={alertType}               // uses your error styling
                      cancelText="OK"             // you can omit cancel if you only want one button
                      onCancel={() => setAlertVisible(false)}
                      onConfirm={() => setAlertVisible(false)}
                    />
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
)
}