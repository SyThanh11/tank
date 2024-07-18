const HELPER = {
    normalizeAngleDegree: (angle: number): number => {
        return ((angle % 360) + 360) % 360
    },

    differenceBetweenAngles: (from: number, to: number): number => {
        return HELPER.normalizeAngleDegree(to - from + 180) - 180
    },
}

export default HELPER
