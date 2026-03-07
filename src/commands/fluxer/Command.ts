import { Message } from '@fluxerjs/core';

interface ICommand {
  name: string;
  description: string;
  execute?: () => Promise<unknown | void>;
  reponse?: string | ((result: unknown) => string);
  respondsTo: (command: string) => boolean;
  respond: (
    message: Message,
    response?: string | ((result: unknown) => string),
  ) => Promise<void>;
}

type CommandOptions = {
  name: string;
  description: string;
  execute?: () => Promise<unknown | void>;
  response?: string | ((result: unknown) => string);
};

type CommandResponse =
  | string
  | (() => string)
  | ((result: unknown | void) => string);

/**
 * @class Command
 * @implements ICommand
 * @description This class represents a command that can be executed by the bot. It implements the ICommand interface and provides a constructor to initialize the command's name, description, and execute function. The respondsTo method can be used to determine if the command should respond to a given input.
 * This is a simple command class that can be used to create commands for the bot.
 */
class Command implements ICommand {
  public name: string;
  public description: string;
  public execute?: () => Promise<unknown | void>;
  public response?: string | ((result: unknown) => string);

  constructor({ name, description, execute, response }: CommandOptions) {
    this.name = name;
    this.description = description;
    this.execute = execute;
    this.response = response;
  }

  /**
   * Returns a string representation of the command.
   * @returns A string representing the command
   */
  public toString(): string {
    return `> ${this.name} - ${this.description}`;
  }

  /**
   * Evaluates if the command should respond to a given command string.
   * @param command
   * @returns A boolean determining if this Command will respond to the given command string
   */
  public respondsTo(command: string): boolean {
    return this.name === command;
  }

  /**
   * Executes the command provided in the constructor and optionally sends a response to the message that triggered the command.
   * @param message A Message object representing the message that triggered the command
   * @param response An optional string or function that generates a string to be sent as a reply to the message after the command is executed. If it's a function, it will be called with the result of the execute function and should return a string.
   * @returns A promise that resolves when the response has been sent
   */
  public async respond(
    message: Message,
    response?: CommandResponse,
  ): Promise<void> {
    if (!this.respondsTo(message.content)) {
      return;
    }

    let result: unknown;
    if (this.execute) {
      result = await this.execute();
    }

    let responseMessage = null;
    if (typeof response === 'function') {
      responseMessage = response(result);
    } else if (response) {
      responseMessage = response;
    } else if (this.response) {
      if (typeof this.response === 'function') {
        responseMessage = this.response(result);
      } else {
        responseMessage = this.response;
      }
    } else if (typeof result === 'string') {
      responseMessage = result;
    }

    if (responseMessage) {
      await message.reply(responseMessage);
    }
  }
}

export default Command;
