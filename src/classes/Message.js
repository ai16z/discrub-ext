/* eslint-disable no-unused-vars */
import { MessageType } from "../enum/MessageType";
import Attachment from "./Attachment";
import Author from "./Author";
import Embed from "./Embed";

class Message {
  constructor(json) {
    const {
      attachments,
      author,
      channel_id,
      components,
      content,
      edited_timestamp,
      embeds,
      flags,
      hit,
      id,
      mention_everyone,
      mentions,
      message_reference,
      pinned,
      timestamp,
      tts,
      username,
    } = json;
    const mappedAttachments = attachments.map((a) => new Attachment(a));
    const mappedEmbeds = embeds.map((e) => new Embed(e));
    Object.assign(this, json, {
      attachments: mappedAttachments,
      embeds: mappedEmbeds,
      author: new Author(author),
    });
  }

  getId() {
    return this.id;
  }

  getUserName() {
    return this.author?.getUserName();
  }

  getContent() {
    return this.content;
  }

  isReply() {
    return this.type === MessageType.REPLY;
  }

  getSafeCopy() {
    return new Message({ ...this });
  }

  getChannelId() {
    return this.channel_id;
  }

  getAvatarUrl() {
    return this.author?.avatar
      ? `https://cdn.discordapp.com/avatars/${this.author.id}/${this.author.avatar}`
      : "default_avatar.png";
  }

  getAuthor() {
    return this.author;
  }

  getEmbeds() {
    return this.embeds || [];
  }

  getAttachments() {
    return this.attachments || [];
  }

  getRichEmbeds() {
    return this.getEmbeds().filter((embed) => embed.type === "rich");
  }
}
export default Message;
