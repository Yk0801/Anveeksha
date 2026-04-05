import https from 'https';

https.get('https://anveeksha.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const match = data.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
    if (match) {
      https.get(`https://anveeksha.vercel.app${match[1]}`, (res2) => {
        let jsData = '';
        res2.on('data', chunk => { jsData += chunk; });
        res2.on('end', () => {
          if (jsData.includes('placeholder_key')) {
            console.log('CRITICAL ERROR: Vercel used placeholder_key!!');
          } else {
            console.log('Vercel DID NOT use placeholder_key! It correctly injected the API Key!');
          }
        });
      });
    }
  });
});
