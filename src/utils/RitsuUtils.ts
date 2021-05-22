import { AxiosError } from 'axios'
import { Constants, Member } from 'eris'

export default {
  randomIntBetween(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  },

  randomValueInArray<T extends unknown>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  },

  isAxiosError(err: unknown): err is AxiosError {
    return (err as AxiosError).isAxiosError
  },

  userHasPermissions(guildMember: Member, permissions: unknown[]) {
    if (!permissions) return // Sometimes the permissions array is null

    for (const permission of permissions) {
      // Typescript for some reason doens't allow type annotations in for..of loops.
      if (
        !guildMember.permissions.has(
          permission as keyof Constants['Permissions']
        )
      )
        return false
    }

    return true
  },
}
