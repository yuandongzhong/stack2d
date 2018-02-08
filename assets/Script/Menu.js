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
        this.soundOn = true;
        // this.soundOn = cc.sys.localStorage.getItem('sound');

        // if (this.soundOn === null) {
        //     this.soundOn = true;
        //     cc.sys.localStorage.setItem('sound', this.soundOn);
        // }

        // console.log("sound on?" + this.soundOn);

        // if (this.soundOn === true) {
        //     console.log("on image");
        //     this.soundButton.getComponent("cc.Sprite").spriteFrame = this.soundOnImg;
        // } else {
        //     console.log("off image");
        //     this.soundButton.getComponent("cc.Sprite").spriteFrame = this.soundOffImg;
        // }
    },

    start () {

    },

    clickStart() {
        this.node.runAction(cc.fadeOut(0.5));
        this.scene.startGame();
    },

    tapSoundSwitch() {

        // console.log("sound ON: " + this.soundOn);
        // this.scene.toggleSoundOn(this.soundOn);

        if (this.soundOn === true) {
            this.soundButton.getComponent("cc.Sprite").spriteFrame = this.soundOffImg;
            this.soundOn = false;
            this.scene.toggleSoundOn(this.soundOn);
            // console.log("false");
        } else {
            this.soundButton.getComponent("cc.Sprite").spriteFrame = this.soundOnImg;
            this.soundOn = true;
            this.scene.toggleSoundOn(this.soundOn);
            // console.log("true");
        }

        // cc.sys.localStorage.setItem('sound', this.soundOn);
        // console.log("sound on?" + this.soundOn);
    }, 


    // update (dt) {},
});
