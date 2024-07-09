export const getTokenHtml = (kode: number): string => `
    <body style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; text-align: center; margin: 0; padding: 0;">
        <div class="container"
            style="max-width: 100%; margin: 50px auto; background-color: #ffffff; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Kode Verifikasi</p>
            <h1>${kode}</h1>
        </div>
    </body>
`