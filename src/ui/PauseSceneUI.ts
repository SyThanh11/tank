import CONST from '../const/const'
import TWEEN_HELPER from '../helper/tweenHelper'
import IContainerConstructor from '../interfaces/container.interface'
import SoundState from '../sound/SoundState'
import Button from './Button'

class PauseSceneUI extends Phaser.GameObjects.Container {
    private bannerPause: Phaser.GameObjects.Image
    private bannerText: Phaser.GameObjects.Image
    private pauseText: Phaser.GameObjects.Text
    private buttonContinue: Button
    private buttonReplay: Button
    private buttonExit: Button
    private buttonMusic: Button

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

    private init() {
        this.bannerPause = this.scene.add.image(0, 0, 'bannerPause')
        this.bannerPause.setScale(0.4)

        this.bannerText = this.scene.add.image(0, 0, 'bannerPauseText')
        this.bannerText.setScale(0.4, 0.3)
        this.bannerText.setDepth(1)

        this.pauseText = this.scene.add
            .text(0, 0, 'PAUSE', {
                fontFamily: 'Arial',
                fontSize: '50px',
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
            .setDepth(2)

        this.buttonContinue = this.createButtonWithText(
            'CONTINUE',
            () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonContinue,
                    0.45,
                    0.35,
                    0.8,
                    100,
                    false,
                    'Linear'
                )
            },
            () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonContinue,
                    0.4,
                    0.3,
                    1,
                    100,
                    false,
                    'Linear'
                )
            },
            () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonContinue,
                    0.38,
                    0.28,
                    0.7,
                    100,
                    true,
                    'Linear',
                    () => {
                        this.scene.scene.stop('PauseScene')
                        this.scene.scene.resume('GameScene')
                    }
                )
            }
        )
        this.buttonContinue.setScale(0.4, 0.3)

        this.buttonReplay = this.createButtonWithText(
            'RESTART',
            () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonReplay,
                    0.45,
                    0.35,
                    0.8,
                    100,
                    false,
                    'Linear'
                )
            },
            () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonReplay,
                    0.4,
                    0.3,
                    1,
                    100,
                    false,
                    'Linear'
                )
            },
            () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonReplay,
                    0.38,
                    0.28,
                    0.7,
                    100,
                    true,
                    'Linear',
                    () => {
                        this.scene.scene.stop('PauseScene')
                        this.scene.scene.stop('GameScene')
                        this.scene.scene.start('GameScene')
                    }
                )
            }
        )
        this.buttonReplay.setScale(0.4, 0.3)

        this.buttonExit = new Button({
            scene: this.scene,
            x: 0,
            y: 0,
            texture: 'exitButton',
            configure: {
                sizeButtonX: 250,
                sizeButtonY: 250,
            },
            callBackHoverIn: () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonExit,
                    0.32,
                    0.32,
                    0.8,
                    100,
                    false,
                    'Linear'
                )
            },
            callBackHoverOut: () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonExit,
                    0.3,
                    0.3,
                    1,
                    100,
                    false,
                    'Linear'
                )
            },
            callBackClick: () => {
                PauseSceneUI.eventEmitter.emit('startButton')
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonExit,
                    0.3,
                    0.3,
                    0.7,
                    100,
                    true,
                    'Linear',
                    () => {
                        this.scene.scene.stop('PauseScene')
                        this.scene.scene.resume('GameScene')
                    }
                )
            },
        })
        this.buttonExit.setScale(0.3)

        this.buttonMusic = new Button({
            scene: this.scene,
            x: 0,
            y: 0,
            texture: SoundState.getInstance().isSoundEnabled() ? 'musicButtonOn' : 'musicButtonOff',
            configure: {
                sizeButtonX: 150,
                sizeButtonY: 150,
            },
            callBackHoverIn: () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonMusic,
                    0.52,
                    0.52,
                    0.8,
                    100,
                    false,
                    'Linear'
                )
            },
            callBackHoverOut: () => {
                TWEEN_HELPER.tweenScaleAndAlpha(
                    this.scene,
                    this.buttonMusic,
                    0.5,
                    0.5,
                    1,
                    100,
                    false,
                    'Linear'
                )
            },
            callBackClick: () => {
                PauseSceneUI.eventEmitter.emit('startButton')
                if (this.buttonMusic.getImage().texture.key == 'musicButtonOn') {
                    this.buttonMusic.getImage().setTexture('musicButtonOff')
                    SoundState.getInstance().disableSound()
                } else {
                    this.buttonMusic.getImage().setTexture('musicButtonOn')
                    SoundState.getInstance().enableSound()
                }
            },
        })
        this.buttonMusic.setScale(0.5)

        // align
        const bannerPauseZone = this.scene.add.zone(0, 0, 1300, 1050).setInteractive()
        Phaser.Display.Align.In.Center(this.bannerPause, this)
        Phaser.Display.Align.In.TopCenter(this.bannerText, bannerPauseZone)
        Phaser.Display.Align.In.Center(this.pauseText, this.bannerText, 0, -15)
        Phaser.Display.Align.In.Center(this.buttonContinue, bannerPauseZone, 0, -80)
        Phaser.Display.Align.In.Center(this.buttonReplay, this.buttonContinue, 0, 200)
        Phaser.Display.Align.In.Center(this.buttonExit, bannerPauseZone, 290, -270)
        Phaser.Display.Align.In.Center(this.buttonMusic, bannerPauseZone, -300, -265)

        this.add(this.bannerPause)
        this.add(this.bannerText)
        this.add(this.pauseText)
        this.add(this.buttonContinue)
        this.add(this.buttonReplay)
        this.add(this.buttonExit)
        this.add(this.buttonMusic)
    }

    private createButtonWithText(
        text: string,
        callBackHoverIn?: Function,
        callBackHoverOut?: Function,
        callBackClick?: Function
    ): Button {
        return new Button({
            scene: this.scene,
            x: 0,
            y: 0,
            texture: 'buttonBox',
            text: text,
            textStyle: {
                fontFamily: 'Arial',
                fontSize: '100px',
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
            },
            configure: {
                sizeButtonX: 1150,
                sizeButtonY: 350,
            },
            callBackHoverIn: () => {
                callBackHoverIn && callBackHoverIn()
            },
            callBackHoverOut: () => {
                callBackHoverOut && callBackHoverOut()
            },
            callBackClick: () => {
                PauseSceneUI.eventEmitter.emit('startButton')
                callBackClick && callBackClick()
            },
        })
    }
}

export default PauseSceneUI
