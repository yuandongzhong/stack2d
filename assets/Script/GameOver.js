let Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        currentScoreLabel: {
            default: null,
            type: cc.Label,
        },

        bestScoreLabel: {
            default: null,
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene("GameOver", function () {
            // cc.log("Game over scene preloaded");
        });

        let bestScore = cc.sys.localStorage.getItem('score_record');
        if (bestScore === null || bestScore < Global.currentScore) {
            bestScore = Global.currentScore;
            cc.sys.localStorage.setItem('score_record', Global.currentScore);
        }

        this.currentScoreLabel.string = "Score\n" + Global.currentScore;
        this.bestScoreLabel.string = "Best\n" + bestScore;
    },

    start () {
        
    },

    restart() {
        cc.director.loadScene("Game");
    },

    // update (dt) {},
});
