import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        requestGalleryPermission(galleryStatus.status === 'granted');
        if(galleyStatus.status !== 'granted')
        {
            alert("Sorry, we need camera roll permission to make this work!");
        }
    })();
  }, []);
  

    const takePicture = async ()=> {
        if(camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

  if (!permission|| !galleryPermission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted || !galleryPermission.granted ) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={{flex: 1}}>
        <View style={styles.cameraContainer}>
            <Camera 
                ref={ref => setCamera(ref)}
                style={styles.fixedRatio} 
                type={type} 
                ratio={'1:1'} />
        </View>
        <Button 
            title="Flip Image"
            onPress={() => {
                setType(
                    type === CameraType.back
                        ? CameraType.front
                        : CameraType.back
                );
            }}>
        </Button>
        <Button title="Take Picture" onPress={() => takePicture()} style={{flex: 1}}/>
        <Button title="Pick Image From Gallery" onPress={() => pickImage()} style={{flex: 1}}/>

        {image && <Image source={{uri: image}} style={{flex: 1}}/>}
    </View>
  );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    }
})