import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEBrPSgz9glGcKk-VC2Dx9_uKwHlEWUKY",
  authDomain: "schlorshiptest.firebaseapp.com",
  projectId: "schlorshiptest",
  storageBucket: "schlorshiptest.appspot.com",
  messagingSenderId: "570145587876",
  appId: "1:570145587876:web:2edcc33563c92640d45c31",
  measurementId: "G-981LZBBVJQ",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get a reference to Firebase Storage
const storage = getStorage(app);

const submitBtn = document.getElementById("submiit");

// Add event listener to the submit button
submitBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default button click behavior

  // Call your function to generate PDF or handle form submission
  generatePdf();
});

async function generatePdf() {
  const nameValue = document.getElementById("name").value;
  const fatherNameValue = document.getElementById("father-name").value;
  const mobileValue = document.getElementById("mobile").value;
  const mail = document.getElementById("email").value;
  const classValue = document.getElementById("class").value;
  const collegeValue = document.getElementById("college").value;
  const examTimeValue = document.getElementById("exam-time").value;
  const examDateValue = document.getElementById("exam-date").value;

  const headerContent = document.querySelector("header").outerHTML;
  const footerContent = document.querySelector("footer").outerHTML;
  //const prize = document.querySelector("ppp").innerHTML;

  // Form Validation
  if (!nameValue) {
    alert("Name is required");
    return;
  }
  if (!fatherNameValue) {
    alert("Father's name is required");
    return;
  }
  if (!mobileValue || !/^\d{10}$/.test(mobileValue)) {
    alert("A valid 10-digit mobile number is required");
    return;
  }
  if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    alert("A valid email is required");
    return;
  }
  if (!classValue) {
    alert("Class is required");
    return;
  }
  if (!collegeValue) {
    alert("College is required");
    return;
  }
  if (!examTimeValue) {
    alert("Exam time is required");
    return;
  }
  if (!examDateValue) {
    alert("Exam date is required");
    return;
  }

  const formContent = `
    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" value="${nameValue}" readonly/>
    </div>
    <div class="form-group">
      <label for="father-name">Father Name:</label>
      <input type="text" id="father-name" name="father-name" value="${fatherNameValue}" readonly/>
    </div>
    <div class="form-group">
      <label for="mobile">Mobile:</label>
      <input type="tel" id="mobile" name="mobile" value="${mobileValue}" readonly/>
    </div>
     <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" value="${mail}" readonly />
        </div>
    <div class="form-group">
      <label for="class">Class:</label>
      <input type="text" id="class" name="class" value="${classValue}" readonly/>
    </div>
    <div class="form-group">
      <label for="college">College Name:</label>
      <input type="text" id="college" name="college" value="${collegeValue}" readonly/>
    </div>
    <div class="form-group">
      <label for="exam-time">Select Exam Shift:</label>
      <input type="text" id="exam-time" name="exam-time" value="${examTimeValue}" readonly/>
    </div>
    <div class="form-group">
      <label for="exam-date">Select Exam Date:</label>
      <input type="date" id="exam-date" name="exam-date" value="${examDateValue}" readonly/>
    </div>
  `;

  const completeContent = `
    ${headerContent}
    <form>
      ${formContent}
    </form>
    ${footerContent}
  `;

  const opt = {
    margin: 0.5,
    filename: "scholarship_form.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  try {
    const element = document.createElement("div");
    element.innerHTML = completeContent;

    // Ensure the element is appended to the body for proper rendering
    document.body.appendChild(element);

    // Wait for the content to fully load/render
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pdfBlob = await html2pdf().from(element).set(opt).outputPdf("blob");

    // Remove the temporary element
    document.body.removeChild(element);

    // Save the PDF file using FileSaver.js
    saveAs(pdfBlob, "scholarship_form.pdf");

    // Upload the saved file to Firebase Storage with metadata
    const storageRefVar = storageRef(
      storage,
      `pdfs/${Date.now()}_scholarship_form.pdf`
    );
    const metadata = {
      contentType: "application/pdf",
    };
    const snapshot = await uploadBytes(storageRefVar, pdfBlob, metadata);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("PDF uploaded successfully:", downloadURL);

    // Assuming you have an anchor tag to display the link
    const pdfLink = document.getElementById("pdfLink");
    if (pdfLink) {
      pdfLink.href = downloadURL;
      pdfLink.textContent = "Click here to view/download PDF";
    } else {
      console.error("Element with ID 'pdfLink' not found.");
    }
  } catch (error) {
    console.error("Error generating or uploading PDF:", error);
    alert("Error generating or uploading PDF.");
  }
}
