interface IButtonContructor {
    scene: Phaser.Scene
    x: number
    y: number
    children?: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]
    texture?: string
    text?: string
    textStyle?: object
    callBackClick?: Function
    callBackHoverIn?: Function
    callBackHoverOut?: Function
    configure?: {
        sizeButtonX: number
        sizeButtonY: number
    }
}

export default IButtonContructor
