import Channel from "../../classes/channel";
import Message from "../../classes/message";
import { FilterName } from "../../enum/filter-name";
import { FilterType } from "../../enum/filter-type";
import { HasType } from "../../enum/has-type";
import { SortDirection } from "../../enum/sort-direction";

export type MessageState = {
  messages: Message[]; // Message objects
  selectedMessages: Snowflake[]; // Array of id
  filteredMessages: Message[]; // Message objects
  filters: Filter[]; // Array of object filters
  fetchProgress: FetchProgress;
  lookupUserId: Snowflake | Maybe; // The userId being looked up (during message fetch process)
  isLoading: boolean | Maybe;
  order: SortDirection;
  orderBy: keyof Message;
  searchBeforeDate: Date | Maybe;
  searchAfterDate: Date | Maybe;
  totalSearchMessages: number;
  searchMessageContent: string | Maybe;
  selectedHasTypes: HasType[];
};

export type FetchProgress = {
  messageCount: number;
  channelId: Snowflake | Maybe;
  threadCount: number;
  parsingThreads: boolean;
};

export type Filter =
  | {
      filterName?: undefined;
      filterValue: Snowflake | Maybe;
      filterType: FilterType.THREAD;
    }
  | {
      filterValue: string | Maybe;
      filterType: FilterType.TEXT;
      filterName:
        | FilterName.ATTACHMENT_NAME
        | FilterName.CONTENT
        | keyof Message;
    }
  | {
      filterValue: Date | Maybe;
      filterType: FilterType.DATE;
      filterName: FilterName.END_TIME | FilterName.START_TIME;
    }
  | {
      filterValue: boolean;
      filterType: FilterType.TOGGLE;
      filterName: FilterName.INVERSE;
    };

export type DeleteConfiguration = {
  attachments: boolean;
  messages: boolean;
};

export type MessageData = {
  threads: Channel[];
  messages: Message[];
};

export type SearchMessageProps = {
  preFilterUserId?: string | Maybe;
  searchAfterDate?: Date | Maybe;
  searchBeforeDate?: Date | Maybe;
  searchMessageContent?: string | Maybe;
  selectedHasTypes?: string[];
};
