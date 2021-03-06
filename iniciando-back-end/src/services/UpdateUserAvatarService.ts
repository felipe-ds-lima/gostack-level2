import fs from 'fs'
import { join } from 'path'
import { getRepository } from 'typeorm'

import uploadConfig from '../config/upload'
import AppError from '../errors/AppError'
import User from '../models/User'

interface Request {
  user_id: string
  avatarFilename: string
}

class UpdateUserAvatarService {
  async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401)
    }

    if (user.avatar) {
      const userAvatarFilePath = join(uploadConfig.directory, user.avatar)

      const userAvatatFileExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatatFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }

    user.avatar = avatarFilename

    await usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService
