// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEBrPSgz9glGcKk-VC2Dx9_uKwHlEWUKY",
  authDomain: "schlorshiptest.firebaseapp.com",
  databaseURL: "https://schlorshiptest-default-rtdb.firebaseio.com",
  projectId: "schlorshiptest",
  storageBucket: "schlorshiptest.appspot.com",
  messagingSenderId: "570145587876",
  appId: "1:570145587876:web:2edcc33563c92640d45c31",
  measurementId: "G-981LZBBVJQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Function to send verification code to user's phone number
function sendVerificationCode(phoneNumber) {
  const provider = new PhoneAuthProvider();
  return provider.verifyPhoneNumber(
    phoneNumber,
    auth // Pass the auth instance directly
  );
}

// Example usage
const phoneNumber = "+9165880140"; // Replace with the user's phone number
sendVerificationCode(phoneNumber)
  .then((verificationId) => {
    // Verification code sent successfully
    console.log(
      "Verification code sent successfully. Verification ID:",
      verificationId
    );
    // Store verificationId for later use in code verification step
  })
  .catch((error) => {
    // Error sending verification code
    console.error("Error sending verification code:", error);
  });
