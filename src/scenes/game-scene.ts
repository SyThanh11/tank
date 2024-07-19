import { Player } from '../objects/player'
import { Enemy } from '../objects/enemy'
import { Obstacle } from '../objects/obstacles/obstacle'
import Button from '../ui/Button'
import TWEEN_HELPER from '../helper/tweenHelper'
import Score from '../objects/Score'
import CONST from '../const/const'
import SoundManager from '../sound/SoundManager'
import SoundState from '../sound/SoundState'

export class GameScene extends Phaser.Scene {
    private map: Phaser.Tilemaps.Tilemap
    private tileset: Phaser.Tilemaps.Tileset
    private layer: Phaser.Tilemaps.TilemapLayer

    private player: Player
    private enemies: Phaser.GameObjects.Group
    private obstacles: Phaser.GameObjects.Group

    private button: Button
    private score: Score
    private scoreText: Phaser.GameObjects.Text
    private soundManager: SoundManager

    constructor() {
        super({
            key: 'GameScene',
        })

        Enemy.eventEmitter.on('enemyKilled', () => {
            this.score.addScore(CONST.PLAYER.SCORE_TO_ADD)
            this.scoreText.setText(`Score : ${this.score.getScore()}`)
        })

        Player.eventEmitter.on('diePlayer', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.score.saveScore()
                this.score.resetScore()
                this.soundManager.stopAllSound()
                this.scene.start('GameOverScene')
            })
        })

        Player.eventEmitter.on('movePlayer', () => {
            if (!this.soundManager.isMoveSoundPlaying()) {
                this.soundManager.playMoveSound()
            }
        })

        Player.eventEmitter.on('notMovePlayer', () => {
            this.soundManager.stopMoveSound()
        })
    }

    init(): void {
        this.soundManager = new SoundManager(this)
    }

    create(): void {
        // create tilemap from tiled JSON
        this.map = this.make.tilemap({ key: 'levelMap' })

        this.tileset = this.map.addTilesetImage('tiles')!
        this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0)!
        this.layer.setCollisionByProperty({ collide: true })

        this.obstacles = this.add.group({
            /*classType: Obstacle,*/
            runChildUpdate: true,
        })

        this.enemies = this.add.group({
            /*classType: Enemy*/
        })
        this.convertObjects()

        this.button = new Button({
            scene: this,
            x: 0,
            y: 0,
            texture: 'pauseIcon',
            configure: {
                sizeButtonX: 100,
                sizeButtonY: 100,
            },
            callBackHoverIn: () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this,
                    this.button,
                    0.42,
                    0.42,
                    0.8,
                    100,
                    false,
                    'Linear'
                )
            },
            callBackHoverOut: () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this,
                    this.button,
                    0.4,
                    0.4,
                    1,
                    100,
                    false,
                    'Linear'
                )
            },
            callBackClick: () => {
                this.tweens.killTweensOf(this.button)
                this.soundManager.playClickButtonSound()
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this,
                    this.button,
                    0.38,
                    0.38,
                    0.7,
                    100,
                    true,
                    'Linear',
                    () => {
                        this.scene.pause()
                        this.scene.launch('PauseScene')
                    }
                )
            },
        }).setScale(0.4)
        this.button.setScrollFactor(0, 0)
        this.button.setPosition(CONST.SCENE.MAX_WIDTH - this.button.width / 2, 43)

        this.score = new Score()
        this.scoreText = this.add.text(20, 5, `Score : ${this.score.getScore()}`, {
            fontFamily: 'Arial',
            fontSize: 50,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                stroke: true,
                fill: true,
            },
        })
        this.scoreText.setScrollFactor(0, 0)

        // collider layer and obstacles
        this.physics.add.collider(this.player, this.layer)
        this.physics.add.collider(this.player, this.obstacles)

        // collider for bullets
        this.physics.add.collider(
            this.player.getBullets(),
            this.layer,
            this.bulletHitLayer,
            undefined,
            this
        )

        this.physics.add.collider(
            this.player.getBullets(),
            this.obstacles,
            this.bulletHitObstacles,
            () => {
                this.soundManager.playHitObstacleSound()
            },
            this
        )

        this.enemies.getChildren().forEach((enemyObject: Phaser.GameObjects.GameObject) => {
            const enemy = enemyObject as Enemy
            this.physics.add.overlap(
                this.player.getBullets(),
                enemy,
                this.playerBulletHitEnemy,
                () => {
                    this.soundManager.playHitTankSound()
                },
                this
            )
            this.physics.add.overlap(
                enemy.getBullets(),
                this.player,
                this.enemyBulletHitPlayer,
                () => {
                    this.soundManager.playHitTankSound()
                }
            )

            this.physics.add.collider(
                enemy.getBullets(),
                this.obstacles,
                this.bulletHitObstacles,
                () => {
                    this.soundManager.playHitObstacleSound()
                }
            )
            this.physics.add.collider(
                enemy.getBullets(),
                this.layer,
                this.bulletHitLayer,
                undefined
            )
        }, this)

        this.cameras.main.startFollow(this.player)
    }

    update(time: number, deltaTime: number): void {
        this.player.update(time, deltaTime)

        this.enemies.getChildren().forEach((enemyObject: Phaser.GameObjects.GameObject) => {
            const enemy = enemyObject as Enemy
            enemy.update()
            if (this.player.active && enemy.active) {
                const angle = Phaser.Math.Angle.Between(
                    enemy.body.x,
                    enemy.body.y,
                    this.player.body.x,
                    this.player.body.y
                )

                enemy.getBarrel().angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
            }
        }, this)

        if (SoundState.getInstance().isSoundEnabled()) {
            this.sound.mute = false
        } else {
            this.sound.mute = true
        }
    }

    private convertObjects(): void {
        // find the object layer in the tilemap named 'objects'
        const objects = this.map.getObjectLayer('objects')?.objects as any[]

        objects.forEach((object) => {
            if (object.type === 'player') {
                this.player = new Player({
                    scene: this,
                    x: object.x,
                    y: object.y,
                })
            } else if (object.type === 'enemy') {
                const enemy = new Enemy({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    texture: 'tankRed',
                })

                this.enemies.add(enemy)
            } else {
                const obstacle = new Obstacle({
                    scene: this,
                    x: object.x,
                    y: object.y - 40,
                    texture: object.type,
                })

                this.obstacles.add(obstacle)
            }
        })
    }

    private bulletHitLayer(bullet: any): void {
        bullet.destroy()
    }

    private bulletHitObstacles(bullet: any, obstacle: any): void {
        bullet.destroy()
    }

    private enemyBulletHitPlayer(bullet: any, player: any): void {
        bullet.destroy()
        player.updateHealth()
    }

    private playerBulletHitEnemy(bullet: any, enemy: any): void {
        bullet.destroy()
        enemy.updateHealth()
    }
}
