export const getResetPasswordTemplate = (code) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #f5f7fa;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                color: #2196F3;
                font-weight: bold;
            }
            .code-container {
                background-color: #f8f9fa;
                border-radius: 6px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            }
            .code {
                font-size: 32px;
                font-weight: bold;
                color: #1976D2;
                letter-spacing: 4px;
            }
            .text {
                color: #4a5568;
                line-height: 1.6;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                color: #718096;
                font-size: 14px;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">HealthPal</div>
            </div>
            
            <p class="text">Hello,</p>
            
            <p class="text">We received a request to reset your password. Here is your password reset code:</p>
            
            <div class="code-container">
                <div class="code">${code}</div>
            </div>
            
            <p class="text">This code will expire in 15 minutes. If you didn't request a password reset, please ignore this email.</p>
            
            <div class="footer">
                <p>© 2025 HealthPal. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};