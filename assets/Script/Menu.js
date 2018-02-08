let Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        soundButton: {
            default: null,
            type: cc.Sprite,
        },
        
        soundOnImg: {
            default: null,
            type: cc.SpriteFrame,
        },

        soundOffImg: {
            default: null,
            type: cc.SpriteFrame,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scene = cc.find('Canvas').getComponent('GameScene'); 
        // cc.log('sound ' + Global.isSoundOn);
        this.soundButton.getComponent("cc.Sprite").spriteFrame = Global.isSoundOn ? this.soundOnImg : this.soundOffImg;
    },

    start () {

    },

    clickStart() {
        let fadeOutTime = 0.2
        this.node.runAction(cc.fadeOut(fadeOutTime));
        this.scene.startGame();
        this.scheduleOnce(function() {
            this.node.destroy();
        }, fadeOutTime + 0.1);
    },

    tapSoundSwitch() {

        if (Global.isSoundOn == true) {
            this.soundButton.getComponent("cc.Sprite").spriteFrame = this.soundOffImg;
            Global.isSoundOn = false;
            this.scene.toggleSoundOn(Global.isSoundOn);
            // console.log("false");
        } else {
            this.soundButton.getComponent("cc.Sprite").spriteFrame = this.soundOnImg;
            Global.isSoundOn = true;
            this.scene.toggleSoundOn(Global.isSoundOn);
            // console.log("true");
        }

        // cc.sys.localStorage.setItem('sound', this.soundOn);
        // console.log("sound on?" + this.soundOn);
    }, 


    // update (dt) {},
});
