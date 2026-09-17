export const generateHtml = (otp) => {

    const htmlTemplate = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>OTP Verification</title>
</head>

<body style="
    margin:0;
    padding:0;
    background-color:#f4f4f4;
    font-family:Arial, sans-serif;
">

    <table width="100%" cellpadding="0" cellspacing="0"
        style="background-color:#f4f4f4; padding:20px 0;">

        <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0"
                    style="
                        background:#ffffff;
                        border-radius:10px;
                        overflow:hidden;
                    ">

                    <!-- Header -->
                    <tr>
                        <td align="center"
                            style="
                                background:#2563eb;
                                padding:30px;
                            ">

                            <h1 style="
                                color:#ffffff;
                                margin:0;
                            ">
                                OTP Verification
                            </h1>

                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:40px 30px;">

                            <h2 style="
                                margin-top:0;
                                color:#333;
                            ">
                                Hello,
                            </h2>

                            <p style="
                                font-size:16px;
                                color:#555;
                                line-height:1.6;
                            ">
                                Use the following One-Time Password (OTP)
                                to complete your verification process:
                            </p>

                            <!-- OTP -->
                            <div style="
                                text-align:center;
                                margin:30px 0;
                            ">

                                <span style="
                                    display:inline-block;
                                    background:#f3f4f6;
                                    border:2px dashed #2563eb;
                                    color:#2563eb;
                                    font-size:32px;
                                    font-weight:bold;
                                    letter-spacing:8px;
                                    padding:15px 30px;
                                    border-radius:8px;
                                ">
                                    ${otp}
                                </span>

                            </div>

                            <p style="
                                font-size:15px;
                                color:#666;
                            ">
                                This OTP will expire in
                                <strong>5 minutes</strong>.
                            </p>

                            <p style="
                                font-size:14px;
                                color:#888;
                                line-height:1.6;
                            ">
                                If you did not request this code,
                                please ignore this email.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center"
                            style="
                                background:#f8f8f8;
                                padding:20px;
                            ">

                            <p style="
                                margin:0;
                                color:#999;
                                font-size:12px;
                            ">
                                © 2026 Social Media App
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>

    </table>

</body>

</html>
    `;

    return htmlTemplate;
};