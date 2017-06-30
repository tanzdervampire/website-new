// @flow

const { FragmentType, Role } = require('./types');
const {
    flatten,
    explodeBoundingBox,
    mergeWords,
    matchesAny,
    matchNames,
    average,
    median,
    sortByX,
    sortByY,
} = require('./helpers');

const fetch = require('node-fetch');

/**
 * Performs an OCR using Microsoft's Cognitive Services.
 * @param stream The input stream to be analyzed.
 * @param key The API key to be used.
 */
const callCognitiveServicesOcr = (stream, key) => {
    const url = `https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr?language=de&detectOrientation=true`;
    const params = {
        method: 'POST',
        accept: 'application/json',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': key,
        },
        body: stream,
    };

    return fetch(url, params)
        .then(response => response.json())
        .catch(err => console.error(err));
};

/**
 * Merges all words into a single string and converts the bounding box.
 */
const convertFragment = fragment => {
    const boundingBox = explodeBoundingBox(fragment);
    const text = mergeWords(fragment.words);
    return { boundingBox, text };
};

/**
 * Adds additional default information to a fragment.
 */
const enrichFragment = fragment => {
    return Object.assign({}, fragment, {
        type: FragmentType.UNKNOWN,
        role: undefined,
    });
};

/**
 * Calculates the average height of the given fragments.
 */
const getAverageHeight = fragments => {
    const heights = fragments
        .map(fragment => fragment.boundingBox.height);
    return average(heights);
};

/**
 * Groups the fragments into lines.
 * Lines are determined by buckets which are equally spaced with a height of the average fragment height.
 */
const reduceByLine = fragments => {
    const averageFragmentHeight = getAverageHeight(fragments);
    const getBucket = y => Math.floor(y / averageFragmentHeight);

    return (accumulated, fragment) => {
        let bucket = getBucket(fragment.boundingBox.y);

        /* If the bucket doesn't yet exist, but the previous bucket does and has only a single entry,
         * check if that other fragment and this one appear to be on roughly the same line. If they
         * are, put them together.
         * This counteracts the hard cut-off in the calculation of the bucket itself. */
        if (!accumulated[bucket] && bucket - 1 >= 0  && accumulated[bucket - 1]
            && accumulated[bucket - 1].length === 1
            && Math.abs(accumulated[bucket - 1][0].boundingBox.y - fragment.boundingBox.y) <= averageFragmentHeight / 2) {

            bucket--;
        }

        (accumulated[bucket] = accumulated[bucket] || []).push(fragment);
        return accumulated;
    };
};

/**
 * Returns an array of arrays of objects of the following schema:
 *
 *  {
 *      boundingBox: { x: Number, y: Number, width: Number, height: Number },
 *      text: String,
 *      type: FragmentType,
 *      role?: String,
 *  }
 *
 * The array itself is sorted on the y-axis from top (y = 0) to bottom (y = max).
 *
 * Each sub-array represents a line after grouping them by their y-value based on
 * the average fragment height. The fragments inside the sub-arrays are sorted by
 * their x-value.
 */
const convertCognitiveServicesResponse = response => {
    if (!response.regions) {
        return [];
    }

    const fragments = response.regions
        /* We are not interested in regions, so remove them. */
        .map(region => region.lines)
        /* Flatten the resulting array to get an array of fragments. */
        .reduce(flatten, [])
        /* Transform each fragment into something easier to handle… */
        .map(convertFragment)
        /* … and add some of our own properties. */
        .map(enrichFragment);

    const data = [...fragments]
        /* Sort by y-value so the following reducer always goes top to bottom. */
        .sort(sortByY)
        /* Calculate the types of each fragment. */
        .map(assignType)
        /* Group fragments into lines by buckets. */
        .reduce(reduceByLine(fragments), [])
        /* Remove lines that hold no fragment. */
        .filter(line => line)
        /* Sort fragments within a line by x-value. */
        .map(line => [...line].sort(sortByX));

    return data
        .filter(removeNoise(data));
};

/**
 * Assigns a type to each fragment.
 */
const assignType = fragment => {
    const name = fragment.text;

    /* Rule out some noise. */
    if (matchesAny(name, ['Tanz der', 'Vampire', 'Musical'])) {
        return Object.assign({}, fragment, { type: FragmentType.OTHER });
    }

    const matchingRoles = Object.keys(Role)
        .filter(role => matchesAny(name, [role, ...Role[role].synonyms]));
    if (matchingRoles.length !== 0) {
        return Object.assign({}, fragment, {
            type: FragmentType.ROLE,
            role: matchingRoles[0],
        });
    }

    /* If we haven't found anything else, assume it's a name or list of names. */
    return Object.assign({}, fragment, { type: FragmentType.NAME });
};

/**
 * Returns a filter function to get rid of some noise.
 */
const removeNoise = data => {
    const roleLines = data
        .filter(line => line.some(fragment => fragment.type === FragmentType.ROLE));
    const first = (roleLines.length !== 0 && roleLines[0].length !== 0) ? roleLines[0][0] : null;

    return line => {
        return !first || line.some(fragment => fragment.boundingBox.y >= first.boundingBox.y);
    };
};

const lineToAverageY = line => {
    const ys = line
        .map(fragment => fragment.boundingBox.y + 0.5 * fragment.boundingBox.height);
    return average(ys);
};

/**
 * Returns the median spacing on the y-axis between name fragments.
 *
 */
const getMedianLineSpacing = data => {
    const spaces = data
        /* We are only interested in name fragments. */
        .map(line => line.filter(fragment => fragment.type === FragmentType.NAME))
        /* Filter out lines that no longer contain a fragment. */
        .filter(line => line)
        /* Average the y-coordinate of the fragments per line. */
        .map(lineToAverageY)
        /* Now subtract each coordinate from its successor. */
        .map((y, i, all) => y - (all[i-1] || y))
        /* Remove the first entry as it will always be 0. */
        .filter((_, i) => i !== 0);

    return median(spaces);
};

const findPersonsForPrimaryRole = (data, role) => {
    const lines = data
        .filter(line => line.some(fragment => fragment.role === role));

    if (lines.length === 0) {
        return [];
    }

    const roleFragment = lines[0]
        .filter(fragment => fragment.role === role)
        [0];

    return lines[0]
    /* We are only interested in names. */
        .filter(fragment => fragment.type === FragmentType.NAME)
        /* Make sure the name is reasonably close to the role fragment. */
        .filter(fragment => {
            return fragment.boundingBox.x <= roleFragment.boundingBox.y + 1.5 * roleFragment.boundingBox.width;
        });
};

const findPersonsforSecondaryRole = (data, role) => {
    const secondaryRoles = Object.keys(Role).filter(role => !Role[role].primary);
    const medianLineSpacing = getMedianLineSpacing(data);

    let foundRoleFragment = false;
    let foundNextRoleFragment = false;
    let exceededSpacing = false;
    const lines = data
        /* First we filter lines between role fragments as much as we can. */
        .filter(line => {
            foundNextRoleFragment |= foundRoleFragment
                && line.some(fragment => fragment.role && secondaryRoles.includes(fragment.role));
            foundRoleFragment |= line.some(fragment => fragment.role === role);
            return foundRoleFragment && !foundNextRoleFragment;
        })
        /* Now we also pay attention to line spacing as the next role fragment may not have been recognized. */
        .filter((line, i, all) => {
            /* We always take the first two lines since it includes the role fragment, but sometimes
             * the conductor appears on the same line so we need to keep it. For the other cases the
             * second line is the first line of name fragments. */
            if (i === 0 || i === 1) {
                return true;
            }

            const last = lineToAverageY(all[i - 1]);
            const current = lineToAverageY(line);
            exceededSpacing |= Math.abs(last - current) > 2 * medianLineSpacing;
            return !exceededSpacing;
        });

    if (lines.length === 0) {
        return [];
    }

    const roleFragment = lines[0]
        .filter(fragment => fragment.role === role)
        [0];

    return lines
        .reduce(flatten, [])
        .filter(fragment => fragment.type === FragmentType.NAME)
        /* Make sure to only catch fragments reasonably close to the role fragment. */
        .filter(fragment => {
            const centerRoleFragment = roleFragment.boundingBox.x + roleFragment.boundingBox.width / 2;
            const centerFragment = fragment.boundingBox.x + fragment.boundingBox.width / 2;
            return Math.abs(centerRoleFragment - centerFragment) <= 1.5 * roleFragment.boundingBox.width;
        });
};

const extractCast = (data, roleToPersons) => {
    return Object.keys(Role)
        .map(role => {
            const nameFragments = Role[role].primary
                ? findPersonsForPrimaryRole(data, role)
                : findPersonsforSecondaryRole(data, role);

            const candidates = roleToPersons
                .filter(obj => obj.role === role)
                [0]
                .persons
                .map(person => person.name);

            return nameFragments
                .map(fragment => matchNames(fragment.text, candidates))
                .reduce(flatten, [])
                .filter((name, i, all) => all.indexOf(name) === i)
                .filter((name, i) => !Role[role].singular || i === 0 )
                .map(name => { return { role, name }; });
        })
        .reduce(flatten, []);
};

module.exports = { callCognitiveServicesOcr, convertCognitiveServicesResponse, extractCast };