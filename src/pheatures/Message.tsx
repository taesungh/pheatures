import Dependency from "./Dependency";
import FeatureChange from "./FeatureChange";

enum MessageType {
  error = "error",
  warning = "warning",
  info = "info",
}

class Message {
  type: MessageType;
  title: string;
  detail: JSX.Element;

  constructor(type: MessageType, title: string, detail: JSX.Element) {
    this.type = type;
    this.title = title;
    this.detail = detail;
  }

  static notMinimal(): Message {
    return new Message(
      MessageType.warning,
      "Selection is not minimal",
      <p>The selected set of sounds can be described by removing a selected feature</p>
    );
  }

  static redundantSelection(): Message {
    return new Message(
      MessageType.warning,
      "Unnecessary features are selected",
      (
        <p>
          The selection contains unnecessary features. A feature could be omitted to select a larger
          set of sounds, but the transformation will not change those sounds.
        </p>
      )
    );
  }

  static redundantChange(change: FeatureChange): Message {
    return new Message(
      MessageType.warning,
      "Some feature changes are redundant",
      <p>The selected sounds already have the following features set: {change.toString()}</p>
    );
  }

  static dependency(dependencies: Dependency[]): Message {
    return new Message(
      MessageType.info,
      "Additional feature changes were added",
      (
        <ul>
          {dependencies.map((dependency) => (
            <li key={dependency.from.toString()}>
              Because {dependency.from.toString()} was selected, the change{" "}
              {dependency.to.toString()} was also applied
            </li>
          ))}
        </ul>
      )
    );
  }
}

export default Message;
