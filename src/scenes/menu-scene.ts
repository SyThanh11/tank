import CONST from '../const/const'
import SoundManager from '../sound/SoundManager'

export class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key | undefined
    private backgroundImage: Phaser.GameObjects.Image
    private blinkingText: Phaser.GameObjects.Text
    private soundManager: SoundManager

    constructor() {
        super({
            key: 'MenuScene',
        })
    }

    init(): void {
        this.startKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        if (this.startKey) {
            this.startKey.isDown = false
        }
    }

    create(): void {
        this.soundManager = new SoundManager(this)
        this.soundManager.playStartMenuSound()
        this.backgroundImage = this.add.image(0, 0, 'mainMenu')
        this.backgroundImage.setOrigin(0, 0)
        this.backgroundImage.setScale(2)

        const textStyle = {
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
        }
        this.blinkingText = this.add.text(
            CONST.SCENE.MAX_WIDTH / 2,
            CONST.SCENE.MAX_HEIGHT / 2,
            'Press S to start',
            textStyle
        )
        this.blinkingText.setOrigin(0.5)

        this.tweens.add({
            targets: this.blinkingText,
            alpha: 0,
            ease: 'Linear',
            duration: 500,
            repeat: -1,
            yoyo: true,
        })

        this.input.keyboard?.once('keydown-S', () => {
            this.soundManager.stopStartMenuSound()
            const fx = this.cameras.main.postFX.addWipe()

            this.scene.transition({
                target: 'GameScene',
                duration: 2000,
                moveBelow: true,
                onUpdate: (progress: any) => {
                    fx.progress = progress
                },
            })
        })
    }
}
