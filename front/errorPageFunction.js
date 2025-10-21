export default async function showErrorPage() {
  document.documentElement.innerHTML = `
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background: #f2f2f2;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              text-align: center;
              color: #333;
            }
            h1 {
              font-size: 5rem;
              color: #e74c3c;
            }
            p {
              font-size: 1.5rem;
            }
          </style>
        </head>
        <body>
          <div>
            <h1>500</h1>
            <p>Something went wrong!</p>
          </div>
        </body>
      `;
}
