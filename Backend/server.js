const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Logging endpoint
app.post('/log', (req, res) => {
    const data = req.body; // {userId, round, holeId, result}
    console.log('Click logged:', data);

    // Append data to logs.json
    fs.readFile('logs.json', (err, fileData) => {
        let logs = [];
        if (!err && fileData.length) logs = JSON.parse(fileData);
        logs.push(data);
        fs.writeFile('logs.json', JSON.stringify(logs, null, 2), err => {
            if(err) console.log('File write error:', err);
        });
    });

    res.send({status: 'success'});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
