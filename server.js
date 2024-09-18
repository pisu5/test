// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // use your email service
  auth: {
    user: "prai47465@.com",
    pass: "",
  },
});
app.post("/submit", (req, res) => {
  const { name, email } = req.body;
  // Generate PDF
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "output.pdf");
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(16).text("User Form Submission", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${name}`);
  doc.fontSize(14).text(`Email: ${email}`);
  doc.end();
  doc.on("finish", () => {
    // Send email with PDF attachment
    const mailOptions = {
      from: "your_email@example.com",
      to: "recipient@example.com",
      subject: "User Form Submission",
      text: "Please find the attached form submission.",
      attachments: [
        {
          filename: "form.pdf",
          path: filePath,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).json({ message: "Form submitted successfully!" });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});