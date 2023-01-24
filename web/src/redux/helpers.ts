import moment from "moment";
import { useEffect } from "react";

export const getMessageAge = (createdAt: Date) => {
    const now = moment(new Date()); //todays date
    const end = moment(createdAt);
    const duration = moment.duration(now.diff(end)).asMinutes();
    let ageString = ''
    if (duration < 1) {
      ageString = 'just now'
    } else if (duration < 60) {
      ageString = Math.floor(duration)  + 'm ago';
    } else if (duration > 60 && duration < 60 * 24) {
      ageString = Math.floor(duration / 60) + 'h ago'; // minutes -> hours
    } else if (duration > 60 * 24 && duration < 60 * 24 * 7) {
      ageString = Math.floor(duration / 60 / 24) + 'd ago'; // minutes -> hours -> days
    } else {
      ageString = Math.floor(duration / 60 / 24 / 7) + 'w ago';
    }
    return ageString;
}

// Updates the height of a <textarea> when the value changes.
export const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};
