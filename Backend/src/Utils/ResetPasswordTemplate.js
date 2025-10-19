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
            .email-wrapper {
                background-color: #f5f7fa;
                padding: 40px 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
            }
            .header {
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                padding: 40px 20px;
                text-align: center;
            }
            .logo {
                color: #ffffff;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: -0.5px;
                margin: 0;
            }
            .logo-subtitle {
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                margin-top: 8px;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 24px;
                font-weight: 600;
                color: #1a202c;
                margin: 0 0 16px 0;
            }
            .text {
                font-size: 16px;
                line-height: 1.6;
                color: #4a5568;
                margin: 0 0 24px 0;
            }
            .code {
                font-size: 32px;
                font-weight: bold;
                color: #2196F3;
                text-align: center;
                letter-spacing: 4px;
                margin: 32px 0;
            }
            .footer {
                background-color: #f7fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .help-text {
                font-size: 14px;
                color: #718096;
                line-height: 1.5;
                margin: 24px 0 0 0;
            }
            .copyright {
                font-size: 12px;
                color: #a0aec0;
                margin-top: 16px;
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="container">
                <div class="header">
                    <h1 class="logo">HealthPal</h1>
                    <p class="logo-subtitle">Password Reset Request</p>
                </div>
                
                <div class="content">
                    <h2 class="greeting">Password Reset Code</h2>
                    
                    <p class="text">
                        You've requested to reset your password. Here's your 8-digit reset code:
                    </p>
                    
                    <div class="code">${code}</div>
                    
                    <p class="text">
                        Enter this code along with your new password to complete the reset process.
                        This code will expire in 15 minutes.
                    </p>
                    
                    <p class="help-text">
                        If you didn't request a password reset, you can safely ignore this email.
                        Your password will remain unchanged.
                    </p>
                </div>
                
                <div class="footer">
                    <p class="copyright">© 2025 HealthPal. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};
