declare module 'eris-collector' {
  import EventEmitter from 'events';
  import { Client, Emoji, Guild, Member, Message, Textable } from 'eris'

  interface CollectorOptions {
    time?: number;
    idle?: number;
    dispose?: boolean;
  }

  interface MessageCollectorOptions extends CollectorOptions {
    max?: number;
    maxProcessed?: number;
  }

  interface ReactionCollectorOptions extends CollectorOptions {
    max?: number;
    maxEmojis?: number;
    maxUsers?: number;
  }

  abstract class BaseCollector<K, V> extends EventEmitter {
    private _timeouts: Set<NodeJS.Timeout>

    public collected: Map<K, V>

    public ended: boolean;

    private _timeout: NodeJS.Timeout | null;

    private _idletimeout: NodeJS.Timeout | null;

    public constructor(public filter: (...args: unknown[]) => boolean, public options?: CollectorOptions);
  
    private setTimeout(fn: (...args: unknown[]) => void, delay: number, ...args: unknown[]): NodeJS.Timeout;

    private clearTimeout(timeout: NodeJS.Timeout): void;

    public handleCollect(...args: unknown[]): void;
    
    public handleDispose(...args: unknown[]): void;

    public readonly next: Promise<V>

    public stop(reason: string): void;

    public resetTimer(options: Omit<CollectorOptions, 'dispose'>): void;

    public checkEnd(): void;

    public [Symbol.asyncIterator](): AsyncIterableIterator<V>;

    public abstract collect(): void;

    public abstract dispose(): void;

    public abstract endReason(): void;

    public on(event: 'collect' | 'dispose', listener: (...args: unknown[]) => void): this;

    public on(event: 'end', listener: (collected: Map<K, V>, reason: string) => void): this;

    public once(event: 'collect' | 'dispose', listener: (...args: unknown[]) => void): this;

    public once(event: 'end', listener: (collected: Map<K, V>, reason: string) => void): this;
  }

  export class MessageCollector extends BaseCollector<string, Message> {
    public received: number;

    public constructor(client: Client, public readonly channel: Textable, filter: (message: Message) => boolean, options?: MessageCollectorOptions);

    public collect(message: Message): string | null;

    public dispose(message: Message): string | null;

    public endReason(): 'limit' | 'processedLimit' | null;
    
    private _handleChannelDeletion(channel: Textable): void;

    private _handleGuildDeletion(guild: Guild): void;
  }

  export class ReactionCollector extends BaseCollector<string, Emoji> {
    public users: Map<string, User>

    public total: number;

    public constructor(client: Client, public readonly message: Message, filter: (message: Message, emoji: Emoji, member: Member) => boolean, options?: ReactionCollectorOptions);

    public collect(message: Message, emoji: Emoji): string | null;

    public dispose(message: Message, emoji: Emoji, userID: string): string | null;

    public empty(): void

    public endReason(): 'limit' | 'emojiLimit' | 'userLimit' | null;
    
    private _handleMessageDeletion(message: Message): void;

    private _handleChannelDeletion(channel: Textable): void;

    private _handleGuildDeletion(guild: Guild): void;
  }
}
