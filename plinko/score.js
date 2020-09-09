const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
    const testSetSize = 10; // ADVICE: do not put this number too high if your computer is shitty, maximum like 50.
    const [testSet, trainingSet] = splitDataSet(outputs, testSetSize);
    // testSet the first chunk of data limit by testSetSize;
    // trainingSet - the whole other data: 720

    _.range(1, 15).forEach(k => { // last number (15) is not inclusive.
        const accuracy = _.chain(testSet) //  n1 refactored from
            .filter(testPoint => getKnn(trainingSet, { predictPoints: ._initial(testPoint), k }) === testPoint[3]) // testPoint[3] === bucket
            .size()
            .divide(testSetSize)
            .value()

        console.log("for each K", k ,"Accuracy: ", accuracy);
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
            const features = _.initial(row),
            const label = _.last(row),

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
    // tythagorean theorem: C² = A² + B²
    return _.chain(pointA)
        .zip(pointB) // n2
        .map(([a, b]) => (a - b) ** 2)
        .sum()
        .value() ** 0.5; // ** .5 generates the square root
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
*/