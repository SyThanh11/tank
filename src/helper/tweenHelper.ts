const TWEEN_HELPER = {
    tweenScaleAndAlpha: (
        scene: Phaser.Scene,
        targets: Phaser.GameObjects.GameObject,
        scaleX: number,
        scaleY: number,
        alpha: number,
        duration: number,
        yoyo: boolean,
        ease: string,
        onComplete?: Function
    ) => {
        scene.tweens.add({
            targets,
            scaleX,
            scaleY,
            alpha,
            duration,
            yoyo,
            ease,
            onComplete: () => {
                onComplete && onComplete()
            },
        })
    },
}

export default TWEEN_HELPER
