import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
        <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"/>
        <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"/>
        <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
