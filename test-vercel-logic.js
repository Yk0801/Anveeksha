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
          const index = jsData.indexOf('send-inquiry');
          if (index !== -1) {
            console.log('CODE AROUND SEND-INQUIRY:');
            console.log(jsData.substring(index - 100, index + 200));
          }
        });
      });
    }
  });
});
