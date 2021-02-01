import { Message, Textable } from 'eris'

declare module 'eris' {
  export interface Textable {
    awaitMessages(
      filter: any,
      options: {
        time: number
        maxMatches: number
      }
    ): Promise<Array<Message>>
  }
}
