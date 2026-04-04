const url = 'https://gwjcciiqlblhmxauuuot.supabase.co/functions/v1/send-inquiry';
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Test User', email: 'yukthasri0801@gmail.com', phone: '1234567890', message: 'test message' })
})
.then(async res => {
  console.log("STATUS:", res.status);
  console.log("RESPONSE:", await res.text());
})
.catch(err => console.error("FETCH ERROR:", err));
