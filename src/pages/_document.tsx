import Document, { Html, Head, Main, NextScript} from 'next/document'

export default class MyDocument extends Document {
    render(){
        return(
            <Html>
                <Head>
                    <link rel="shortcut icon" href="/favicon.svg" type="image/svg"/>
                    <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}