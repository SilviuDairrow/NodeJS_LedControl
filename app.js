const express = require('express');
const bodyParser = require('body-parser');
const Gpio = require('onoff').Gpio;
const cors = require('cors');

const app = express();
const led = new Gpio(2, 'out');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('/var/www/html/'));

app.post('/toggle', (req, res) => {
    console.log('Toggle request received');
    led.writeSync(led.readSync() ^ 1);

    console.log('LED state:', led.readSync());
    res.json({ status: 'success', state: led.readSync() });
});

app.post('/Countdown', async (req, res) => {
    let NrPrimit = req.body.number;
    let NrInitial = NrPrimit;
    console.log('LED Countdown time: ', NrPrimit);

    try {
        // Introduce a delay to allow the response to be sent before starting the countdown
        await sleep(500);

        // Start the countdown
        while (NrPrimit > 0) {
            led.writeSync(led.readSync() ^ 1);
            await sleep(500);
            led.writeSync(led.readSync() ^ 1);
            await sleep(500);
            --NrPrimit;
        }

        console.log('LED Countdown s-a terminat, total blinks: ', NrInitial);

        // Respond to the request once the countdown is finished
        res.json({ status: 'success', message: 'LED countdown complete' });
    } catch (error) {
        console.error('Error during LED countdown:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

const port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}