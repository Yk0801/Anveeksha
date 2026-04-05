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
          if (jsData.includes('https://gwjcciiqlblhmxauuuot.supabase.co')) {
            console.log('YES: Vercel has the correct Supabase URL injected!');
          } else if (jsData.includes('https://placeholder.supabase.co')) {
            console.log('NO: Vercel used the placeholder URL! Environment variables were missing during build!');
          } else {
             console.log('Cant find either url. Heres a slice:', jsData.substring(0, 100));
          }
        });
      });
    }
  });
});
