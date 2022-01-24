const { Router } = require('express');
const { readTalkers, writeTalker } = require('./fsHelpers');

const NAME_MIN_LENGHT = 3;
const MIN_AGE = 18;

const getTalker = async (_req, res) => {
    const talkers = await readTalkers();
      if (!talkers) {
        return res.status(200).json([]);
      }
      res.status(200).send(talkers);
  };

const getTalkerById = async (req, res) => {
    const { id } = req.params;
    const talkers = await readTalkers();
    const findTalker = talkers.find((talker) => talker.id === +id);
    return findTalker ? res.status(200).send(findTalker) 
        : res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
};

function checkToken(token) {
    const tokenCheck = /^[a-zA-Z0-9]{16}$/;
    return tokenCheck.test(token);
}

const tokenValidation = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: 'Token não encontrado' });
    }
    if (!checkToken(authorization)) {
        return res.status(401).json({ message: 'Token inválido' });
    }
    next();
};

const nameValidation = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'O campo "name" é obrigatório' });
    }
    if (name.length < NAME_MIN_LENGHT) {
        return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
    next();
};

const ageValidation = (req, res, next) => {
    const { age } = req.body;
    if (!age) {
        return res.status(400).json({ message: 'O campo "age" é obrigatório' });
    }
    if (age < MIN_AGE) {
        return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
    }
    next();
};

function dataValidation(data) {
    const dataCheck = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    return dataCheck.test(data);
    // https://www.guj.com.br/t/resolvido-como-validar-data-com-java-script/276656
}

const talkerObjectValidation = (req, res, next) => {
    const { talk } = req.body;
    if (!talk || (!talk.rate && talk.rate !== 0) || !talk.watchedAt) {
        return res.status(400)
        .json({ message:
            'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
        }
        next();
    };

const talkValidation = (req, res, next) => {
        const { talk } = req.body;
        if (talk.watchedAt && !dataValidation(talk.watchedAt)) {
            return res.status(400)
                .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
        }
        if (talk.rate < 1 || talk.rate > 5) {
            return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
        }
        next();
    };

const createTalker = async (req, res) => {
    const talkers = await readTalkers();
    const newTalker = { ...req.body, id: talkers.length + 1 };
    talkers.push(newTalker);
    await writeTalker(talkers);
    res.status(201).send(newTalker);
};

const editTalker = async (req, res) => {
    const { id } = req.params;
    const talkers = await readTalkers();
    const talkerToEdit = { ...req.body, id: +id };
    const talkersWithoutEditedTalker = talkers.filter((talker) => talker.id !== +id);
    const editedListOfTalkers = [...talkersWithoutEditedTalker, talkerToEdit];
    await writeTalker(editedListOfTalkers);
    res.status(200).send(talkerToEdit);
};

const deleteTalker = async (req, res) => {
    const { id } = req.params;
    const talkers = await readTalkers();
    const talkersWithoutDeletedTalker = talkers.filter((talker) => talker.id !== +id);
    await writeTalker(talkersWithoutDeletedTalker);
    res.status(204).send();
};

const searchTalker = async (req, res) => {
    const { q } = req.query;
    const talkers = await readTalkers();
    const talkerFound = talkers
        .filter((talker) => talker.name.toLowerCase().includes(String(q).toLowerCase()));
    res.status(200).send(talkerFound);
};

const route = Router();

route.get('/search',
tokenValidation,
searchTalker);

route.get('/', getTalker);
route.get('/:id', getTalkerById);

route.post('/',
tokenValidation,
nameValidation,
ageValidation,
talkerObjectValidation,
talkValidation,
createTalker);

route.put('/:id',
tokenValidation,
nameValidation,
ageValidation,
talkerObjectValidation,
talkValidation,
editTalker);

route.delete('/:id',
tokenValidation,
deleteTalker);

module.exports = route;