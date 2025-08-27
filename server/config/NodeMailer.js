import nodemailer from "nodemailer";

const sendOTPEmail = async (to, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
        });

        const mailOptions = {
            from: `"Your App Name" <${process.env.EMAIL_USER}>`, 
            to: to, 
            subject: 'Your OTP for Account Verification', 
            html: `
                <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
                    <h2 style="color: #0056b3;">Account Verification Required</h2>
                    <p>Thank you for starting the registration process. Please use the following One-Time Password (OTP) to complete your registration:</p>
                    <p style="background-color: #f0f0f0; border-left: 5px solid #0056b3; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center;">
                        ${otp}
                    </p>
                    <p>This OTP is valid for the next <strong>10 minutes</strong>.</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888;">If you did not request this, please disregard this email.</p>
                </div>
            `,
        };

      
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email.');
    }
};

export default sendOTPEmail ;