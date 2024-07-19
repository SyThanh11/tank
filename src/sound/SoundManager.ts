class SoundManager {
    private explosionSound: Phaser.Sound.BaseSound
    private hitSound: Phaser.Sound.BaseSound
    private overSound: Phaser.Sound.BaseSound
    private moveSound: Phaser.Sound.BaseSound
    private startSound: Phaser.Sound.BaseSound
    private clickButtonSound: Phaser.Sound.BaseSound
    private hitTankSound: Phaser.Sound.BaseSound
    private hitObstacleSound: Phaser.Sound.BaseSound

    constructor(scene: Phaser.Scene) {
        this.explosionSound = scene.sound.add('explosion')
        this.hitSound = scene.sound.add('hit')
        this.overSound = scene.sound.add('overSound', {
            loop: true,
        })
        this.moveSound = scene.sound.add('move', {
            loop: true,
        })
        this.startSound = scene.sound.add('startMenu', {
            loop: true,
        })
        this.clickButtonSound = scene.sound.add('clickButton')
        this.hitTankSound = scene.sound.add('hitTank')
        this.hitObstacleSound = scene.sound.add('hitObstacle')
    }

    public playExplosionSound(): void {
        if (this.explosionSound.isPlaying) {
            this.explosionSound.stop()
        }
        this.explosionSound.play()
    }

    public stopExplosionSound(): void {
        this.explosionSound.stop()
    }

    public playHitSound(): void {
        if (this.hitSound.isPlaying) {
            this.hitSound.stop()
        }
        this.hitSound.play()
    }

    public stopHitSound(): void {
        this.hitSound.stop()
    }

    public playOverSound(): void {
        if (this.overSound.isPlaying) {
            this.overSound.stop()
        }
        this.overSound.play()
    }

    public stopOverSound(): void {
        this.overSound.stop()
    }

    public playMoveSound(): void {
        if (this.moveSound.isPlaying) {
            this.moveSound.stop()
        }
        this.moveSound.play()
    }

    public stopMoveSound(): void {
        this.moveSound.stop()
    }

    public isMoveSoundPlaying(): boolean {
        return this.moveSound.isPlaying
    }

    public playStartMenuSound(): void {
        if (this.startSound.isPlaying) {
            this.startSound.stop()
        }
        this.startSound.play()
        this.startSound.resume()
    }

    public stopStartMenuSound(): void {
        this.startSound.stop()
    }

    public playClickButtonSound(): void {
        if (this.clickButtonSound.isPlaying) {
            this.clickButtonSound.stop()
        }
        this.clickButtonSound.play()
    }

    public stopClickButtonSound(): void {
        this.clickButtonSound.stop()
    }

    public playHitTankSound(): void {
        if (this.hitTankSound.isPlaying) {
            this.hitTankSound.stop()
        }
        this.hitTankSound.play()
    }

    public stopHitTankSound(): void {
        this.hitTankSound.stop()
    }

    public playHitObstacleSound(): void {
        if (this.hitObstacleSound.isPlaying) {
            this.hitObstacleSound.stop()
        }
        this.hitObstacleSound.play()
    }

    public stopHitObstacleSound(): void {
        this.hitObstacleSound.stop()
    }

    public stopAllSound(): void {
        this.explosionSound.stop()
        this.hitSound.stop()
        this.moveSound.stop()
    }
}

export default SoundManager
