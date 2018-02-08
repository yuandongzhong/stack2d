// import { Glob } from '../../../../../Library/Caches/typescript/2.6/node_modules/@types/glob';

let blockScript = require('Block');
let fragmentScript = require('Fragment');
let sparkScript = require('Spark');
let Global = require('Global');

cc.Class({
    extends: cc.Component,
    properties: {
        blockPrefab: {
            default: null,
            type: cc.Prefab,
        },
        fragmentPrefab: {
            default: null,
            type: cc.Prefab,
        },  
        scoreLabel: {
            default: null,
            type: cc.Label,
        },
        dropSound1: {
            url: cc.AudioClip,
            default: null,
        },
        dropSound2: {
            url: cc.AudioClip,
            default: null,
        },
        dropSound3: {
            url: cc.AudioClip,
            default: null,
        },
        backgroundSound: {
            url: cc.AudioClip,
            default: null,
        },
        sparkParticlePrefab: {
            default: null,
            type: cc.Prefab,
        },  
        menu: {
            default: null,
            type: cc.Node,
        },

        minMoveDuration: 0.3,
        maxMoveDuration: 2.3, 
    },

    onLoad () {
        // cc.log("onLoad");

        this.menu.zIndex = 90;
        this.color = {
            totalNumber: 7,
            0: '#EA4C81',
            1: '#5ABDD1',
            2: '#33A9CE',
            3: '#71FEB9',
            4: '#F4FEB9',
            5: '#72F7FE',
            6: '#36969D',
        }

        this.blockCount = 0;
        this.prevBlockPos = 0;
        this.blockHeight = 0;
        this.combo = 0;
        this.scoreLabel.string = "";
        this.score = 0;
        this.canvasEdgeLeft = -this.node.width / 2;
        this.canvasEdgeRight = this.node.width / 2;
        this.moveDuration = 2.3;
    
        this.movingBlock = null;                                        // the current moving block
        this.lastBrick = null;                                          // the last 'dropped' block
        this.eventController = cc.find('EventController').getComponent('RegisterEvents');

        this.createBlockPoolFor(25);
        this.spawnBaseBlocksFor(5);     

        // this.soundOn = cc.sys.localStorage.getItem('sound');
        // if (this.soundOn === null) {
        //     this.soundOn = true;
        //     cc.sys.localStorage.setItem('sound', this.soundOn);
        // }

        cc.audioEngine.preload(this.backgroundSound);
    },

    start () {
        // console.log("isSoundOn" + this.isSoundOn);


        if (!Global.isGameOn) {
            // Play background when the game is firstly loaded.
            this.playBgSound();
            Global.isGameOn = true;
        } 

        let self = this;
        cc.director.preloadScene("GameOver", function () {
            self.disableInput();
            cc.log("Game over scene preloaded");
        });

        Global.currentScore = this.score;
    },


    // update (dt) {
    //     // console.log("Child count:" + this.node.childrenCount);
    //     // console.log("Pool count:" + this.blockPool.size());
    //     // console.log("Block count total:" + this.blockCount());
    // },

    // if max is 3, then expected output is: 0, 1 or 2
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    },

    createBlockPoolFor(quantity = 16) {
        // create pool for blocks
        this.blockPool = new cc.NodePool(blockScript);
        for (let i = 0; i < quantity; ++i) {
            let block = cc.instantiate(this.blockPrefab);
            block.getComponent(blockScript).id = i;
            this.blockPool.put(block); 
        }
    },

    getBlock() {
        if (this.blockPool.size() > 0) {                // use size method to check if there're nodes available in the pool
            return this.blockPool.get();
        } else {                                        // if not enough node in the pool, we call cc.instantiate to create node
            return cc.instantiate(this.blockPrefab);
        }   
    }, 

    getSpark() {
        let spark = cc.instantiate(this.sparkParticlePrefab);
        // if the spark created from scratch, then set auto remove
        spark.autoRemoveOnFinish = true;  
        return spark;
    },

    getFragment() {
        return cc.instantiate(this.fragmentPrefab);
    },

    spawnBaseBlocksFor (baseBlockNumber) {
        let groundY = -this.node.height / 2;
        let block = null;
        for(let i = 0; i < baseBlockNumber; i++) {
            block = this.getBlock();

            let randomId = this.getRandomInt(this.color.totalNumber);
            block.color = cc.hexToColor(this.color[randomId]);

            block.setPosition(0, groundY + block.height * i);
            this.node.addChild(block);
            this.blockCount += 1;
            block.getComponent(blockScript).drop();
        }
        // console.log("Spawned " + this.blockCount + " base blocks");
        this.lastBrick = block;
        this.blockHeight = block.height;
    },

    spawnNewBlock () {
        this.blockCount += 1;
        let prevY = this.lastBrick.y;
        this.movingBlock = null;
        this.movingBlock = this.getBlock();

        if (this.combo > 0) {
            // Darken the color for combos
            this.movingBlock.color = this.lastBrick.color;
            this.movingBlock.runAction(cc.tintBy(0.1, -5, -10, 0))
        } else {
            // Random color for new block
            let randomId = this.getRandomInt(this.color.totalNumber);
            // this.movingBlock.color = cc.hexToColor(this.color[randomId]);
            let newColor = cc.hexToColor(this.color[randomId]);
            
            // avoid same color
            if (newColor.r ===  this.lastBrick.color.r &&
                newColor.g ===  this.lastBrick.color.g &&
                newColor.b ===  this.lastBrick.color.b) {

                newColor.r += 0.1;
                newColor.g += -5;
                newColor.b += -10;
                this.movingBlock.color = newColor;
                // console.log("color change");
            } else {
                this.movingBlock.color = cc.hexToColor(this.color[randomId]);
            }
        }

        this.movingBlock.width = this.lastBrick.width;

        let moveDistance = this.node.width - this.movingBlock.width;

        if (Math.random() >= 0.5) {
            this.movingBlock.setPosition(this.canvasEdgeLeft + this.movingBlock.width/2, prevY + this.blockHeight);
            this.movingBlock.getComponent(blockScript).moveFrom(this.moveDuration, 'left', moveDistance);
        } else {
            this.movingBlock.setPosition(this.canvasEdgeRight - this.movingBlock.width/2, prevY + this.blockHeight);
            this.movingBlock.getComponent(blockScript).moveFrom(this.moveDuration, 'right', moveDistance);
        }
        this.node.addChild(this.movingBlock);
    },

    enableInput () {
        let self = this;
        this.node.on('touchstart', this._touchScreen,this);
        // cc.log("set");
    },

    disableInput() {
        this.node.off('touchstart', this._touchScreen,this);
    },

    _touchScreen() {
        this.movingBlock.getComponent(blockScript).drop(); 
        this.trimBlock();
        this.spawnNewBlock();
        this.eventController.sendEvent('tap');
    },

    trimBlock () {
        let self = this;
        let block = this.movingBlock;
        let prevX = this.lastBrick.x;
        let dx = prevX - block.x;

        // Check if the block is dropped on the left or right
        // threshold -> make the game easier for the player
        let threshold = this.score < 40 ? 3 : 5;

        if (Math.abs(dx) > threshold) {   
            this.combo = 0;

            // Play random drop sounds
            if (Math.random() >= 0.5) {
                this.dropSoundEngineA = cc.audioEngine.play(this.dropSound1, false, 1);
            } else {
                this.dropSoundEngineB = cc.audioEngine.play(this.dropSound2, false, 1);
            }

            // Check if the drop is dropped on 'air'; if so, then game over.
            if (Math.abs(dx) > (block.width/2 + this.lastBrick.width/2) + 2) {
                cc.director.loadScene("GameOver");
                return; 
            }
            
            // If the block is not dropped on 'air', then trim and align the moving block
            let newWidth = block.width - Math.abs(dx);
            block.width = newWidth;
            block.x = block.x + dx/2;

            // drop the fragment
            let fragment = this.getFragment();
            fragment.color = block.color;
            fragment.width = Math.abs(dx);

            let jumpAction = null;
            if (dx > 0) {
                fragment.setPosition(prevX - this.lastBrick.width/2 - fragment.width/2, block.y);
                jumpAction = cc.jumpBy(0.6, cc.p(-45, 0), 60, 1)
            } else {
                fragment.setPosition(prevX + this.lastBrick.width/2 + fragment.width/2, block.y);
                jumpAction = cc.jumpBy(0.6, cc.p(45, 0), 60, 1)
            }


            this.node.addChild(fragment);
            let spawn = cc.spawn(cc.fadeOut(0.5),
                                 cc.rotateBy(1, 360),
                                 jumpAction,
                                 cc.moveBy(3, cc.p(0, -150)));
            let kill = cc.callFunc(function() {
                fragment.getComponent(fragmentScript).kill();
            }, self);
            fragment.runAction(cc.sequence(spawn, cc.delayTime(0.5), kill));

        // if the block is dropped 'perfectly' (within threshold)
        } else {            
            this.combo += 1;
            this.sparkAt(this.lastBrick.y + this.lastBrick.height/2);
            this.dropSoundEngineC = cc.audioEngine.play(this.dropSound3, false, 0.5);
            // auto align the blocks
            block.width = this.lastBrick.width;
            block.x = prevX;

            // slow down speed for reward
            if (this.moveDuration > this.minMoveDuration) {
                if (this.score <= 10 ) {
                // do nothing
                } else if (10 < this.score <= 30) {
                    if (this.combo < 3) {
                        this.moveDuration += 0.002
                    } else {
                        this.moveDuration += 0.004
                    }
                } else if (30 < this.score < 70) {
                    if (this.combo < 3) {
                        this.moveDuration += 0.01
                    } else {
                        this.moveDuration += 0.02
                    }
                } else {
                    if (block.width > 60) {
                        if (this.combo < 3) {
                            this.moveDuration += 0.02
                        } else {
                            this.moveDuration += 0.04
                        }
                    } else {            // if block width is small, then more reward
                        this.moveDuration += 0.05
                    }
                }
            }
        }

        this.lastBrick = block;
        this.score += 1;
        this.scoreLabel.string = this.score;
        Global.currentScore = this.score;
        
        // Increase speed
        if (this.moveDuration > this.minMoveDuration) {
            if (this.score <= 10 ) {
                this.moveDuration -= 0.3 * (1 / this.score);
            } else if (10 < this.score <= 30) {
                this.moveDuration -= 0.2 * (1 / this.score);
            } else if (30 < this.score < 70) {
                this.moveDuration -= 0.008 * (1 / this.score);
            } else {
                this.moveDuration -= 0.005;
            }
        }
    },

    kill(blockNode) {
        this.blockPool.put(blockNode);
        // cc.log("Put 1 block back to pool, id=" + blockNode.getComponent(blockScript).id);
    },

    sparkAt(yPosition) {
        let sparkParticle = this.getSpark();
        sparkParticle.setPosition(0, yPosition);
        sparkParticle.zIndex = 100;
        this.node.addChild(sparkParticle);
        let killAction = cc.callFunc(function() {
            sparkParticle.getComponent(sparkScript).kill();
            // cc.log("put");
        }, this);
        sparkParticle.runAction(cc.sequence(cc.fadeOut(2), killAction));
    },

    toggleSoundOn(isOn) {
        if (isOn) {
            this.playBgSound();
        } else {
            cc.audioEngine.stop(this.bgSoundEngine);
            cc.audioEngine.uncache(this.backgroundSound);
        }
    },

    playBgSound() {
        this.bgSoundEngine = cc.audioEngine.play(this.backgroundSound, true, 0.5);
    },


    startGame() {
        this.spawnNewBlock();
        this.enableInput();
    },
});
