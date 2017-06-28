// @flow

const levenshtein = require('fast-levenshtein');

/**
 * For use with Array.prototype.reduce.
 * Flattens an array of arrays by one level.
 */
const flatten = (x, y) => [...x, ...y];

/**
 * Normalize a string by lowercasing it and removing diacritics.
 * Also removes periods and forward and backward slashes.
 */
const normalize = str => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[.\/\\]/g, '')
        .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Takes a string-type bounding box and returns it as a proper type.
 */
const explodeBoundingBox = obj => {
    const [x, y, width, height] = obj.boundingBox.split(/,/).map(str => +str);
    return { x, y, width, height };
};

/**
 * Returns true if both strings have a Levenshtein distance of 3 or less.
 * Normalizes both inputs first.
 */
const matches = (a, b) => {
    const left = normalize(a);
    const right = normalize(b);
    return levenshtein.get(left, right) <= 3;
};

/**
 * Returns true if str matches any of the given candidates using
 * the Levenshtein distance.
 */
const matchesAny = (str, candidates) => candidates.some(role => matches(str, role));

/**
 * Finds the best matching name out of the candidates.
 */
const matchName = (name, candidates) => {
    const diffs = candidates
        .map(current => {
            return { name: current, distance: levenshtein.get(current, name) };
        })
        .sort((a, b) => a.distance - b.distance);

    return diffs[0].name;
};

/**
 * Finds the best matching names out of the candidates.
 * Splits the input on periods and commas first (for lists of names).
 */
const matchNames = (str, candidates) => {
    return str
        .split(/\s*[.,]\s*/)
        .filter(name => name && name.trim().length !== 0)
        .map(name => matchName(name, candidates))
        .filter(name => name);
};

const average = values => values.length ? (values.reduce((a, b) => a + b, 0) / values.length) : 0;

const median = values => {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[middle - 1] + sorted[middle]) / 2
        : sorted[middle];
};

const mergeWords = words => words.map(word => word.text).join(' ');
const sortByX = (left, right) => left.boundingBox.x - right.boundingBox.x;
const sortByY = (left, right) => left.boundingBox.y - right.boundingBox.y;

module.exports = {
    flatten,
    normalize,
    explodeBoundingBox,
    matches,
    matchesAny,
    matchName,
    matchNames,
    average,
    median,
    mergeWords,
    sortByX,
    sortByY,
};