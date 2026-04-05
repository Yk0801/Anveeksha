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
          if (jsData.includes('send-inquiry')) {
            console.log('YES: send-inquiry is in the live Vercel code!');
          } else {
            console.log('NO: send-inquiry is MISSING from the live Vercel code!');
          }
        });
      });
    } else {
      console.log('No module script found!');
    }
  });
});
