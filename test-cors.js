import https from 'https';

const options = {
  hostname: 'gwjcciiqlblhmxauuuot.supabase.co',
  port: 443,
  path: '/functions/v1/send-inquiry',
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://anveeksha.vercel.app',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'authorization, x-client-info, apikey, content-type'
  }
};

const req = https.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
});
req.end();
