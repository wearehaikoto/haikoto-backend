// Source: https://github.com/moroshko/elo.js

class EloRatingAlgorithm {
    getRatingDelta(myRating, opponentRating, mySurveyResult) {
        if ([0, 0.5, 1].indexOf(mySurveyResult) === -1) {
            return null;
        }

        var myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

        return Math.round(32 * (mySurveyResult - myChanceToWin));
    }

    getNewRating(myRating, opponentRating, mySurveyResult) {
        return myRating + this.getRatingDelta(myRating, opponentRating, mySurveyResult);
    }
}

module.exports = new EloRatingAlgorithm();
