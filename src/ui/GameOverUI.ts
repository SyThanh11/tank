import CONST from '../const/const'
import TWEEN_HELPER from '../helper/tweenHelper'
import IContainerConstructor from '../interfaces/container.interface'
import Score from '../objects/Score'
import Button from './Button'

class GameOverUI extends Phaser.GameObjects.Container {
    private bannerOver: Phaser.GameObjects.Image
    private bannerText: Phaser.GameObjects.Image
    private overText: Phaser.GameObjects.Text
    private scoreText: Phaser.GameObjects.Text
    private highScoreText: Phaser.GameObjects.Text
    private homeButton: Button
    private replayButton: Button
    private shopButton: Button

    private score: Score = new Score()

    static eventEmitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter()

    constructor(aParams: IContainerConstructor) {
        if (!Array.isArray(aParams.children) && aParams.children !== undefined) {
            aParams.children = [aParams.children]
        }

        super(aParams.scene, aParams.x, aParams.y, aParams.children)

        this.init()

        this.scene.add.existing(this)
        Phaser.Display.Align.In.Center(
            this,
            this.scene.add.zone(
                CONST.SCENE.MAX_WIDTH / 2,
                CONST.SCENE.MAX_HEIGHT / 2,
                CONST.SCENE.MAX_WIDTH,
                CONST.SCENE.MAX_HEIGHT
            )
        )
    }

    private init(): void {
        // zone
        const bannerPauseZone = this.scene.add.zone(0, 0, 1300, 1050).setInteractive()

        this.bannerOver = this.scene.add.image(0, 0, 'bannerPause')
        this.bannerOver.setScale(0.4)
        this.bannerText = this.scene.add.image(0, 0, 'bannerPauseText')
        this.bannerText.setScale(0.4, 0.3)
        this.bannerText.setDepth(1)
        this.overText = this.createText('GAME OVER', 50)
        this.scoreText = this.createText(`SCORE: ${this.score.getScoreLocal()}`, 50)
        this.highScoreText = this.createText(`HIGH SCORE: ${this.score.getBestScore()}`, 50)
        this.homeButton = new Button({
            scene: this.scene,
            x: 0,
            y: 0,
            texture: 'homeButton',
            configure: {
                sizeButtonX: 150,
                sizeButtonY: 150,
            },
            callBackHoverIn: () => {
                this.callBackHoverIn(this.homeButton)
            },
            callBackHoverOut: () => {
                this.callBackHoverOut(this.homeButton)
            },
            callBackClick: () => {
                GameOverUI.eventEmitter.emit('startButton')
                GameOverUI.eventEmitter.emit('changeScene')

                this.callBackClick(this.homeButton, () => {
                    const fx = this.scene.cameras.main.postFX.addWipe(0.3, 1, 1)

                    this.scene.scene.transition({
                        target: 'MenuScene',
                        duration: 2000,
                        moveBelow: true,
                        onUpdate: (progress: any) => {
                            fx.progress = progress
                        },
                    })
                })
            },
        }).setScale(0.6)

        this.replayButton = new Button({
            scene: this.scene,
            x: 0,
            y: 0,
            texture: 'replayButton',
            configure: {
                sizeButtonX: 150,
                sizeButtonY: 150,
            },
            callBackHoverIn: () => {
                this.callBackHoverIn(this.replayButton)
            },
            callBackHoverOut: () => {
                this.callBackHoverOut(this.replayButton)
            },
            callBackClick: () => {
                GameOverUI.eventEmitter.emit('startButton')
                GameOverUI.eventEmitter.emit('changeScene')

                this.callBackClick(this.replayButton, () => {
                    this.scene.cameras.main.fadeOut(1000, 0, 0, 0)
                    this.scene.cameras.main.once(
                        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                        () => {
                            this.scene.scene.start('GameScene')
                        }
                    )
                })
            },
        }).setScale(0.6)
        this.shopButton = new Button({
            scene: this.scene,
            x: 0,
            y: 0,
            texture: 'shopButton',
            configure: {
                sizeButtonX: 150,
                sizeButtonY: 150,
            },
            callBackHoverIn: () => {
                this.callBackHoverIn(this.shopButton)
            },
            callBackHoverOut: () => {
                this.callBackHoverOut(this.shopButton)
            },
            callBackClick: () => {
                this.callBackClick(this.shopButton, () => {
                    GameOverUI.eventEmitter.emit('startButton')
                    GameOverUI.eventEmitter.emit('changeScene')

                    window.open(
                        'https://shopee.vn/?gad_source=1&gclid=CjwKCAjw1920BhA3EiwAJT3lScZwkRWvr0XyLa8rtQO6QwYhxSaP4cVnuDGxlj-zbwpZ_ltGp3HFqhoCWaMQAvD_BwE'
                    )
                })
            },
        }).setScale(0.6)

        // align
        Phaser.Display.Align.In.Center(this.bannerOver, this)
        Phaser.Display.Align.In.TopCenter(this.bannerText, bannerPauseZone)
        Phaser.Display.Align.In.Center(this.overText, this.bannerText, 0, -15)
        Phaser.Display.Align.In.Center(this.highScoreText, bannerPauseZone, 0, -120)
        Phaser.Display.Align.In.Center(this.scoreText, this.highScoreText, 0, 100)
        Phaser.Display.Align.In.Center(this.homeButton, bannerPauseZone, 0, 150)
        Phaser.Display.Align.In.Center(this.replayButton, bannerPauseZone, 160, 150)
        Phaser.Display.Align.In.Center(this.shopButton, bannerPauseZone, -160, 155)

        this.add(this.bannerOver)
        this.add(this.bannerText)
        this.add(this.overText)
        this.add(this.highScoreText)
        this.add(this.scoreText)
        this.add(this.homeButton)
        this.add(this.replayButton)
        this.add(this.shopButton)
    }

    private createText(text: string, fontSize: number): Phaser.GameObjects.Text {
        return new Phaser.GameObjects.Text(this.scene, 0, 0, text, {
            fontFamily: 'Arial',
            fontSize: fontSize,
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
        }).setDepth(2)
    }

    private callBackHoverIn = (button: Button) => {
        TWEEN_HELPER.tweenScaleAndAlpha(this.scene, button, 0.62, 0.62, 0.8, 100, false, 'Linear')
    }
    private callBackHoverOut = (button: Button) => {
        TWEEN_HELPER.tweenScaleAndAlpha(this.scene, button, 0.6, 0.6, 1, 100, false, 'Linear')
    }
    private callBackClick = (button: Button, onComplete?: Function) => {
        TWEEN_HELPER.tweenScaleAndAlpha(
            this.scene,
            button,
            0.58,
            0.58,
            0.7,
            100,
            true,
            'Linear',
            () => {
                onComplete && onComplete()
            }
        )
    }
}

export default GameOverUI
