import User from '@entities/User'

export default class UserService {
  async createUser(id: string, username: string) {
    await new User({
      _id: id,
      name: username,
    }).save()
  }

  async deleteUser(id: string) {
    await User.findByIdAndDelete(id)
  }

  async getUser(id: string) {
    return await User.findById(id)
  }

  async getOrCreate(id: string, username: string) {
    let user = await User.findById(id)
    if (!user) {
      user = new User({
        _id: id,
        name: username,
      })
      await user.save()
    }

    return user
  }
}
