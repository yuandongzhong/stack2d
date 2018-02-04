let blockScript = require('Block');

cc.Class({
    extends: cc.Component,

    properties: {
        blockPrefab: {
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
    },

    onLoad () {
        this.color = {
            totalNumber: 7,
            0: '#EA4C81',
            1: '#5ABDD1',
            2: '#33A9CE',
            3: '71FEB9',
            4: 'F4FEB9',
            5: '72F7FE',
            6: '36969D',
        }

        this.blockCount = 0;
        this.prevBlockPos = 0;
        this.blockHeight = 0;
        this.combo = 0;
        this.scoreLabel.string = 0;
        this.canvasEdgeLeft = -this.node.width / 2;
        this.canvasEdgeRight = this.node.width / 2;
    
        this.movingBlock = null;                                        // the current moving block
        this.lastBrick = null;                                          // the last 'dropped' block
        this.eventController = cc.find('EventController').getComponent('RegisterEvents');

        this.createPoolFor(15);
        this.spawnBaseBlocksFor(4);     
        this.spawnNewBlock(); 
        this.setInputControl();

        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit;   
    },

    start () {
        cc.director.preloadScene("GameOver", function () {
            cc.log("Game over scene preloaded");
        });
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

    createPoolFor(quantity = 15) {
        this.blockPool = new cc.NodePool(blockScript);
        let initCount = quantity;
        for (let i = 0; i < initCount; ++i) {
            let block = cc.instantiate(this.blockPrefab);
            block.getComponent(blockScript).id = i;
            this.blockPool.put(block); 
        }
    },

    spawnBaseBlocksFor (baseBlockNumber) {
        let groundY = -this.node.height / 2;
        let block = null;
        for(let i = 0; i < baseBlockNumber; i++) {
            if (this.blockPool.size() > 0) {                // use size method to check if there're nodes available in the pool
                block = this.blockPool.get();
            } else {                                        // if not enough node in the pool, we call cc.instantiate to create node
                block = cc.instantiate(this.blockPrefab);
            }   

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

        if (this.blockPool.size() > 0) {           
            this.movingBlock = this.blockPool.get();
            // cc.log("Get 1 block from pool");
        } else {                                              
            this.movingBlock = cc.instantiate(this.blockPrefab);  
            // cc.log("Create 1 block without pool");
        }

        if (this.combo > 0) {
            this.movingBlock.color = this.lastBrick.color;
            this.movingBlock.runAction(cc.tintBy(0.1, -5, -10, 0))
        } else {
            let randomId = this.getRandomInt(this.color.totalNumber);
            this.movingBlock.color = cc.hexToColor(this.color[randomId]);
        }

        this.movingBlock.width = this.lastBrick.width;

        let moveDistance = this.node.width - this.movingBlock.width;

        if (Math.random() >= 0.5) {
            this.movingBlock.setPosition(this.canvasEdgeLeft + this.movingBlock.width/2, prevY + this.blockHeight);
            this.movingBlock.getComponent(blockScript).moveFrom('left', moveDistance);
        } else {
            this.movingBlock.setPosition(this.canvasEdgeRight - this.movingBlock.width/2, prevY + this.blockHeight);
            this.movingBlock.getComponent(blockScript).moveFrom('right', moveDistance);
        }
        this.node.addChild(this.movingBlock);
    },

    setInputControl () {
        let self = this;

        self.node.on('touchstart', function(event) {
            // cc.log("click -------------------");
            self.movingBlock.getComponent(blockScript).drop(); 
            // cc.log("drop -------------------");
            self.trimBlock();
            self.spawnNewBlock();
            // cc.log("spawn -------------------");
            // cc.log("block count: " + this.blockCount);
            // cc.log("Emit -------------------");
            self.eventController.sendEvent('tap');

        }, this);
    },

    trimBlock () {
        let block = this.movingBlock;
        let prevX = this.lastBrick.x;
        let dx = prevX - block.x;

        // Check if the block is dropped on the left or right
        // Minimum threshold: 4px -> make the game easier for the player
        if (dx != 0 && Math.abs(dx) > 4) {   
            this.combo = 0;

            // Play random drop sounds
            if (Math.random() >= 0.5) {
                cc.audioEngine.play(this.dropSound1, false, 1);
            } else {
                cc.audioEngine.play(this.dropSound2, false, 1);
            }

            // Check if the drop is dropped on 'air'; if so, then game over.
            if (Math.abs(dx) > (block.width/2 + this.lastBrick.width/2)) {
                cc.director.loadScene("GameOver");
                return; 
            }
            
            // If the block is not dropped on 'air', then trim and align the moving block
            let newWidth = block.width - Math.abs(dx);
            block.width = newWidth;
            block.x = block.x + dx/2;

        } else {            // if the block is dropped 'perfectly' (within threshold)
            this.combo += 1;
            cc.audioEngine.play(this.dropSound3, false, 0.5);
            // auto align the blocks
            block.width = this.lastBrick.width;
            block.x = prevX;
        }

        this.lastBrick = block;
        this.scoreLabel.string += 1;
    },

    kill(blockNode) {
        this.blockPool.put(blockNode);
        // cc.log("Put 1 block back to pool, id=" + blockNode.getComponent(blockScript).id);
    },
});
