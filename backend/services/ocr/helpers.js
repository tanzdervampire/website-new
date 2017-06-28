// @flow

const flatten = (x, y) => [...x, ...y];

const normalize = str => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[.\/\\]/g, '')
        .replace(/[\u0300-\u036f]/g, '');
};

module.exports = {
    flatten,
    normalize,
};