import SoundManager from '../sound/SoundManager'
import Overlay from '../ui/Overlay'
import PauseSceneUI from '../ui/PauseSceneUI'

class PauseScene extends Phaser.Scene {
    private pauseSceneUI: PauseSceneUI
    private soundManager: SoundManager
    private overlay: Overlay

    constructor() {
        super({
            key: 'PauseScene',
        })

        PauseSceneUI.eventEmitter.on('startButton', () => {
            this.soundManager.playClickButtonSound()
        })
    }

    init() {
        this.soundManager = new SoundManager(this)
    }

    create() {
        this.overlay = new Overlay(this, 0, 0)
        this.pauseSceneUI = new PauseSceneUI({
            scene: this,
            x: 0,
            y: 0,
        })
        this.pauseSceneUI.setScale(0)

        this.tweens.add({
            targets: this.pauseSceneUI,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            yoyo: false,
            ease: 'Power',
            duration: 500,
        })
    }
}

export default PauseScene
