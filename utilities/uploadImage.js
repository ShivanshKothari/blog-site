import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import {config} from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV !== 'production'){
    const envPath = path.resolve(__dirname, '../.env');
    console.log("Envpath at uploadfile.js-----", envPath);
    config({path: envPath});
}

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

async function uploadImage(file, quantity) {
    try {
        console.log('Starting upload process for file:', {
            name: file.name,
            size: file.size,
            mimetype: file.mimetype,
            encoding: file.encoding,
            tempFilePath: file.tempFilePath,
            truncated: file.truncated
        });

        if (!file.tempFilePath) {
            throw new Error('No temp file path available');
        }

        const storageFB = getStorage();
        await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);

        if (quantity === 'single') {
            const dateTime = Date.now();
            const fileName = `image_${dateTime}${path.extname(file.name)}`;
            const dirName = 'images';
            const storageRef = ref(storageFB, `${dirName}/${fileName}`);

            // Read file from temp path
            console.log('Reading from temp file:', file.tempFilePath);
            const fileData = await fs.readFile(file.tempFilePath);
            const fileBuffer = new Uint8Array(fileData);

            console.log('File data size before upload:', fileBuffer.length);
            
            const metadata = {
                contentType: file.mimetype,
                customMetadata: {
                    originalName: file.name,
                    originalSize: file.size.toString(),
                    uploadSize: fileBuffer.length.toString()
                }
            };

            // Upload the file
            const uploadTask = await uploadBytesResumable(storageRef, fileBuffer, metadata);
            console.log('Upload completed. Metadata:', uploadTask.metadata);
            
            const downloadURL = await getDownloadURL(uploadTask.ref);
            console.log('Download URL generated:', downloadURL);
            
            return downloadURL;
        }
    } catch (error) {
        console.error('Error in uploadImage:', error);
        throw error;
    }
}

export default uploadImage;