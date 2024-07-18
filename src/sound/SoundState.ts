class SoundState {
    private static instance: SoundState | null = null
    private soundEnabled: boolean

    private constructor() {
        this.soundEnabled = true
    }

    public static getInstance(): SoundState {
        if (!SoundState.instance) {
            SoundState.instance = new SoundState()
        }
        return SoundState.instance
    }

    public isSoundEnabled(): boolean {
        return this.soundEnabled
    }

    public enableSound(): void {
        this.soundEnabled = true
    }

    public disableSound(): void {
        this.soundEnabled = false
    }
}

export default SoundState
