import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import Web3Auth from '@web3auth/node-sdk'
import * as bcrypt from 'bcrypt'
import { CreateAccountDto, ReturnAccountDto, ReturnTokenDto, SignInDto, SignInWithSocialDto } from './dtos/auth.dto'
import { PersonEntity } from 'src/db/entities/person'
import { Message, MessageName } from 'src/common/message'
import { config } from 'src/config'
import { ReturnMessageBase } from 'src/common/interface/returnBase'
import { RoleEntity } from '@/db/entities/role'
import { TokenPayload } from 'src/common/types'

const web3AuthNetwork = 'testnet'
const clientId = 'BOAVY7JsleeYdhThRhwt2w7iBgqrNzroFXSIVrKOtF8lyrzdgss-wuGgUPMcmQPuJ5M4ECgWaS4KHBR5d2xzTSU'
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: '0x3', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
  rpcTarget: 'https://api.devnet.solana.com',
  displayName: 'Solana Devnet',
  blockExplorer: 'https://explorer.solana.com',
  ticker: 'SOL',
  tickerName: 'Solana Token'
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PersonEntity)
    private personRepository: Repository<PersonEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private jwtService: JwtService
  ) {}

  async signUp({ email, name, password, role }: CreateAccountDto): Promise<ReturnAccountDto> {
    const personExist = await this.personRepository.findOne({ where: { email } })

    if (personExist) {
      throw new BadRequestException(Message.Base.Exists(MessageName.user))
    }

    const hashPassword = this.hashData(password)

    const rolePerson = await this.roleRepository.findOne({ where: { role } })
    const personData = this.personRepository.create({
      email,
      name,
      password: hashPassword,
      rolePerson
    })
    const newPerson = await this.personRepository.save(personData)
    const tokens = await this.getTokens(newPerson.id, email)
    const hashRefreshToken = this.hashData(tokens.refreshToken)
    newPerson.refreshToken = hashRefreshToken
    await this.personRepository.update({ id: newPerson.id }, { refreshToken: hashRefreshToken })

    delete newPerson.password

    return {
      ...tokens,
      person: newPerson
    }
  }

  async signIn({ email, password }: SignInDto): Promise<ReturnAccountDto> {
    const person = await this.personRepository.findOne({ where: { email } })

    if (!person) {
      throw new BadRequestException(Message.Base.NotFound(MessageName.user))
    }

    const passwordMatches = person.comparePassword(password)
    if (!passwordMatches) {
      throw new BadRequestException(Message.Base.NotFound(MessageName.user))
    }

    const tokens = await this.getTokens(person.id, person.email)
    await this.updateRefreshToken(person.id, tokens.refreshToken)

    delete person.password

    return {
      ...tokens,
      person
    }
  }

  async signInWithSocial({ publicKey }: SignInWithSocialDto, authorization: string): Promise<ReturnAccountDto> {
    const idToken = authorization.replace('Bearer ', '')

    try {
      const web3auth = new Web3Auth({
        clientId,
        chainConfig,
        web3AuthNetwork
      })

      web3auth.init()

      const connect = async () => {
        await web3auth
          .connect({
            verifier: 'ppp-custom-devnet',
            verifierId: 'sub',
            idToken
          })
          .then(() => {
            console.log('Successfully connected to Web3Auth')
          })
          .catch(error => {
            console.log(error)
          })
      }
      await connect()

      const decodedToken: TokenPayload = this.jwtService.decode(idToken) as TokenPayload

      if (!decodedToken) {
        throw new ForbiddenException(Message.Base.AccessDenied())
      }

      if (decodedToken?.email) {
        const person = await this.personRepository.findOne({ where: { email: decodedToken.email } })

        if (!person) {
          await this.personRepository.save({
            email: decodedToken.email,
            name: decodedToken.name,
            role: 'USER'
          })
          return {
            accessToken: idToken,
            person,
            refreshToken: ''
          }
        } else {
          return {
            accessToken: idToken,
            person,
            refreshToken: ''
          }
        }
      }

      throw new ForbiddenException(Message.Base.NotFound('Not found email'))
    } catch (error) {
      console.log(error)
    }
  }

  async logOut(personId: number): Promise<ReturnMessageBase> {
    await this.personRepository.update({ id: personId }, { refreshToken: null })

    return {
      success: true,
      message: 'Log out successfully'
    }
  }

  async refreshToken(personId: number, refreshToken: string): Promise<ReturnTokenDto> {
    const person = await this.personRepository.findOne({ where: { id: personId } })

    if (!person?.refreshToken) {
      throw new ForbiddenException(Message.Base.AccessDenied())
    }

    const refreshTokenMatches = bcrypt.compareSync(refreshToken, person.refreshToken)

    if (!refreshTokenMatches) {
      throw new ForbiddenException(Message.Base.AccessDenied())
    }

    const tokens = await this.getTokens(person.id, person.email)

    await this.updateRefreshToken(person.id, tokens.refreshToken)

    return tokens
  }

  async updateRefreshToken(personId: number, refreshToken: string) {
    const hashRefreshToken = this.hashData(refreshToken)

    await this.personRepository.update({ id: personId }, { refreshToken: hashRefreshToken })
  }

  async getTokens(personId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: personId,
          email
        },
        {
          secret: config.secrets.accessToken,
          expiresIn: '30m'
        }
      ),
      this.jwtService.signAsync(
        {
          sub: personId,
          email
        },
        {
          secret: config.secrets.refreshToken,
          expiresIn: '7d'
        }
      )
    ])

    return {
      accessToken,
      refreshToken
    }
  }

  hashData(data: string) {
    return bcrypt.hashSync(data, config.bcrypt.salt)
  }
}
