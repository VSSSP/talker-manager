const fs = require('fs').promises;

async function readTalkers() {
    const read = await fs.readFile('./talker.json', 'utf8');
    return JSON.parse(read);
}

async function writeTalker(talker) {
    await fs.writeFile('./talker.json', JSON.stringify(talker));
}

module.exports = {
    readTalkers,
    writeTalker,
};
