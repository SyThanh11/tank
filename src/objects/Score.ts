class Score {
    private score: number
    private bestScore: number

    constructor() {
        this.score = 0
        this.bestScore = Number(localStorage.getItem('bestScore')) || 0
    }

    public setScore(value: number): void {
        this.score = value
    }

    public addScore(value: number): void {
        this.score = this.score + value
    }

    public setBestScore(value: number): void {
        this.bestScore = Math.max(this.bestScore, value)
        localStorage.setItem('bestScore', String(this.bestScore))
    }

    public getScore(): number {
        return this.score
    }

    public resetScore(): void {
        this.score = 0
    }

    public getBestScore(): number {
        const bestScore = localStorage.getItem('bestScore')
        if (bestScore === null) {
            return 0
        }
        return Number(bestScore)
    }

    public getScoreLocal(): number {
        return Number(localStorage.getItem('score')) || 0
    }

    public saveScore(): void {
        let bestScore = localStorage.getItem('bestScore')
        if (bestScore === null) {
            bestScore = String(this.score)
        } else {
            if (Number(bestScore) < this.score) {
                bestScore = String(this.score)
            }
        }
        localStorage.setItem('bestScore', bestScore)
        this.bestScore = Number(bestScore)

        localStorage.setItem('score', String(this.score))
    }
}

export default Score
