import { Bullet } from './bullet'
import CONST from '../const/const'
import IContainerConstructor from '../interfaces/container.interface'
import HELPER from '../helper/helper'
import SoundManager from '../sound/SoundManager'

export class Player extends Phaser.GameObjects.Container {
    body: Phaser.Physics.Arcade.Body
    static eventEmitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter()

    // sounds
    private soundManager: SoundManager

    // variables
    private health: number
    private lastShoot: number
    private speed: number

    // children
    private tank: Phaser.GameObjects.Image
    private barrel: Phaser.GameObjects.Image
    private lifeBar: Phaser.GameObjects.Graphics
    private arrow: Phaser.GameObjects.Image

    // game objects
    private bullets: Phaser.GameObjects.Group

    // input
    private keyBoardA: Phaser.Input.Keyboard.Key | undefined
    private keyBoardD: Phaser.Input.Keyboard.Key | undefined
    private keyBoardW: Phaser.Input.Keyboard.Key | undefined
    private keyBoardS: Phaser.Input.Keyboard.Key | undefined

    // handle
    private isShooting = false
    private targetBarrelAngle = 0

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    constructor(aParams: IContainerConstructor) {
        if (!Array.isArray(aParams.children) && aParams.children !== undefined) {
            aParams.children = [aParams.children]
        }

        super(aParams.scene, aParams.x, aParams.y, aParams.children)

        this.initImage()
        this.soundManager = new SoundManager(this.scene)
        this.scene.add.existing(this)
    }

    private initImage() {
        // variables
        this.health = 1
        this.lastShoot = 0
        this.speed = CONST.PLAYER.TANK_SPEED_MOVING

        // image
        this.tank = this.scene.add.image(0, 0, 'hullRed')
        this.tank.setOrigin(0.5, 0.5)
        this.tank.setDepth(0)
        this.tank.angle = 180

        this.barrel = this.scene.add.image(0, 0, 'gunRed')
        this.barrel.setOrigin(0.5, 0.7)
        this.barrel.setDepth(1)
        this.barrel.angle = 180

        this.lifeBar = this.scene.add.graphics()
        this.redrawLifebar()

        this.arrow = this.scene.add.image(0, 0, 'arrow')
        this.arrow.setOrigin(0.5, 0.5)
        this.arrow.setScale(1.3)
        this.setDepth(1)
        this.arrow.angle = 90

        // game objects
        this.bullets = this.scene.add.group({
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        // input
        this.keyBoardA = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyBoardD = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keyBoardW = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keyBoardS = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)

        // register event
        this.registerEvent()

        // physics
        this.scene.physics.world.enable(this)
        this.setSize(145, 230)
        this.body.setSize(150, 225)

        // container
        this.add(this.tank)
        this.add(this.barrel)
        this.add(this.lifeBar)
        this.add(this.arrow)

        this.setScale(0.4)
    }

    update(time: number, deltaTime: number): void {
        if (this.active) {
            this.handleInput(deltaTime)
            this.handleRotatingBarrel(deltaTime)
            this.handleShooting()
        } else {
            this.destroy()
            this.barrel.destroy()
            this.lifeBar.destroy()
        }
    }

    private registerEvent() {
        window.addEventListener('contextmenu', (event: Event) => {
            event.preventDefault()
        })

        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown() && pointer.isDown) {
                this.isShooting = true
            }
        })
        this.scene.input.on('pointerup', () => {
            this.isShooting = false
        })
    }

    private handleInput(deltaTime: number) {
        this.arrow.rotation = this.tank.rotation - Phaser.Math.DegToRad(90)

        const arrowOffsetX = Math.cos(this.arrow.rotation) * 170
        const arrowOffsetY = Math.sin(this.arrow.rotation) * 170

        this.arrow.setPosition(this.tank.x + arrowOffsetX, this.tank.y + arrowOffsetY)

        if (this.keyBoardA?.isDown) {
            this.tank.rotation -= (CONST.PLAYER.TANK_SPEED_TURN * deltaTime) / 1000
        } else if (this.keyBoardD?.isDown) {
            this.tank.rotation += (CONST.PLAYER.TANK_SPEED_TURN * deltaTime) / 1000
        }

        if (this.keyBoardW?.isDown) {
            this.scene.physics.velocityFromRotation(
                this.tank.rotation - Math.PI / 2,
                this.speed,
                this.body.velocity
            )

            Player.eventEmitter.emit('movePlayer')
        } else if (this.keyBoardS?.isDown) {
            this.scene.physics.velocityFromRotation(
                this.tank.rotation - Math.PI / 2,
                -this.speed,
                this.body.velocity
            )

            Player.eventEmitter.emit('movePlayer')
        } else {
            this.body.setVelocity(0, 0)

            Player.eventEmitter.emit('notMovePlayer')
        }
    }

    private handleRotatingBarrel(deltaTime: number): void {
        this.scene.input.activePointer.updateWorldPoint(this.scene.cameras.main)
        this.targetBarrelAngle = HELPER.normalizeAngleDegree(
            Phaser.Math.Angle.Between(
                this.x,
                this.y,
                this.scene.input.activePointer.worldX,
                this.scene.input.activePointer.worldY
            ) *
                Phaser.Math.RAD_TO_DEG +
                90
        )
        const currentAngleNormalization = HELPER.normalizeAngleDegree(this.barrel.angle)
        const targetAngleNormalization = HELPER.normalizeAngleDegree(this.targetBarrelAngle)
        const diff = HELPER.differenceBetweenAngles(
            currentAngleNormalization,
            targetAngleNormalization
        )
        if (currentAngleNormalization == targetAngleNormalization) return
        this.barrel.angle = HELPER.normalizeAngleDegree(
            this.barrel.angle + ((diff * deltaTime) / 1000) * CONST.PLAYER.ROTATION_BARREL_SPEED
        )
    }

    private handleShooting(): void {
        if (this.isShooting && this.scene.time.now > this.lastShoot) {
            this.soundManager.playExplosionSound()

            this.isShooting = false
            this.scene.cameras.main.shake(20, 0.005)
            this.scene.tweens.add({
                targets: this,
                props: { alpha: 0.8 },
                delay: 0,
                duration: 5,
                ease: 'Power1',
                easeParams: null,
                hold: 0,
                repeat: 0,
                repeatDelay: 0,
                yoyo: true,
                paused: false,
            })

            if (this.bullets.getLength() < 10) {
                const bullet = new Bullet({
                    scene: this.scene,
                    rotation: this.barrel.rotation,
                    x:
                        this.x +
                        Math.cos(this.barrel.rotation - Phaser.Math.DegToRad(90)) *
                            CONST.PLAYER.BARREL_RADIUS,
                    y:
                        this.y +
                        Math.sin(this.barrel.rotation - Phaser.Math.DegToRad(90)) *
                            CONST.PLAYER.BARREL_RADIUS,
                    texture: 'bulletTank',
                })
                bullet.setScale(0.5)
                bullet.body.setSize(20, 20)

                this.bullets.add(bullet)

                this.lastShoot = this.scene.time.now + 80
            }
        }
    }

    private redrawLifebar(): void {
        this.lifeBar.clear()
        this.lifeBar.fillStyle(0xe66a28, 1)
        this.lifeBar.fillRect(-50, 120, 100 * this.health, 15)
        this.lifeBar.lineStyle(2, 0xffffff)
        this.lifeBar.strokeRect(-50, 120, 100, 15)
        this.lifeBar.setDepth(1)
        this.lifeBar.setScale(3, 2)
    }

    public updateHealth(): void {
        if (this.health > 0) {
            this.health -= 0.05
            this.redrawLifebar()
        } else {
            this.health = 0
            this.active = false
            Player.eventEmitter.emit('diePlayer')
        }
    }
}
