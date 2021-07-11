import firebase from 'firebase';

const readFile = file => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reject('error');
    }
    reader.onload = () => {
      resolve(reader.result);
    }
    reader.readAsArrayBuffer(file);
  })
}

const uploadFile = async (event) => {
  const file = Array.from(event.target.files).pop();
  const bytes = await readFile(file);
  
  const storageRef = firebase.storage().ref();
  // Upload file and metadata to the object 'images/mountains.jpg'
  const uploadTask = storageRef.child('images/' + file.name).put(bytes);
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
        default:
          console.log('Upload is running');
      }
    }, function(error) {

    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.error("User doesn't have permission to access the object");
        break;
      case 'storage/canceled':
        // User canceled the upload
        console.error("User canceled the upload")
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        console.error("Unknown error occurred, inspect error.serverResponse")
        break;
      default:
        console.error("Unknown error");
    }
  }, async () => {
    // Upload completed successfully, now we can get the download URL
    try {
      console.log(await uploadTask.snapshot.ref.getDownloadURL())
    } catch (err) {
     console.error(err) 
    }
  });
  return uploadTask;
}

export default uploadFile;
