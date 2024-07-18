interface IContainerConstructor {
    scene: Phaser.Scene
    x?: number
    y?: number
    children?: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]
}

export default IContainerConstructor
