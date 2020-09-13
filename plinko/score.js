const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
    const testSetSize = 50; // ADVICE: do not put this number too high if your computer is shitty, maximum like 50.
    const k = 10;

    // testSet the first chunk of data limit by testSetSize;
    // trainingSet - the whole other data

    _.range(0, 3).forEach(feature => { // last number (3) is not inclusive.
        const data = _.map(outputs, row => [row[feature], _.last(row)]);
        const [testSet, trainingSet] = splitDataSet(minMax(data, 1), testSetSize);

        const accuracy = _.chain(testSet) //  n1 refactored from
            .filter(testPoint => getKnn(trainingSet, { predictPoints: _.initial(testPoint), k }) === _.last(testPoint))
            .size()
            .divide(testSetSize)
            .value()

        console.log("for each feature", feature ,"Accuracy: ", accuracy);
    })
}


function splitDataSet(data, testCount) {
    const shuffled = _.shuffle(data);

    const dataTest = _.slice(data, 0, testCount);
    const trainingSet = _.slice(data, testCount);

    return [dataTest, trainingSet];
}

// HELPERS
// KNN - K Nearest neighbors Algorithm
function getKnn(data, options = {}) {
    // for now, predictPoints got 3 values,
    const { predictPoints, k } = options;

    return _.chain(data)
        .map(row => {
            const features = _.initial(row);
            const label = _.last(row);

            return [
                getDistance(features, predictPoints),
                label,
            ]
        })
        .sortBy(row => row[0])
        .slice(0, k)
        .countBy(row => row[1])
        .toPairs()
        .sortBy(row => row[1])
        .last()
        .first()
        .parseInt()
        .value()
}

// pointB - predictionPoint
function getDistance(pointA, pointB) {
    // For 3D multi dimensional (features) KNN.
    // pythagorean theorem: C² = A² + B²
    return _.chain(pointA)
        .zip(pointB) // n2
        .map(([a, b]) => (a - b) ** 2)
        .sum()
        .value() ** 0.5; // ** .5 generates the square root
}

// MIN-MAX NORMALIZATION
// labels are never normalized.
// This is for normalization. generate numbers from 0 to 1.0
// the highest number will be 1. the lowest 0.
// n3. usage
function minMax(data, featureCount) {
    const clonedData = _.cloneDeep(data);

    for(let i = 0; i < featureCount; i++) {
        const column = clonedData.map(row => row[i]); // each column of feature: drop pos, bounceness, ball size
        const min = _.min(column);
        const max = _.max(column);

        // applying to each column the normalization result:
        for(let j = 0; j < clonedData.length; j++) {
            clonedData[j][i] = (clonedData[j][i] - min) / (max - min); // n5 formula
        }
    }

    return clonedData;
}

// END HELPERS


/* COMMENTS
n1:
// let numberCorrect = 0;
// for(let i = 0; i < testSet.length; i++) {
//     const predictionPoint = testSet[i][0];
//     const bucket = getKnn(trainingSet, predictionPoint);
//     const testBucket = testSet[i][3];

//     if(bucket === testBucket) {
//         numberCorrect++;
//     }
// }

n2: put two distinctive values from the same position together:
a= [10, 20];
b = [1, 2];
zip == [[10, 1], [20, 2]]
This is to calculate the pythagorean theorem

n3:
const data = [
  [50, 2],
  [25, 2],
  [10, 3],
];
output:
0: (2) [1, 2]
1: (2) [0.375, 2]
2: (2) [0, 3]

n5:
X (new) = (X - Xmin) / (Xmax - Xmin)

*/