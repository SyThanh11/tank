import IButtonContructor from '../interfaces/button.interface'

class Button extends Phaser.GameObjects.Container {
    private image: Phaser.GameObjects.Image
    private text: Phaser.GameObjects.Text

    constructor(aParams: IButtonContructor) {
        if (!Array.isArray(aParams.children) && aParams.children !== undefined) {
            aParams.children = [aParams.children]
        }

        super(aParams.scene, aParams.x, aParams.y, aParams.children)

        this.init(aParams)
        this.scene.add.existing(this)

        this.setInteractive({
            useHandCursor: true,
        })
            .on('pointerover', () => {
                if (aParams.callBackHoverIn) {
                    aParams.callBackHoverIn()
                }
            })
            .on('pointerout', () => {
                if (aParams.callBackHoverOut) {
                    aParams.callBackHoverOut()
                }
            })
            .on('pointerdown', () => {
                if (aParams.callBackClick) {
                    aParams.callBackClick()
                }
            })
    }

    private init(aParams: IButtonContructor) {
        if (aParams?.text && aParams?.textStyle) {
            this.text = this.scene.add.text(0, 0, aParams.text, aParams.textStyle).setOrigin(0.5)
        }

        if (aParams?.texture) {
            this.image = this.scene.add.image(0, 0, aParams?.texture).setOrigin(0.5, 0.5)
        }

        if (aParams?.configure) {
            this.setSize(aParams.configure.sizeButtonX, aParams?.configure.sizeButtonY)
        }

        this.image && this.add(this.image)
        this.text && this.add(this.text)
    }

    public getImage(): Phaser.GameObjects.Image {
        return this.image
    }

    public getText(): Phaser.GameObjects.Text {
        return this.text
    }
}

export default Button
