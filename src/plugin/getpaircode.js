import axios from 'axios';

const apiBaseUrl = 'https://ethix-md-paircode.onrender.com';

const getPairingCode = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['pair', 'paircode', 'pairingcode'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('Please provide a phone number with country code.');

    const phoneNumberMatch = text.match(/^\+(\d+)\s+(\d+)$/);
    if (!phoneNumberMatch) return m.reply('Please provide a valid phone number with country code.');

    const countryCode = phoneNumberMatch[1];
    const phoneNumber = phoneNumberMatch[2];

    try {
      await m.React('🕘');

      const response = await axios.post(apiBaseUrl, {
        countryCode: `+${countryCode}`,
        phoneNumber
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = response.data;

      if (result.pairingCode) {
        const message = `Pairing Code: ${result.pairingCode}\nStatus: ${result.status}`;
        await m.reply(message);
        await m.React('✅');
      } else {
        throw new Error('Invalid response from the server.');
      }
    } catch (error) {
      console.error('Error fetching pairing code:', error.message);
      m.reply('Error fetching pairing code.');
      await m.React('❌');
    }
  }
};

export default getPairingCode;