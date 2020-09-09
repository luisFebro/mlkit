const outputs = [];

const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
    const testSetSize = 10;
    const [testSet, trainingSet] = splitDataSet(outputs, testSetSize);
    // testSet the first chunk of data limit by testSetSize;
    // trainingSet - the whole other data: 720

    const accuracy = _.chain(testSet) //  n1 refactored from
        .filter(testPoint => getKnn(trainingSet, testPoint[0]) === testPoint[3])
        .size()
        .divide(testSetSize)
        .value()

    console.log("Accuracy: ", accuracy);
}


function splitDataSet(data, testCount) {
    const shuffled = _.shuffle(data);

    const dataTest = _.slice(data, 0, testCount);
    const trainingSet = _.slice(data, testCount);

    return [dataTest, trainingSet];
}

// HELPERS
// KNN - K Nearest neighbors Algorithm
function getKnn(data, point) {
    return _.chain(data)
        .map(row => [getDistance(row[0], point), row[3]])
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
    return Math.abs(pointA - pointB);
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
*/