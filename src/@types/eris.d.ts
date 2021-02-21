import { Channel, Embed, Message, TextChannel, Collection, Member, Constants, Role, Guild } from 'eris'

declare module 'eris' {
  export class Textable {
    public awaitMessages(
      filter: (message: Message) => boolean,
      options: {
        time: number
        maxMatches: number
      }
    ): Promise<Message[]>;

    public createCode(code: string, lang: string): Promise<Message>;

    public createEmbed(embed: Embed): Promise<Message>;

    public sendCode(code: string, lang: string): Promise<Message>;

    public sendEmbed(embed: Embed): Promise<Message>;

    public sendMessage(...args: Parameters<TextChannel['createMessage']>): Promise<Message>;
  }

  export class Client {
    public createCode(channelID: string, code: string, lang: string): Promise<Message>;

    public createEmbed(channelID: string, embed: Embed): Promise<Message>;
  }

  export class CodeBlock {
    public constructor(public content: string, public lang: string);

    public content(content: string): this;

    public language(lang: string): this;
  }

  export class Guild {
    public findMembers(query: string): Collection<Member>;

    public me: Member;
  }

  export class GuildChannel {
    public memberHasPermission(memberID: string, perm: keyof typeof Constants.AuditLogActions): boolean;
  }

  export class Member {
    public bannable: boolean;

    public createMessage(...args: Parameters<TextChannel['createMessage']>): Promise<Message>;

    public effectivePermission: string;

    public hasPermission(perm: keyof typeof Constants.AuditLogActions): boolean;

    public hasRole(roleID: string): boolean;

    public highestRole: Role;

    public color: string;

    public kickable: boolean;

    public punishable(member: Member): boolean;

    public roleObjects: Role[];

    public sendMessage(...args: Parameters<TextChannel['createMessage']>): Promise<Message>;
  }

  export class Message {
    public guild: Guild;
  }

  export class Role {
    public addable: boolean;

    public higherThan(role: Role): boolean;
  }

  export class User {
    public sendMessage(...args: Parameters<TextChannel['createMessage']>): Promise<Message>;
  }
}
