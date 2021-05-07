/**
 * Timer
 * @description Small utility to create a timer.
 */
export default class Timer {
  public startTime: Date

  constructor(startTime: Date) {
    this.startTime = startTime
  }

  /**
   * End the Timer
   * @returns Time Elapsed in seconds
   */
  endTimer() {
    const startTime = this.startTime.getTime()
    const endTime = new Date().getTime()
    const timeDiff = endTime - startTime

    const timeInSeconds = timeDiff / 1000

    return timeInSeconds
  }
}
