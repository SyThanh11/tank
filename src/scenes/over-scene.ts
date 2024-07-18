import SoundManager from '../sound/SoundManager'
import GameOverUI from '../ui/GameOverUI'

class GameOverScene extends Phaser.Scene {
    private backgroundImage: Phaser.GameObjects.Image
    private gameOverUI: GameOverUI
    private soundManager: SoundManager

    constructor() {
        super({
            key: 'GameOverScene',
        })

        GameOverUI.eventEmitter.on('changeScene', () => {
            this.soundManager.stopOverSound()
        })
        GameOverUI.eventEmitter.on('startButton', () => {
            this.soundManager.playClickButtonSound()
        })
    }

    init() {
        this.soundManager = new SoundManager(this)
        this.soundManager.playOverSound()
    }

    create(): void {
        this.backgroundImage = this.add.image(0, 0, 'gameOver')
        this.backgroundImage.setOrigin(0, 0)
        this.backgroundImage.setScale(0.66)

        this.gameOverUI = new GameOverUI({ scene: this, x: 0, y: 0 })
        this.gameOverUI.setScale(0)

        this.tweens.add({
            targets: this.gameOverUI,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            yoyo: false,
            ease: 'Power',
            duration: 500,
        })
    }
}

export default GameOverScene
